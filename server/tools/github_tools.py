"""
github_tools.py — Ripple MCP
Provides create_pull_request() and get_pull_request_status() via the GitHub REST API.

Environment variables:
    RIPPLE_GITHUB_REPO   — owner/repo slug, e.g. "Mechantchulo/Ripple-MCP"
                           Falls back to reading the git remote automatically.
    RIPPLE_GITHUB_TOKEN  — Personal access token with `repo` scope.
                           Required to create PRs; never logged or returned.

Never raises. Always returns a structured dict.
"""

import json
import os
import pathlib
import subprocess
import urllib.error
import urllib.request
from typing import Any

_PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]

# ---------------------------------------------------------------------------
# Shared helpers (reuse patterns from ci_tools.py)
# ---------------------------------------------------------------------------


def _detect_github_repo() -> str | None:
    """
    Attempt to derive owner/repo from the git remote URL.
    Handles both SSH (git@github.com:owner/repo.git) and HTTPS forms.
    Returns None on any failure.
    """
    try:
        result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=_PROJECT_ROOT,
        )
        if result.returncode != 0:
            return None
        url = result.stdout.strip()
        if url.startswith("git@github.com:"):
            slug = url[len("git@github.com:"):]
        elif "github.com/" in url:
            slug = url.split("github.com/", 1)[1]
        else:
            return None
        return slug.removesuffix(".git")
    except Exception:  # noqa: BLE001
        return None


def _detect_current_branch() -> str | None:
    """Return the current local Git branch name, or None on failure."""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=_PROJECT_ROOT,
        )
        if result.returncode != 0:
            return None
        branch = result.stdout.strip()
        # HEAD means detached state — not a usable branch name.
        return branch if branch and branch != "HEAD" else None
    except Exception:  # noqa: BLE001
        return None


