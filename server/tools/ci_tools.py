"""
ci_tools.py — Ripple MCP
Provides get_ci_status(): tries the GitHub Actions API first, falls back to
demo_data/ci_status.json when the API is unavailable or not configured.

Environment variables (all optional):
    RIPPLE_GITHUB_REPO    — owner/repo slug, e.g. "Mechantchulo/Ripple-MCP"
                            Falls back to reading the git remote automatically.
    RIPPLE_GITHUB_TOKEN   — Personal access token for private repos / higher rate limit.
                            NEVER logged or returned in tool output.
    RIPPLE_GITHUB_BRANCH  — Branch to query (default: "erick")

Never raises. Always returns a structured dict.
"""

import json
import os
import pathlib
import subprocess
import urllib.error
import urllib.request
from typing import Any

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

_PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
_CI_STATUS_PATH = _PROJECT_ROOT / "demo_data" / "ci_status.json"

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _read_fixture() -> dict[str, Any]:
    """Read and return the local CI status fixture. Never raises."""
    try:
        raw = _CI_STATUS_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {"source": "demo-fixture", "error": f"CI status fixture not found: {_CI_STATUS_PATH}"}
    except OSError as exc:
        return {"source": "demo-fixture", "error": f"Could not read CI fixture: {exc}"}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return {"source": "demo-fixture", "error": f"CI fixture is not valid JSON: {exc}"}

    if not isinstance(data, dict):
        return {"source": "demo-fixture", "error": "CI fixture has unexpected format (expected JSON object)"}

    data.setdefault("source", "demo-fixture")
    return data


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
        # SSH: git@github.com:owner/repo.git
        if url.startswith("git@github.com:"):
            slug = url[len("git@github.com:"):]
        # HTTPS: https://github.com/owner/repo.git or https://github.com/owner/repo
        elif "github.com/" in url:
            slug = url.split("github.com/", 1)[1]
        else:
            return None
        return slug.removesuffix(".git")
    except Exception:  # noqa: BLE001
        return None


def _fetch_github_ci_status(repo: str, branch: str, token: str | None) -> dict[str, Any]:
    """
    Call the GitHub Actions API and return a concise CI status dict.
    Raises urllib.error.URLError / OSError on network failure.
    Raises ValueError on unexpected API response shape.
    """
    url = (
        f"https://api.github.com/repos/{repo}/actions/runs"
        f"?per_page=1&branch={branch}"
    )
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = json.loads(resp.read().decode("utf-8"))

    runs = body.get("workflow_runs")
    if not runs:
        return {
            "source": "github-actions",
            "workflow": "CI",
            "status": "no-runs",
            "commit": None,
            "pipeline_url": None,
            "stages": [],
            "error": f"No workflow runs found for branch '{branch}'",
        }

    run = runs[0]

    # Map GitHub conclusion/status to a simple passing/failing/pending label.
    conclusion = run.get("conclusion")  # success | failure | cancelled | None
    gh_status = run.get("status")       # queued | in_progress | completed

    if gh_status != "completed":
        ripple_status = "in-progress"
    elif conclusion == "success":
        ripple_status = "passing"
    else:
        ripple_status = "failing"

    # Build a minimal, concise stage list from the conclusion.
    stage_status = "passing" if conclusion == "success" else "failing"
    stages = [{"name": "tests", "status": stage_status}]

    error_msg: str | None = None
    if ripple_status == "failing":
        error_msg = f"Demo app test suite failed (conclusion: {conclusion})"
    elif ripple_status == "in-progress":
        error_msg = None

    return {
        "source": "github-actions",
        "workflow": run.get("name", "CI"),
        "status": ripple_status,
        "commit": run.get("head_sha"),
        "pipeline_url": run.get("html_url"),
        "stages": stages,
        "error": error_msg,
    }


# ---------------------------------------------------------------------------
# Public MCP tool
# ---------------------------------------------------------------------------


def get_ci_status() -> dict[str, Any]:
    """
    Retrieve the latest CI pipeline state for the demo project.

    Attempts to fetch live data from the GitHub Actions API using:
        RIPPLE_GITHUB_REPO   (owner/repo; auto-detected from git remote if absent)
        RIPPLE_GITHUB_TOKEN  (optional; improves rate limits on private repos)
        RIPPLE_GITHUB_BRANCH (default: "erick")

    Falls back to demo_data/ci_status.json when:
        - RIPPLE_GITHUB_REPO cannot be determined
        - GitHub API returns an error
        - Network is unavailable
        - Rate limit is exceeded

    Returns a dict containing CI workflow status, associated commit,
    stage results, and failure details.  Never raises.
    """
    repo: str | None = os.environ.get("RIPPLE_GITHUB_REPO") or _detect_github_repo()
    branch: str = os.environ.get("RIPPLE_GITHUB_BRANCH", "erick")
    # Token is read but NEVER echoed back in any return value.
    token: str | None = os.environ.get("RIPPLE_GITHUB_TOKEN") or None

    if not repo:
        # No repo configured and auto-detection failed — use fixture.
        data = _read_fixture()
        data["_fallback_reason"] = "RIPPLE_GITHUB_REPO not set and git remote auto-detection failed"
        return data

    try:
        return _fetch_github_ci_status(repo, branch, token)
    except urllib.error.HTTPError as exc:
        data = _read_fixture()
        data["_fallback_reason"] = f"GitHub API HTTP error {exc.code}: {exc.reason}"
        return data
    except (urllib.error.URLError, OSError, TimeoutError) as exc:
        data = _read_fixture()
        data["_fallback_reason"] = f"GitHub API network error: {exc}"
        return data
    except (ValueError, KeyError, json.JSONDecodeError) as exc:
        data = _read_fixture()
        data["_fallback_reason"] = f"GitHub API response parse error: {exc}"
        return data
    except Exception as exc:  # noqa: BLE001
        data = _read_fixture()
        data["_fallback_reason"] = f"Unexpected error fetching GitHub CI status: {exc}"
        return data
