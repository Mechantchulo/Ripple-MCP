"""
deployment_tools.py — Ripple MCP
Provides get_deployment_info(): reads demo_data/deployment.json from the project root.
No LLM calls. No network calls. Deterministic local data only.
Never raises; always returns a structured dict.
"""

import json
from typing import Any

from ripple.config import get_project_root


def get_deployment_info() -> dict[str, Any]:
    """
    Retrieve the latest deployment record for the current project.

    Reads demo_data/deployment.json and returns its contents.

    Returns a dict containing deployed version, environment, deployment
    timestamp, status, and health-check outcome.

    Returns {"error": "<reason>"} on failure instead of raising.
    """
    deployment_path = get_project_root() / "demo_data" / "deployment.json"
    try:
        raw = deployment_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {"error": f"Deployment data not found: {deployment_path}"}
    except OSError as exc:
        return {"error": f"Could not read deployment data: {exc}"}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return {"error": f"Deployment data is not valid JSON: {exc}"}

    if not isinstance(data, dict):
        return {"error": "Deployment data has unexpected format (expected a JSON object)"}

    return data
