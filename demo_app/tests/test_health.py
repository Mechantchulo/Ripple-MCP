"""
test_health.py — Tests for GET /health

Two scenarios:
  1. Healthy  — DATABASE_URL is set in the environment
  2. Degraded — DATABASE_URL is absent from the environment
"""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client_with_db(monkeypatch):
    """TestClient with DATABASE_URL present in the environment."""
    monkeypatch.setenv("DATABASE_URL", "postgresql://demo:demo@localhost:5432/ripple")
    # Re-import app AFTER env is patched so config picks up the new value.
    import importlib

    import app.config as cfg
    importlib.reload(cfg)
    import app.services.database as db_svc
    importlib.reload(db_svc)
    import app.routes.health as health_mod
    importlib.reload(health_mod)
    import app.main as main_mod
    importlib.reload(main_mod)

    from app.main import app
    return TestClient(app, raise_server_exceptions=True)


@pytest.fixture()
def client_without_db(monkeypatch):
    """TestClient with DATABASE_URL absent from the environment."""
    monkeypatch.delenv("DATABASE_URL", raising=False)
    import importlib

    import app.config as cfg
    importlib.reload(cfg)
    import app.services.database as db_svc
    importlib.reload(db_svc)
    import app.routes.health as health_mod
    importlib.reload(health_mod)
    import app.main as main_mod
    importlib.reload(main_mod)

    from app.main import app
    return TestClient(app, raise_server_exceptions=True)


class TestHealthEndpoint:
    def test_healthy_status_200(self, client_with_db):
        response = client_with_db.get("/health")
        assert response.status_code == 200

    def test_healthy_body(self, client_with_db):
        body = client_with_db.get("/health").json()
        assert body["status"] == "healthy"
        assert body["database"] == "connected"

    def test_degraded_status_503(self, client_without_db):
        response = client_without_db.get("/health")
        assert response.status_code == 503

    def test_degraded_body(self, client_without_db):
        body = client_without_db.get("/health").json()
        assert body["status"] == "degraded"
        assert body["database"] == "unavailable"
        assert "error" in body
