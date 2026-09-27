"""
git_tools.py — Ripple MCP
Provides get_recent_changes(): reads local Git history via subprocess.
No LLM calls. No GitHub API. Safe subprocess usage (shell=False throughout).
"""

import subprocess
from typing import Any

from ripple.config import get_project_root


def _git(args: list[str], cwd: str | None = None) -> tuple[str, str, int]:
    """Run a git command and return (stdout, stderr, returncode)."""
    result = subprocess.run(
        ["git"] + args,
        capture_output=True,
        text=True,
        check=False,
        cwd=cwd,
    )
    return result.stdout.strip(), result.stderr.strip(), result.returncode


def get_recent_changes(max_commits: int = 5) -> dict[str, Any]:
    """
    Retrieve recent Git repository changes for the current project.

    Returns a dict containing:
    - commit: latest commit hash
    - message: latest commit subject line
    - author: latest commit author name
    - date: latest commit ISO date
    - changed_files: list of files changed in the latest commit
    - diff_excerpt: first 60 lines of diff for the latest commit
    - recent_commits: list of recent commits (up to max_commits)

    Returns {"error": "<reason>"} on failure instead of raising.
    """
    project_root = str(get_project_root())

    # Verify git is available
    _, err, rc = _git(["--version"], cwd=project_root)
    if rc != 0:
        return {"error": "git is not installed or not on PATH"}

    # Verify this is a git repository
    _, err, rc = _git(["rev-parse", "--is-inside-work-tree"], cwd=project_root)
    if rc != 0:
        return {"error": "not a git repository"}

    # Verify there is at least one commit
    _, err, rc = _git(["rev-parse", "HEAD"], cwd=project_root)
    if rc != 0:
        return {"error": "no commits found in repository"}

    # --- Latest commit ---
    log_out, _, rc = _git(["log", "-1", "--format=%H%x00%s%x00%an%x00%ai"], cwd=project_root)
    if rc != 0 or not log_out:
        return {"error": "failed to read latest commit"}

    parts = log_out.split("\x00")
    if len(parts) < 4:
        return {"error": "unexpected git log output format"}

    commit_hash, message, author, date = parts[0], parts[1], parts[2], parts[3]

    # --- Changed files in latest commit ---
    files_out, _, rc = _git(
        ["diff-tree", "--no-commit-id", "-r", "--name-only", "HEAD"], cwd=project_root
    )
    if rc != 0:
        changed_files: list[str] = []
    else:
        changed_files = [f for f in files_out.splitlines() if f]

    # --- Diff excerpt (first 60 lines) ---
    diff_out, _, rc = _git(["diff", "HEAD~1", "HEAD"], cwd=project_root)
    if rc != 0 or not diff_out:
        # Fall back: diff against empty tree for the first commit
        empty_tree = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
        diff_out, _, _ = _git(["diff", empty_tree, "HEAD"], cwd=project_root)

    diff_lines = diff_out.splitlines()
    diff_excerpt = "\n".join(diff_lines[:60])
    if len(diff_lines) > 60:
        diff_excerpt += f"\n... ({len(diff_lines) - 60} more lines)"

    # --- Recent commits ---
    recent_out, _, rc = _git(
        ["log", f"-{max(1, min(max_commits, 100))}", "--format=%H%x00%s%x00%an%x00%ai"],
        cwd=project_root,
    )
    recent_commits: list[dict[str, str]] = []
    if rc == 0 and recent_out:
        for line in recent_out.splitlines():
            p = line.split("\x00")
            if len(p) == 4:
                recent_commits.append(
                    {"commit": p[0], "message": p[1], "author": p[2], "date": p[3]}
                )

    return {
        "commit": commit_hash,
        "message": message,
        "author": author,
        "date": date,
        "changed_files": changed_files,
        "diff_excerpt": diff_excerpt,
        "recent_commits": recent_commits,
    }
