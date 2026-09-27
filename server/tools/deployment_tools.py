"""
deployment_tools.py — Ripple MCP
Provides get_deployment_info(): reads demo_data/deployment.json from the project root.
No LLM calls. No network calls. Deterministic local data only.
Never raises; always returns a structured dict.
"""

import json
import pathlib
from typing import Any

# Resolve project root from this file's location:
#   __file__  = .../Ripple-MCP/server/tools/deployment_tools.py
#   parents[0] = .../server/tools/
#   parents[1] = .../server/
#   parents[2] = .../Ripple-MCP/   ← project root
_PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
_DEPLOYMENT_PATH = _PROJECT_ROOT / "demo_data" / "deployment.json"


def get_deployment_info() -> dict[str, Any]:
    """
    Retrieve the latest simulated deployment record for the demo project.

    Reads demo_data/deployment.json and returns its contents.

    Returns a dict containing deployed version, environment, deployment
    timestamp, status, and health-check outcome.

    Returns {"error": "<reason>"} on failure instead of raising.
    """
    try:
        raw = _DEPLOYMENT_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {"error": f"Deployment data not found: {_DEPLOYMENT_PATH}"}
    except OSError as exc:
        return {"error": f"Could not read deployment data: {exc}"}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return {"error": f"Deployment data is not valid JSON: {exc}"}

    if not isinstance(data, dict):
        return {"error": "Deployment data has unexpected format (expected a JSON object)"}

    return data
