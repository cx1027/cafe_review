import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.db_base import Base
from app.database import get_db

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


class TestValidFeedbackSubmission:
    def test_post_valid_feedback_returns_201(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Great coffee!",
            "rating": 5,
            "favorite_aspect": "Coffee",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["comment"] == "Great coffee!"
        assert data["rating"] == 5
        assert data["favorite_aspect"] == "Coffee"
        assert "id" in data
        assert "created_at" in data

    def test_post_valid_feedback_persists(self, client):
        payload = {
            "email": "user@domain.org",
            "comment": "Lovely atmosphere.",
            "rating": 4,
            "favorite_aspect": "Atmosphere",
        }
        client.post("/api/feedback", json=payload)
        response = client.get("/api/feedback")
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["email"] == "user@domain.org"


class TestInvalidEmailRejection:
    def test_post_feedback_invalid_email(self, client):
        payload = {
            "email": "not-an-email",
            "comment": "Nice place.",
            "rating": 3,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_email_no_at_symbol(self, client):
        payload = {
            "email": "missingatsign.com",
            "comment": "Nice place.",
            "rating": 3,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422


class TestMissingFieldRejection:
    def test_post_feedback_missing_email(self, client):
        payload = {
            "comment": "Nice place.",
            "rating": 3,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_missing_comment(self, client):
        payload = {
            "email": "test@example.com",
            "rating": 3,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_missing_rating(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_missing_favorite_aspect(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "rating": 3,
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422


class TestInvalidRatingRejection:
    def test_post_feedback_rating_too_low(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "rating": 0,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_rating_too_high(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "rating": 6,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_rating_not_integer(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "rating": 3.5,
            "favorite_aspect": "Service",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422


class TestInvalidFavoriteAspectRejection:
    def test_post_feedback_invalid_favorite_aspect(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "rating": 4,
            "favorite_aspect": "Price",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422

    def test_post_feedback_favorite_aspect_empty_string(self, client):
        payload = {
            "email": "test@example.com",
            "comment": "Nice place.",
            "rating": 4,
            "favorite_aspect": "",
        }
        response = client.post("/api/feedback", json=payload)
        assert response.status_code == 422


class TestFeedbackListing:
    def test_get_feedback_empty(self, client):
        response = client.get("/api/feedback")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_feedback_returns_all_entries(self, client):
        p1 = {
            "email": "a@test.com",
            "comment": "First",
            "rating": 5,
            "favorite_aspect": "Coffee",
        }
        p2 = {
            "email": "b@test.com",
            "comment": "Second",
            "rating": 3,
            "favorite_aspect": "Food",
        }
        client.post("/api/feedback", json=p1)
        client.post("/api/feedback", json=p2)
        response = client.get("/api/feedback")
        assert response.status_code == 200
        assert len(response.json()) == 2
