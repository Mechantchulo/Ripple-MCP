"""
ci_tools.py — Ripple MCP
Provides get_ci_status(): reads demo_data/ci_status.json from the project root.
No LLM calls. No network calls. Deterministic local data only.
Never raises; always returns a structured dict.
"""

import json
import pathlib
from typing import Any

# Resolve project root from this file's location:
#   __file__  = .../Ripple-MCP/server/tools/ci_tools.py
#   parents[0] = .../server/tools/
#   parents[1] = .../server/
#   parents[2] = .../Ripple-MCP/   ← project root
_PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
_CI_STATUS_PATH = _PROJECT_ROOT / "demo_data" / "ci_status.json"


def get_ci_status() -> dict[str, Any]:
    """
    Retrieve the latest CI pipeline state for the demo project.

    Reads demo_data/ci_status.json and returns its contents.

    Returns a dict containing CI workflow status, associated commit,
    stage results, and failure details.

    Returns {"error": "<reason>"} on failure instead of raising.
    """
    try:
        raw = _CI_STATUS_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {"error": f"CI status data not found: {_CI_STATUS_PATH}"}
    except OSError as exc:
        return {"error": f"Could not read CI status data: {exc}"}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return {"error": f"CI status data is not valid JSON: {exc}"}

    if not isinstance(data, dict):
        return {"error": "CI status data has unexpected format (expected a JSON object)"}

    return data
