"""
database.py — Database simulation service.

We do not connect to a real database server for the hackathon demo.
Availability is determined entirely by whether DATABASE_URL is configured.

This keeps the demo deterministic and dependency-free.
"""

import logging

from app.config import DATABASE_URL

logger = logging.getLogger(__name__)


def is_database_available() -> bool:
    """
    Return True when a database connection string is configured.

    Treats a non-empty DATABASE_URL as 'connected'.
    Treats a missing or empty DATABASE_URL as 'unavailable'.
    Does NOT open a real connection.
    """
    if DATABASE_URL:
        return True

    logger.warning("DATABASE_URL is not configured — database unavailable")
    return False
