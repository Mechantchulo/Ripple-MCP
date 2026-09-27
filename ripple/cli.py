"""
ripple/cli.py — Ripple command-line interface

Entry point: `ripple` (registered via pyproject.toml [project.scripts])

Subcommands:
    ripple init          — initialise Ripple for the current project
    ripple auth github   — store a GitHub Personal Access Token
    ripple doctor        — health-check the current configuration
    ripple serve         — start the MCP server over STDIO

All subcommands operate relative to the CURRENT WORKING DIRECTORY.
"""

from __future__ import annotations

import json
import pathlib
import sys
import urllib.error
import urllib.request


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _ok(msg: str) -> None:
    print(f"  \033[32m✓\033[0m  {msg}")


def _warn(msg: str) -> None:
    print(f"  \033[33m!\033[0m  {msg}")


def _fail(msg: str) -> None:
    print(f"  \033[31m✗\033[0m  {msg}")


# ---------------------------------------------------------------------------
# ripple init
# ---------------------------------------------------------------------------

def cmd_init() -> None:
    """Initialise Ripple for the current project."""
    from ripple.config import (
        detect_branch,
        detect_github_repo,
        detect_git_root,
        get_project_root,
        load_project_config,
        save_project_config,
    )
    from ripple.auth import is_github_authenticated

    # Resolve the project root from CWD (not via get_project_root(), which
    # would respect RIPPLE_PROJECT_ROOT — during init we always use CWD).
    cwd = pathlib.Path.cwd().resolve()
    git_root = detect_git_root(cwd=cwd)
    project_root = git_root if git_root else cwd

    if git_root is None:
        print("Warning: current directory is not a Git repository.")
        print("Ripple will still initialise, but Git-based features will be limited.")

    existing = load_project_config()

    github_repo = (
        existing.get("github_repo")
        or detect_github_repo(cwd=project_root)
        or ""
    )
    branch = (
        existing.get("branch")
        or detect_branch(cwd=project_root)
        or "main"
    )
    health_url = (
        existing.get("health_url")
        or "http://localhost:8000/health"
    )

    config = {
        "github_repo": github_repo,
        "branch": branch,
        "health_url": health_url,
    }
    save_project_config(config)

    # --- Write / update .bob/mcp.json ---
    bob_config_path = project_root / ".bob" / "mcp.json"
    _write_bob_mcp_json(bob_config_path, project_root=project_root, github_repo=github_repo)

    # --- Print summary ---
    print()
    print("Ripple initialized")
    print()
    print(f"  Project root:     {project_root}")
    print(f"  Repository:       {github_repo or '(not detected)'}")
    print(f"  Branch:           {branch}")
    print(f"  Health endpoint:  {health_url}")
    print(f"  GitHub auth:      {'configured' if is_github_authenticated() else 'not configured'}")
    print(f"  MCP config:       {bob_config_path.relative_to(project_root)}")
    print(f"  Tools:            7")
    print()
    if not is_github_authenticated():
        print("Next:")
        print("  ripple auth github")
        print("  ripple doctor")
    else:
        print("Next:")
        print("  ripple doctor")
    print()


