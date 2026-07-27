import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_expiration_endpoint_status():
    """Verify the expiration endpoint returns a 200 OK status code."""
    response = client.get("/expiration/")
    assert response.status_code == 200

def test_expiration_data_type():
    """Verify the expiration endpoint returns data in a list format."""
    response = client.get("/expiration/")
    assert isinstance(response.json(), list)
