"""
ripple/auth.py — GitHub authentication storage

Tokens are stored in the user's OS config directory, NOT inside the project.
This ensures tokens are never accidentally committed.

Storage location:
    Linux/macOS:  ~/.config/ripple/auth.json
    Windows:      %APPDATA%\\ripple\\auth.json

The file is chmod 600 on POSIX systems.

Priority for token resolution:
    1. RIPPLE_GITHUB_TOKEN environment variable   — always wins (CI, overrides)
    2. Stored token from `ripple auth github`     — local machine auth
    3. None                                        — unauthenticated

Never returns a token to callers who don't need it.
Never logs or prints the token.
"""

from __future__ import annotations

import getpass
import json
import os
import pathlib
import stat
from typing import Any


# ---------------------------------------------------------------------------
# Storage path
# ---------------------------------------------------------------------------

def _auth_dir() -> pathlib.Path:
    """Return the platform-appropriate Ripple auth config directory."""
    # XDG_CONFIG_HOME / APPDATA take priority, then ~/.config
    if os.name == "nt":
        base = pathlib.Path(os.environ.get("APPDATA", pathlib.Path.home() / "AppData" / "Roaming"))
    else:
        base = pathlib.Path(os.environ.get("XDG_CONFIG_HOME", pathlib.Path.home() / ".config"))
    return base / "ripple"


def _auth_file() -> pathlib.Path:
    return _auth_dir() / "auth.json"


# ---------------------------------------------------------------------------
# Read / write
# ---------------------------------------------------------------------------

def _load_auth() -> dict[str, Any]:
    """Load the stored auth file. Returns {} if absent or unreadable."""
    try:
        return json.loads(_auth_file().read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return {}


def _save_auth(data: dict[str, Any]) -> None:
    """Write auth data to disk with restrictive permissions."""
    path = _auth_file()
    path.parent.mkdir(parents=True, exist_ok=True)
    if os.name != "nt":
        try:
            path.parent.chmod(stat.S_IRWXU)
        except OSError:
            pass
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    descriptor = os.open(path, flags, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as auth_file:
        json.dump(data, auth_file, indent=2)
        auth_file.write("\n")
    # chmod 600 on POSIX — owner read/write only
    if os.name != "nt":
        try:
            path.chmod(stat.S_IRUSR | stat.S_IWUSR)
        except OSError:
            pass


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_github_token() -> str | None:
    """
    Resolve the GitHub token.

    Priority:
        1. RIPPLE_GITHUB_TOKEN env var
        2. Stored token in ~/.config/ripple/auth.json
        3. None
    """
    env_token = os.environ.get("RIPPLE_GITHUB_TOKEN")
    if env_token:
        return env_token
    return _load_auth().get("github_token") or None


def is_github_authenticated() -> bool:
    """Return True if a GitHub token is available from any source."""
    return get_github_token() is not None


def store_github_token(token: str) -> None:
    """Persist a GitHub token to the auth file."""
    data = _load_auth()
    data["github_token"] = token
    _save_auth(data)


def prompt_and_store_github_token() -> bool:
    """
    Interactively prompt the user for a GitHub Personal Access Token,
    then store it. Returns True on success, False if the user cancels.

    The token is never echoed to the terminal.
    """
    print("GitHub Personal Access Token")
    print("Required scopes: repo (for private repos and PR creation)")
    print("Create one at: https://github.com/settings/tokens/new")
    print()
    try:
        token = getpass.getpass("Token (input hidden): ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\nCancelled.")
        return False

    if not token:
        print("No token entered. Authentication not saved.")
        return False

    store_github_token(token)
    print(f"Token stored in {_auth_file()}")
    return True


def auth_status() -> dict[str, Any]:
    """
    Return a safe status dict — never includes the actual token.
    """
    if not get_github_token():
        return {"configured": False, "source": None}

    source = "env:RIPPLE_GITHUB_TOKEN" if os.environ.get("RIPPLE_GITHUB_TOKEN") else str(_auth_file())
    return {
        "configured": True,
        "source": source,
    }
