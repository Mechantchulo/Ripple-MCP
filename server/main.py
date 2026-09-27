"""
main.py — Ripple MCP server entry point
Initializes the MCPServer, registers all Ripple tools, and starts STDIO transport.

Tool ownership:
  Person 1: get_recent_changes, check_service_health
  Person 2: get_ci_status, get_deployment_info, search_project_docs
  GitHub PR: create_pull_request, get_pull_request_status
"""

from dotenv import load_dotenv
from ripple.config import get_project_root

# Load .env before any tool module reads environment variables
load_dotenv(dotenv_path=get_project_root() / ".env")

from mcp.server.mcpserver import MCPServer

from server.tools.git_tools import get_recent_changes as _get_recent_changes
from server.tools.health_tools import check_service_health as _check_service_health
from server.tools.ci_tools import get_ci_status as _get_ci_status
from server.tools.deployment_tools import get_deployment_info as _get_deployment_info
from server.tools.docs_tools import search_project_docs as _search_project_docs
from server.tools.github_tools import (
    create_pull_request as _create_pull_request,
    get_pull_request_status as _get_pull_request_status,
)

mcp = MCPServer(
    name="ripple",
    description=(
        "Ripple — project-specific developer tools for MCP clients. "
        "Provides access to Git history, service health, CI status, "
        "deployment information, project documentation, and GitHub pull requests."
    ),
)


# ---------------------------------------------------------------------------
# Person 1 tools
# ---------------------------------------------------------------------------

@mcp.tool(
    name="get_recent_changes",
    description=(
        "Retrieves recent Git repository changes for the current project, "
        "including the latest commit hash, commit message, changed files, "
        "a diff excerpt, and a list of recent commits. "
        "Use when investigating regressions, incidents, unhealthy deployments, "
        "or any recent behavior change — especially when something broke and "
        "you need to know what changed in the code just before it happened."
    ),
)
def get_recent_changes(max_commits: int = 5) -> dict:
    """
    Args:
        max_commits: Number of recent commits to include in the response (default 5).
    """
    return _get_recent_changes(max_commits=max_commits)


@mcp.tool(
    name="check_service_health",
    description=(
        "Checks the current project's configured health endpoint and returns "
        "current availability, HTTP status, and any reported error. "
        "Use when checking whether the application is currently healthy, "
        "degraded, or unreachable — particularly during incident investigation, "
        "after a deployment, or when the service is behaving unexpectedly. "
        "Optional parameter: url — override the health endpoint URL; "
        "defaults to the project configuration or RIPPLE_HEALTH_URL override."
    ),
)
def check_service_health(url: str = "") -> dict:
    """
    Args:
        url: Override the health endpoint URL. Leave empty to use project
             configuration or the RIPPLE_HEALTH_URL override.
    """
    return _check_service_health(url=url or None)


# ---------------------------------------------------------------------------
# Person 2 tools
# ---------------------------------------------------------------------------

@mcp.tool(
    name="get_ci_status",
    description=(
        "Returns the latest CI pipeline status for the project, including "
        "overall pass/fail result, the triggering commit, per-stage results, "
        "and a link to the pipeline run. "
        "Use when investigating failed builds, release problems, regressions, "
        "or unhealthy deployments — especially to determine whether the "
        "current code is passing automated tests."
    ),
)
def get_ci_status() -> dict:
    return _get_ci_status()


@mcp.tool(
    name="get_deployment_info",
    description=(
        "Returns the latest deployment record including deployed version, "
        "environment, timestamp, deployment status, and health-check outcome. "
        "Use when investigating deployment state, the currently deployed "
        "version, or production incidents — particularly to determine whether "
        "a degraded or failing service was already broken at deploy time."
    ),
)
def get_deployment_info() -> dict:
    return _get_deployment_info()


@mcp.tool(
    name="search_project_docs",
    description=(
        "Searches project Markdown documentation for sections relevant to the "
        "query using keyword scoring. Returns up to 3 matching sections with "
        "title, excerpt, and source filename. "
        "Use when investigating configuration requirements, deployment "
        "prerequisites, runbook procedures, architecture decisions, or "
        "troubleshooting guidance — for example, to find what environment "
        "variables the application expects."
    ),
)
def search_project_docs(query: str) -> dict:
    """
    Args:
        query: Natural-language search terms (e.g. "database environment variable").
    """
    return _search_project_docs(query=query)
# ---------------------------------------------------------------------------
# GitHub PR tools
# ---------------------------------------------------------------------------

@mcp.tool(
    name="create_pull_request",
    description=(
        "Use when code changes are ready for review and need to be proposed to "
        "another branch. Creates a GitHub pull request and returns its number, "
        "URL, source branch, target branch, and state."
    ),
)
def create_pull_request(
    title: str,
    body: str,
    head_branch: str = "",
    base_branch: str = "main",
) -> dict:
    """
    Args:
        title:       PR title (required).
        body:        PR description / body text (required).
        head_branch: Branch containing the changes. Auto-detected from the
                     current local git branch when omitted.
        base_branch: Target branch for the PR (default: "main").
    """
    return _create_pull_request(
        title=title,
        body=body,
        head_branch=head_branch,
        base_branch=base_branch,
    )


@mcp.tool(
    name="get_pull_request_status",
    description=(
        "Use when checking whether a proposed fix has been reviewed, merged, "
        "blocked, or still has failing checks. Returns PR state, merge status, "
        "CI check results, and the GitHub URL."
    ),
)
def get_pull_request_status(pr_number: int) -> dict:
    """
    Args:
        pr_number: The GitHub pull request number (integer).
    """
    return _get_pull_request_status(pr_number=pr_number)


# ---------------------------------------------------------------------------


if __name__ == "__main__":
    mcp.run(transport="stdio")
