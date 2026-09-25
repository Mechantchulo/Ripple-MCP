"""
main.py — Ripple MCP server entry point
Initializes the MCPServer, registers all Ripple tools, and starts STDIO transport.

Tool ownership:
  Person 1: get_recent_changes, check_service_health  (implemented)
  Person 2: get_ci_status, get_deployment_info, search_project_docs  (TODO — see below)
"""

import sys
import os

# Ensure the project root is on sys.path when the script is run directly
# (e.g. python3 server/main.py or via Bob's MCP stdio spawn).
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from dotenv import load_dotenv

# Load .env before any tool module reads environment variables
load_dotenv()

from mcp.server.mcpserver import MCPServer

from server.tools.git_tools import get_recent_changes as _get_recent_changes
from server.tools.health_tools import check_service_health as _check_service_health

mcp = MCPServer(
    name="ripple",
    description=(
        "Ripple — project-specific developer tools for IBM Bob. "
        "Provides access to Git history, service health, CI status, "
        "deployment information, and project documentation."
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
        "Use this when investigating regressions, failures after a change, "
        "configuration changes, or determining what recently changed in the project."
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
        "Checks the configured demo application's health endpoint and returns "
        "current service availability and health information. "
        "Use this when investigating runtime failures, degraded services, "
        "deployment problems, or verifying whether the application recovered after a fix. "
        "Optional parameter: url — override the health endpoint URL; "
        "defaults to the RIPPLE_HEALTH_URL environment variable "
        "(http://127.0.0.1:8000/health if not set)."
    ),
)
def check_service_health(url: str = "") -> dict:
    """
    Args:
        url: Override the health endpoint URL. Leave empty to use RIPPLE_HEALTH_URL
             or the default http://127.0.0.1:8000/health.
    """
    return _check_service_health(url=url or None)


# ---------------------------------------------------------------------------
# TODO (Person 2) — register these three tools after merge:
#
# from server.tools.ci_tools import get_ci_status as _get_ci_status
# from server.tools.deployment_tools import get_deployment_info as _get_deployment_info
# from server.tools.docs_tools import search_project_docs as _search_project_docs
#
# @mcp.tool(
#     name="get_ci_status",
#     description=(
#         "Returns the current CI pipeline status for recent commits. "
#         "Use when investigating build failures, broken pipelines, or "
#         "verifying whether a fix passed CI."
#     ),
# )
# def get_ci_status(...) -> dict:
#     return _get_ci_status(...)
#
# @mcp.tool(
#     name="get_deployment_info",
#     description=(
#         "Returns the latest deployment information including version, "
#         "environment, and deployment timestamp. "
#         "Use when investigating what is currently deployed or comparing "
#         "the deployed version against recent commits."
#     ),
# )
# def get_deployment_info(...) -> dict:
#     return _get_deployment_info(...)
#
# @mcp.tool(
#     name="search_project_docs",
#     description=(
#         "Searches project documentation for relevant information. "
#         "Use when looking up architectural decisions, runbooks, "
#         "or configuration reference documentation."
#     ),
# )
# def search_project_docs(...) -> dict:
#     return _search_project_docs(...)
# ---------------------------------------------------------------------------


if __name__ == "__main__":
    mcp.run(transport="stdio")
