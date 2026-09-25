"""
health_tools.py — Ripple MCP
Provides check_service_health(): performs an HTTP GET against a health endpoint.
Uses stdlib urllib only — no third-party HTTP library required.
Never raises; always returns a structured dict.
"""

import json
import os
import urllib.error
import urllib.request
from typing import Any

_DEFAULT_HEALTH_URL = "http://127.0.0.1:8000/health"
_TIMEOUT_SECONDS = 5


def check_service_health(url: str | None = None) -> dict[str, Any]:
    """
    Check the configured demo application's health endpoint.

    Parameters:
        url (str, optional): Override the health endpoint URL.
                             Defaults to the RIPPLE_HEALTH_URL environment variable,
                             which itself defaults to http://127.0.0.1:8000/health.

    Returns a dict always containing at minimum:
        reachable (bool): whether the endpoint responded
        status_code (int): HTTP status code (omitted when unreachable)
        status (str): "healthy" | "degraded" | "unreachable" | "unknown"

    Plus any additional fields from the JSON response body (if the service returns JSON).
    On connection failure returns {"reachable": false, "status": "unreachable", "error": "..."}.
    """
    target_url = url or os.getenv("RIPPLE_HEALTH_URL", _DEFAULT_HEALTH_URL)

    try:
        req = urllib.request.Request(target_url, method="GET")
        with urllib.request.urlopen(req, timeout=_TIMEOUT_SECONDS) as resp:
            status_code: int = resp.status
            raw_body: str = resp.read().decode("utf-8", errors="replace")

        # Try to parse as JSON
        try:
            body: dict[str, Any] = json.loads(raw_body)
        except (json.JSONDecodeError, ValueError):
            # Non-JSON response — return raw body
            return {
                "reachable": True,
                "status_code": status_code,
                "status": "healthy" if status_code == 200 else "degraded",
                "raw_body": raw_body[:500],  # cap at 500 chars to avoid flooding context
            }

        # Merge status metadata with the parsed body
        result: dict[str, Any] = {
            "reachable": True,
            "status_code": status_code,
        }
        result.update(body)
        # Ensure a "status" key is always present
        if "status" not in result:
            result["status"] = "healthy" if status_code == 200 else "degraded"
        return result

    except urllib.error.HTTPError as exc:
        # Server responded with a non-2xx status (urllib raises on 4xx/5xx)
        raw = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
        try:
            body = json.loads(raw)
        except (json.JSONDecodeError, ValueError):
            body = {"raw_body": raw[:500]}

        result = {
            "reachable": True,
            "status_code": exc.code,
            "status": "degraded",
        }
        result.update(body)
        return result

    except urllib.error.URLError as exc:
        reason = str(exc.reason) if exc.reason else str(exc)
        return {
            "reachable": False,
            "status": "unreachable",
            "error": f"Could not connect to {target_url}: {reason}",
        }

    except TimeoutError:
        return {
            "reachable": False,
            "status": "unreachable",
            "error": f"Request to {target_url} timed out after {_TIMEOUT_SECONDS}s",
        }
