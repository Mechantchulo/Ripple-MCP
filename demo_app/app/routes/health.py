"""
health.py — Health check route.

GET /health

Returns 200 + {"status": "healthy", "database": "connected"}   when DATABASE_URL is set.
Returns 503 + {"status": "degraded", "database": "unavailable", "error": "..."}  when not.

The endpoint always responds — it never crashes the application.
"""

import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.services.database import is_database_available

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
def health_check() -> JSONResponse:
    """Check application health, including database configuration state."""
    logger.info("Health check requested")

    if is_database_available():
        return JSONResponse(
            status_code=200,
            content={"status": "healthy", "database": "connected"},
        )

    logger.warning("Health check returning degraded — database configuration is missing or invalid")
    return JSONResponse(
        status_code=503,
        content={
            "status": "degraded",
            "database": "unavailable",
            "error": "database configuration is missing or invalid",
        },
    )
