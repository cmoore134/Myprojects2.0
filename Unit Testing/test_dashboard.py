from fastapi.testclient import TestClient
from main import app
from routers.sales import sales

client = TestClient(app)

def test_dashboard_summary():
    sales.clear()

    sales.append({
        "id": 1,
        "item_name": "Coffee",
        "quantity": 2,
        "price": 5.00,
        "total": 10.00,
        "date": "2026-07-15"
    })

    response = client.get("/dashboard/")

    assert response.status_code == 200

    data = response.json()

    assert data["total_sales"] == 1
    assert data["total_revenue"] == 10.00
    assert data["total_items_sold"] == 2
    assert data["average_sale"] == 10.00
