"""
auth.py — Authentication routes.

POST /login

Simple in-memory credential check using a fixed demo account.
No JWT, no registration, no real user store — this exists only to make
the demo app feel like a realistic service.

Do NOT log passwords or tokens.
"""

import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter()

# Fixed demo credentials — synthetic only, no real data
_DEMO_EMAIL = "demo@example.com"
_DEMO_PASSWORD = "password"  # noqa: S105 — intentionally plain, demo-only


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(body: LoginRequest) -> JSONResponse:
    """Authenticate with the fixed demo account."""
    if body.email == _DEMO_EMAIL and body.password == _DEMO_PASSWORD:
        logger.info("Login successful for %s", body.email)
        return JSONResponse(
            status_code=200,
            content={"success": True, "user": {"email": body.email}},
        )

    logger.warning("Login failed — invalid credentials for email: %s", body.email)
    return JSONResponse(
        status_code=401,
        content={"success": False, "error": "invalid credentials"},
    )
