"""
ripple/config.py — project configuration discovery

Priority order for every setting:
  1. Environment variable (RIPPLE_*)           — always wins
  2. .ripple/config.json in the current project — per-project config
  3. Auto-detection from git remote / branch    — best-effort fallback
  4. Hard-coded default                         — last resort

This module is imported by the CLI and by all MCP tool modules.
It operates relative to the CURRENT WORKING DIRECTORY, not the Ripple
package installation directory.
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
# Paths — all relative to CWD (the developer's project), not the Ripple pkg
# ---------------------------------------------------------------------------

CONFIG_FILE = pathlib.Path(".ripple") / "config.json"


# ---------------------------------------------------------------------------
# Git helpers (operate on CWD)
# ---------------------------------------------------------------------------

def _git(args: list[str]) -> str | None:
    """Run a git command in CWD. Returns stdout string or None on failure."""
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            text=True,
            check=False,
            timeout=5,
        )
        return result.stdout.strip() if result.returncode == 0 else None
    except Exception:  # noqa: BLE001
        return None


def detect_git_root() -> pathlib.Path | None:
    """Return the root of the git repository containing CWD, or None."""
    out = _git(["rev-parse", "--show-toplevel"])
    return pathlib.Path(out) if out else None


def detect_branch() -> str | None:
    """Return the current branch name, or None if detached / no repo."""
    # symbolic-ref also works for a newly initialized repository before its
    # first commit. Fall back to rev-parse for older Git versions.
    out = _git(["symbolic-ref", "--quiet", "--short", "HEAD"])
    if not out:
        out = _git(["rev-parse", "--abbrev-ref", "HEAD"])
    return out if out and out != "HEAD" else None


def detect_github_repo() -> str | None:
    """
    Derive owner/repo from the git remote URL.
    Handles SSH (git@github.com:owner/repo.git) and HTTPS forms.
    Returns None on any failure.
    """
    url = _git(["remote", "get-url", "origin"])
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
    Priority: env var → project config → git remote auto-detection.
    """
    return (
        os.environ.get("RIPPLE_GITHUB_REPO")
        or load_project_config().get("github_repo")
        or detect_github_repo()
    )


def get_github_branch() -> str:
    """
    Resolved branch name.
    Priority: env var → project config → current git branch → "main".
    """
    return (
        os.environ.get("RIPPLE_GITHUB_BRANCH")
        or load_project_config().get("branch")
        or detect_branch()
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
    The root of the current project's git repository.
    Falls back to CWD if not in a git repo.
    """
    return detect_git_root() or pathlib.Path.cwd()


def get_docs_dir() -> pathlib.Path:
    """docs/ directory inside the current project."""
    return get_project_root() / "docs"
