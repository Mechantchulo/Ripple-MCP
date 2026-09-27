"""
ripple/config.py — project configuration discovery

Priority order for every setting:
  1. Environment variable (RIPPLE_*)           — always wins
  2. .ripple/config.json in the current project — per-project config
  3. Auto-detection from git remote / branch    — best-effort fallback
  4. Hard-coded default                         — last resort

This module is imported by the CLI and by all MCP tool modules.
It operates relative to the resolved project root, which honours the
RIPPLE_PROJECT_ROOT environment variable so that a globally-installed
`ripple serve` (e.g. via pipx) always targets the developer's project,
not the pipx installation directory.
"""

from __future__ import annotations

import json
import os
import pathlib
import re
import subprocess
import urllib.parse
from typing import Any

# ---------------------------------------------------------------------------
# Paths — resolved against project root, not the Ripple pkg install dir
# ---------------------------------------------------------------------------

CONFIG_FILE = pathlib.Path(".ripple") / "config.json"


# ---------------------------------------------------------------------------
# Git helpers (operate on a given directory)
# ---------------------------------------------------------------------------

def _git(args: list[str], cwd: str | pathlib.Path | None = None) -> str | None:
    """Run a git command in *cwd* (defaults to CWD). Returns stdout or None on failure."""
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            text=True,
            check=False,
            timeout=5,
            cwd=str(cwd) if cwd is not None else None,
        )
        return result.stdout.strip() if result.returncode == 0 else None
    except Exception:  # noqa: BLE001
        return None


def detect_git_root(cwd: str | pathlib.Path | None = None) -> pathlib.Path | None:
    """Return the root of the git repository containing *cwd* (or CWD), or None."""
    out = _git(["rev-parse", "--show-toplevel"], cwd=cwd)
    return pathlib.Path(out) if out else None


def detect_branch(cwd: str | pathlib.Path | None = None) -> str | None:
    """Return the current branch name, or None if detached / no repo."""
    # symbolic-ref also works for a newly initialized repository before its
    # first commit. Fall back to rev-parse for older Git versions.
    out = _git(["symbolic-ref", "--quiet", "--short", "HEAD"], cwd=cwd)
    if not out:
        out = _git(["rev-parse", "--abbrev-ref", "HEAD"], cwd=cwd)
    return out if out and out != "HEAD" else None


def detect_github_repo(cwd: str | pathlib.Path | None = None) -> str | None:
    """
    Derive owner/repo from the git remote URL.
    Handles SSH (git@github.com:owner/repo.git) and HTTPS forms.
    Returns None on any failure.
    """
    url = _git(["remote", "get-url", "origin"], cwd=cwd)
    if not url:
        return None
    slug: str | None = None
    if url.startswith("git@github.com:"):
        slug = url[len("git@github.com:"):]
    else:
        parsed = urllib.parse.urlparse(url)
        if parsed.hostname == "github.com":
            slug = parsed.path.lstrip("/")

    if not slug:
        return None
    slug = slug.removesuffix(".git").rstrip("/")
    return slug if re.fullmatch(r"[^/\s]+/[^/\s]+", slug) else None


# ---------------------------------------------------------------------------
# Config file read/write
# ---------------------------------------------------------------------------

def get_config_file() -> pathlib.Path:
    """Return the current project's configuration path."""
    return get_project_root() / CONFIG_FILE


def load_project_config() -> dict[str, Any]:
    """
    Read .ripple/config.json from the current project root, or return {} if absent.
    Never raises.
    """
    try:
        data = json.loads(get_config_file().read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except FileNotFoundError:
        return {}
    except Exception:  # noqa: BLE001
        return {}


def save_project_config(data: dict[str, Any]) -> None:
    """
    Write .ripple/config.json in the current project root.
    """
    config_file = get_config_file()
    config_file.parent.mkdir(parents=True, exist_ok=True)
    config_file.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Resolved accessors — used by MCP tools
# ---------------------------------------------------------------------------

def get_github_repo() -> str | None:
    """
    Resolved GitHub repo slug (owner/repo).
    Priority: env var → project config → git remote auto-detection from project root.
    """
    return (
        os.environ.get("RIPPLE_GITHUB_REPO")
        or load_project_config().get("github_repo")
        or detect_github_repo(cwd=get_project_root())
    )


def get_github_branch() -> str:
    """
    Resolved branch name.
    Priority: env var → project config → current git branch from project root → "main".
    """
    return (
        os.environ.get("RIPPLE_GITHUB_BRANCH")
        or load_project_config().get("branch")
        or detect_branch(cwd=get_project_root())
        or "main"
    )


def get_health_url() -> str:
    """
    Resolved health endpoint URL.
    Priority: env var → project config → default.
    """
    return (
        os.environ.get("RIPPLE_HEALTH_URL")
        or load_project_config().get("health_url")
        or "http://localhost:8000/health"
    )


def get_project_root() -> pathlib.Path:
    """
    Resolve the current project root.

    Priority:
      1. RIPPLE_PROJECT_ROOT environment variable (must exist on disk)
      2. Git repository root detected from CWD
      3. CWD fallback

    This ensures a globally-installed `ripple serve` (e.g. via pipx) always
    operates on the developer's project, not the pipx install directory.
    """
    env_root = os.environ.get("RIPPLE_PROJECT_ROOT", "").strip()
    if env_root:
        candidate = pathlib.Path(env_root)
        if candidate.is_dir():
            return candidate.resolve()
        # env var set but path doesn't exist — fall through to git detection
    return detect_git_root() or pathlib.Path.cwd()


def get_docs_dir() -> pathlib.Path:
    """docs/ directory inside the current project."""
    return get_project_root() / "docs"
