"""
ci_tools.py — Ripple MCP
Provides get_ci_status(): tries the GitHub Actions API first, falls back to
demo_data/ci_status.json when the API is unavailable or not configured.

Configuration is resolved via ripple.config (CWD-relative) and ripple.auth.
Environment variables (RIPPLE_GITHUB_REPO, RIPPLE_GITHUB_TOKEN,
RIPPLE_GITHUB_BRANCH) are still honoured as overrides.

Never raises. Always returns a structured dict.
"""

import json
import urllib.error
import urllib.request
from typing import Any

from ripple.auth import get_github_token
from ripple.config import get_github_branch, get_github_repo, get_project_root

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _read_fixture() -> dict[str, Any]:
    """Read and return the local CI status fixture. Never raises."""
    ci_status_path = get_project_root() / "demo_data" / "ci_status.json"
    try:
        raw = ci_status_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {"source": "project-fixture", "error": f"CI status fixture not found: {ci_status_path}"}
    except OSError as exc:
        return {"source": "project-fixture", "error": f"Could not read CI fixture: {exc}"}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return {"source": "project-fixture", "error": f"CI fixture is not valid JSON: {exc}"}

    if not isinstance(data, dict):
        return {"source": "project-fixture", "error": "CI fixture has unexpected format (expected JSON object)"}

    data.setdefault("source", "project-fixture")
    return data


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
        error_msg = f"Workflow failed (conclusion: {conclusion})"
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
    Retrieve the latest CI pipeline state for the current project.

    Attempts to fetch live data from the GitHub Actions API using:
        RIPPLE_GITHUB_REPO   (owner/repo; auto-detected from git remote if absent)
        RIPPLE_GITHUB_TOKEN  (optional; improves rate limits on private repos)
        RIPPLE_GITHUB_BRANCH (current branch or "main" by default)

    Falls back to demo_data/ci_status.json when:
        - RIPPLE_GITHUB_REPO cannot be determined
        - GitHub API returns an error
        - Network is unavailable
        - Rate limit is exceeded

    Returns a dict containing CI workflow status, associated commit,
    stage results, and failure details.  Never raises.
    """
    repo = get_github_repo()
    branch = get_github_branch()
    # Token is read but NEVER echoed back in any return value.
    token = get_github_token()

    if not repo:
        # No repo configured and auto-detection failed — use fixture.
        data = _read_fixture()
        data["_fallback_reason"] = "GitHub repository is not configured and could not be auto-detected"
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
