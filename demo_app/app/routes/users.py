"""
users.py — Users route.

GET /users

Returns a static list of demo users.
No database access required — this endpoint always succeeds.
"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

_DEMO_USERS = [
    {"id": 1, "name": "Demo User"},
    {"id": 2, "name": "Alice Example"},
    {"id": 3, "name": "Bob Ripple"},
]


@router.get("/users")
def list_users() -> JSONResponse:
    """Return the static demo user list."""
    return JSONResponse(status_code=200, content=_DEMO_USERS)