def _github_request(
    method: str,
    path: str,
    token: str | None,
    body: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Make a GitHub REST API request.
    path should start with /repos/{owner}/{repo}/...
    Returns the parsed JSON response dict.
    Raises urllib.error.HTTPError, urllib.error.URLError, or json.JSONDecodeError.
    """
    url = f"https://api.github.com{path}"
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    data = json.dumps(body).encode("utf-8") if body is not None else None
    if data is not None:
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


# ---------------------------------------------------------------------------
# Public MCP tools
# ---------------------------------------------------------------------------


def create_pull_request(
    title: str,
    body: str,
    head_branch: str = "",
    base_branch: str = "main",
) -> dict[str, Any]:
    """
    Create a GitHub pull request.

    Args:
        title:       PR title.
        body:        PR description / body text.
        head_branch: Branch containing the changes. Detected automatically
                     from the current local branch when omitted.
        base_branch: Target branch for the PR (default: "main").

    Returns a structured dict. Never raises.
    """
    repo: str | None = os.environ.get("RIPPLE_GITHUB_REPO") or _detect_github_repo()
    # Token is read but NEVER echoed back in any return value.
    token: str | None = os.environ.get("RIPPLE_GITHUB_TOKEN") or None

    if not repo:
        return {
            "success": False,
            "pr_number": None,
            "title": title,
            "state": None,
            "head_branch": head_branch or None,
            "base_branch": base_branch,
            "url": None,
            "error": (
                "RIPPLE_GITHUB_REPO is not set and could not be auto-detected "
                "from the git remote. Set RIPPLE_GITHUB_REPO=owner/repo."
            ),
        }

    if not token:
        return {
            "success": False,
            "pr_number": None,
            "title": title,
            "state": None,
            "head_branch": head_branch or None,
            "base_branch": base_branch,
            "url": None,
            "error": "RIPPLE_GITHUB_TOKEN is not set. A token with 'repo' scope is required to create pull requests.",
        }

    resolved_head = head_branch.strip() if head_branch.strip() else _detect_current_branch()
    if not resolved_head:
        return {
            "success": False,
            "pr_number": None,
            "title": title,
            "state": None,
            "head_branch": None,
            "base_branch": base_branch,
            "url": None,
            "error": "head_branch was not provided and could not be detected from the local git state.",
        }

    try:
        pr = _github_request(
            "POST",
            f"/repos/{repo}/pulls",
            token,
            body={"title": title, "body": body, "head": resolved_head, "base": base_branch},
        )
        return {
            "success": True,
            "pr_number": pr.get("number"),
            "title": pr.get("title"),
            "state": pr.get("state"),
            "head_branch": pr.get("head", {}).get("ref"),
            "base_branch": pr.get("base", {}).get("ref"),
            "url": pr.get("html_url"),
            "error": None,
        }
    except urllib.error.HTTPError as exc:
        try:
            err_body = json.loads(exc.read().decode("utf-8"))
            gh_message = err_body.get("message", exc.reason)
        except Exception:  # noqa: BLE001
            gh_message = exc.reason
        return {
            "success": False,
            "pr_number": None,
            "title": title,
            "state": None,
            "head_branch": resolved_head,
            "base_branch": base_branch,
            "url": None,
            "error": f"GitHub API error {exc.code}: {gh_message}",
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "success": False,
            "pr_number": None,
            "title": title,
            "state": None,
            "head_branch": resolved_head,
            "base_branch": base_branch,
            "url": None,
            "error": f"Unexpected error: {exc}",
        }


def get_pull_request_status(pr_number: int) -> dict[str, Any]:
    """
    Retrieve the current status of a GitHub pull request, including
    its review state and CI check results.

    Args:
        pr_number: The pull request number (integer).

    Returns a structured dict. Never raises.
    """
    repo: str | None = os.environ.get("RIPPLE_GITHUB_REPO") or _detect_github_repo()
    # Token is read but NEVER echoed back in any return value.
    token: str | None = os.environ.get("RIPPLE_GITHUB_TOKEN") or None

    if not repo:
        return {
            "pr_number": pr_number,
            "title": None,
            "state": None,
            "merged": None,
            "mergeable": None,
            "head_branch": None,
            "base_branch": None,
            "url": None,
            "checks": None,
            "error": (
                "RIPPLE_GITHUB_REPO is not set and could not be auto-detected. "
                "Set RIPPLE_GITHUB_REPO=owner/repo."
            ),
        }

    try:
        pr = _github_request("GET", f"/repos/{repo}/pulls/{pr_number}", token)
    except urllib.error.HTTPError as exc:
        return {
            "pr_number": pr_number,
            "title": None,
            "state": None,
            "merged": None,
            "mergeable": None,
            "head_branch": None,
            "base_branch": None,
            "url": None,
            "checks": None,
            "error": f"GitHub API error {exc.code}: {exc.reason}",
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "pr_number": pr_number,
            "title": None,
            "state": None,
            "merged": None,
            "mergeable": None,
            "head_branch": None,
            "base_branch": None,
            "url": None,
            "checks": None,
            "error": f"Unexpected error: {exc}",
        }

    head_sha: str | None = pr.get("head", {}).get("sha")
    checks_summary: list[dict[str, Any]] | None = None

    if head_sha:
        try:
            checks_data = _github_request(
                "GET",
                f"/repos/{repo}/commits/{head_sha}/check-runs",
                token,
            )
            runs = checks_data.get("check_runs", [])
            checks_summary = [
                {
                    "name": r.get("name"),
                    "status": r.get("status"),       # queued | in_progress | completed
                    "conclusion": r.get("conclusion"), # success | failure | skipped | …
                    "url": r.get("html_url"),
                }
                for r in runs
            ]
        except Exception:  # noqa: BLE001
            # Check status is best-effort; don't fail the whole call.
            checks_summary = None

    return {
        "pr_number": pr.get("number"),
        "title": pr.get("title"),
        "state": pr.get("state"),           # open | closed
        "merged": pr.get("merged", False),
        "mergeable": pr.get("mergeable"),   # True | False | None (still computing)
        "head_branch": pr.get("head", {}).get("ref"),
        "base_branch": pr.get("base", {}).get("ref"),
        "url": pr.get("html_url"),
        "checks": checks_summary,
        "error": None,
    }
