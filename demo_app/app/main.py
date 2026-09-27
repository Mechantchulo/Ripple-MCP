"""
main.py — Ripple demo FastAPI application.

Endpoints:
    GET  /        Root — service identity
    GET  /health  Health check — reflects database configuration state
    POST /login   Demo authentication
    GET  /users   Static demo user list

Run locally:
    cd demo_app
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.health import router as health_router
from app.routes.users import router as users_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI):  # noqa: ARG001
    db_configured = bool(os.getenv("DATABASE_URL"))
    logger.info("ripple-demo-api starting up")
    if db_configured:
        logger.info("DATABASE_URL is configured — database layer is ready")
    else:
        logger.warning("DATABASE_URL is NOT configured — service will start in degraded state")
    yield


app = FastAPI(
    title="Ripple Demo API",
    description="Demo service for the Ripple MCP hackathon project.",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)


@app.get("/")
def root() -> dict:
    """Service identity endpoint."""
    return {"service": "ripple-demo-api", "status": "running"}
