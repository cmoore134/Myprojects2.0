import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_sales():
    response = client.get("/sales/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_sales_total():
    response = client.get("/sales/total")

    assert response.status_code == 200

    data = response.json()

    assert "total_sales" in data
    assert "total_revenue" in data
    assert isinstance(data["total_sales"], int)
    assert isinstance(data["total_revenue"], (int, float))
