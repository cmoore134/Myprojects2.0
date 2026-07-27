import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_services():
    response = client.get("/services/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3

def test_get_service_by_id():
    response = client.get("/services/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
