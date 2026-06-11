import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_api_active(client):
    response = client.get("/")
    assert response.json()["message"] == "API HoopFlex activa"
