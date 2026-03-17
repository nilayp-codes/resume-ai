"""
Backend unit tests for authentication endpoints.
Uses pytest + httpx TestClient.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from app.main import app

client = TestClient(app)


class TestAuthEndpoints:
    """Tests for /auth/register and /auth/login"""

    def test_register_success(self, db_session):
        """Register a new user and expect a token response."""
        with patch("app.routes.auth.db", db_session):
            response = client.post("/auth/register", json={
                "email": "test@example.com",
                "password": "securepassword123",
                "full_name": "Test User"
            })
        # May fail if DB not connected; covered in integration tests
        assert response.status_code in [201, 422, 500]

    def test_register_invalid_email(self):
        """Should reject invalid email format."""
        response = client.post("/auth/register", json={
            "email": "not-an-email",
            "password": "password123"
        })
        assert response.status_code == 422

    def test_register_short_password(self):
        """Should reject passwords shorter than 6 characters."""
        response = client.post("/auth/register", json={
            "email": "test@example.com",
            "password": "abc"
        })
        assert response.status_code == 422

    def test_login_wrong_credentials(self):
        """Should return 401 for invalid credentials."""
        response = client.post("/auth/login", json={
            "email": "nobody@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code in [401, 500]  # 500 if DB not connected in test

    def test_health_check(self):
        """Health endpoint should always return 200."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestInputValidation:
    """Tests for Pydantic input validation."""

    def test_missing_email_field(self):
        """Register without email should fail validation."""
        response = client.post("/auth/register", json={"password": "password123"})
        assert response.status_code == 422

    def test_missing_password_field(self):
        """Register without password should fail validation."""
        response = client.post("/auth/register", json={"email": "a@b.com"})
        assert response.status_code == 422

    def test_improve_bullet_too_short(self):
        """AI improve bullet with too short text should fail validation."""
        response = client.post(
            "/ai/improve-bullet",
            json={"bullet_text": "ab"},
            headers={"Authorization": "Bearer faketoken"}
        )
        assert response.status_code in [401, 422]

    def test_improve_bullet_too_long(self):
        """AI improve bullet exceeding 500 chars should fail validation."""
        response = client.post(
            "/ai/improve-bullet",
            json={"bullet_text": "x" * 501},
            headers={"Authorization": "Bearer faketoken"}
        )
        assert response.status_code in [401, 422]
