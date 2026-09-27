"""
test_login.py — Tests for POST /login

Covers:
  - successful login with demo credentials
  - failed login with wrong password
  - failed login with unknown email
"""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client():
    from app.main import app
    return TestClient(app, raise_server_exceptions=True)


class TestLoginEndpoint:
    def test_login_success_status_200(self, client):
        response = client.post(
            "/login",
            json={"email": "demo@example.com", "password": "password"},
        )
        assert response.status_code == 200

    def test_login_success_body(self, client):
        body = client.post(
            "/login",
            json={"email": "demo@example.com", "password": "password"},
        ).json()
        assert body["success"] is True
        assert body["user"]["email"] == "demo@example.com"

    def test_login_wrong_password_status_401(self, client):
        response = client.post(
            "/login",
            json={"email": "demo@example.com", "password": "wrongpassword"},
        )
        assert response.status_code == 401

    def test_login_wrong_password_body(self, client):
        body = client.post(
            "/login",
            json={"email": "demo@example.com", "password": "wrongpassword"},
        ).json()
        assert body["success"] is False
        assert "error" in body

    def test_login_unknown_email_status_401(self, client):
        response = client.post(
            "/login",
            json={"email": "unknown@example.com", "password": "password"},
        )
        assert response.status_code == 401