def _write_bob_mcp_json(
    path: pathlib.Path,
    project_root: pathlib.Path | None = None,
    github_repo: str = "",
) -> None:
    """
    Create or update .bob/mcp.json so Bob uses the global `ripple serve` command.

    Writes RIPPLE_PROJECT_ROOT (and RIPPLE_GITHUB_REPO when known) into the env
    block so that a globally-installed `ripple serve` (e.g. via pipx) always
    targets this project directory — regardless of where pipx starts the process.

    Preserves any existing mcpServers entries that are not named 'ripple'.
    """
    path.parent.mkdir(parents=True, exist_ok=True)

    existing: dict = {}
    if path.exists():
        try:
            existing = json.loads(path.read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            existing = {}

    if not isinstance(existing, dict):
        existing = {}
    servers = existing.get("mcpServers", {})
    if not isinstance(servers, dict):
        servers = {}

    # Build the env block — always include RIPPLE_PROJECT_ROOT
    env: dict[str, str] = {}
    if project_root is not None:
        env["RIPPLE_PROJECT_ROOT"] = str(project_root.resolve())
    if github_repo:
        env["RIPPLE_GITHUB_REPO"] = github_repo

    # Update only the ripple entry — preserve everything else
    ripple_entry: dict = {
        "command": "ripple",
        "args": ["serve"],
    }
    if env:
        ripple_entry["env"] = env

    servers["ripple"] = ripple_entry
    existing["mcpServers"] = servers
    path.write_text(json.dumps(existing, indent=2) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# ripple auth
# ---------------------------------------------------------------------------

def cmd_auth(args: list[str]) -> None:
    """Handle: ripple auth <provider>"""
    if not args or args[0] != "github":
        print("Usage: ripple auth github")
        sys.exit(1)
    _auth_github()


def _auth_github() -> None:
    from ripple.auth import prompt_and_store_github_token
    success = prompt_and_store_github_token()
    if not success:
        sys.exit(1)


# ---------------------------------------------------------------------------
# ripple doctor
# ---------------------------------------------------------------------------

def cmd_doctor() -> None:
    """Run a health check on the current Ripple configuration."""
    from ripple.config import (
        detect_branch,
        detect_git_root,
        get_github_repo,
        get_health_url,
        get_project_root,
    )
    from ripple.auth import auth_status, get_github_token

    print()
    print("Ripple Doctor")
    print("─" * 44)

    # 1. Ripple installation
    try:
        import ripple  # noqa: F401
        _ok("Ripple installation")
    except ImportError:
        _fail("Ripple installation — package not found")

    # 2. Project root
    project_root = get_project_root()
    _ok(f"Project root             {project_root}")

    # 3. Git repository
    git_root = detect_git_root(cwd=project_root)
    if git_root:
        _ok(f"Git repository           detected  ({git_root})")
    else:
        _warn("Git repository           not detected")

    # 4. Ripple config file
    ripple_config = project_root / ".ripple" / "config.json"
    if ripple_config.exists():
        _ok(f"Ripple config            found  ({ripple_config.relative_to(project_root)})")
    else:
        _warn("Ripple config            not found  (run: ripple init)")

    # 5. Bob MCP config
    bob_mcp = project_root / ".bob" / "mcp.json"
    if bob_mcp.exists():
        _ok(f"Bob MCP config           found  ({bob_mcp.relative_to(project_root)})")
    else:
        _warn("Bob MCP config           not found  (run: ripple init)")

    # 6. Branch
    branch = detect_branch(cwd=project_root) or "(none)"
    if branch != "(none)":
        _ok(f"Current branch           {branch}")
    else:
        _warn("Current branch           not detected")

    # 7. GitHub repository
    repo = get_github_repo()
    if repo:
        _ok(f"GitHub repository        {repo}")
    else:
        _warn("GitHub repository        not configured  (run: ripple init)")

    # 8. GitHub authentication
    status = auth_status()
    if status["configured"]:
        _ok(f"GitHub auth              configured  via {status['source']}")
    else:
        _warn("GitHub auth              not configured  (run: ripple auth github)")

    # 9. GitHub API connectivity
    token = get_github_token()
    _check_github_api(token)

    # 10. Health URL config
    health_url = get_health_url()
    _ok(f"Health URL               {health_url}")

    # 11. Health endpoint reachability
    _check_health_endpoint(health_url)

    # 12. MCP server ready
    _check_mcp_server()

    # 13. Tool count
    _check_tool_count()

    print()


def _check_github_api(token: str | None) -> None:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        req = urllib.request.Request("https://api.github.com/rate_limit", headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        remaining = data.get("resources", {}).get("core", {}).get("remaining", "?")
        _ok(f"GitHub API               reachable  (rate limit remaining: {remaining})")
    except urllib.error.HTTPError as exc:
        _fail(f"GitHub API               HTTP {exc.code}")
    except Exception as exc:  # noqa: BLE001
        _warn(f"GitHub API               unreachable  ({exc})")


def _check_health_endpoint(url: str) -> None:
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=4) as resp:
            _ok(f"Health endpoint          reachable  (HTTP {resp.status})")
    except urllib.error.HTTPError as exc:
        _warn(f"Health endpoint          responded with HTTP {exc.code}")
    except Exception:  # noqa: BLE001
        _warn(f"Health endpoint          unreachable  (app may not be running)")


def _check_mcp_server() -> None:
    try:
        from server.main import mcp  # noqa: F401
        _ok("MCP server               importable")
    except Exception as exc:  # noqa: BLE001
        _fail(f"MCP server               import error: {exc}")


def _check_tool_count() -> None:
    import asyncio
    try:
        from server.main import mcp
        tools = asyncio.run(mcp.list_tools())
        count = len(tools)
        if count == 7:
            _ok(f"Registered tools         {count}  ✓")
        else:
            _warn(f"Registered tools         {count}  (expected 7)")
    except Exception as exc:  # noqa: BLE001
        _fail(f"Registered tools         could not list: {exc}")


# ---------------------------------------------------------------------------
# ripple serve
# ---------------------------------------------------------------------------

def cmd_serve() -> None:
    """Start the Ripple MCP server over STDIO."""
    # Load .env from the current project (if present) before importing server
    try:
        from dotenv import load_dotenv
        from ripple.config import get_project_root
        load_dotenv(dotenv_path=get_project_root() / ".env")
    except ImportError:
        pass  # dotenv not available — env vars must be set manually

    # server/main.py discovers project config via ripple.config (CWD-relative)
    from server.main import mcp
    mcp.run(transport="stdio")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

USAGE = """\
Ripple — MCP operational gateway for coding agents

Usage:
  ripple init              Initialise Ripple for the current project
  ripple auth github       Store a GitHub Personal Access Token
  ripple doctor            Check the current project configuration
  ripple serve             Start the MCP server over STDIO

  ripple --help / -h       Show this message
  ripple --version / -v    Show installed version
"""


def main() -> None:
    args = sys.argv[1:]

    if not args or args[0] in ("--help", "-h", "help"):
        print(USAGE)
        return

    if args[0] in ("--version", "-v", "version"):
        try:
            from importlib.metadata import version
            print(f"ripple {version('ripple-mcp')}")
        except Exception:  # noqa: BLE001
            print("ripple (version unknown)")
        return

    cmd = args[0]
    rest = args[1:]

    if cmd == "init":
        cmd_init()
    elif cmd == "auth":
        cmd_auth(rest)
    elif cmd == "doctor":
        cmd_doctor()
    elif cmd == "serve":
        cmd_serve()
    else:
        print(f"Unknown command: {cmd}")
        print(USAGE)
        sys.exit(1)
