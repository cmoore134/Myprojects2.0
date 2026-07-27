import pytest
from fastapi.testclient import TestClient
from main import app 

client = TestClient(app)

def test_create_and_get_inventory():
    # Arrange: Data matching InventoryBase in schemas.py
    new_item = {
        "name": "Test Laptop",
        "quantity": 5,
        "category": "Electronics",
        "low_stock_threshold": 2
    }
    
    # Act: POST to the inventory route
    # Note: Using "/inventory/" as configured in your main.py
    response = client.post("/inventory/", json=new_item) 
    
    # Assert: Verify success
    assert response.status_code == 200
    
    # Act: GET the inventory list
    response = client.get("/inventory/")
    
    # Assert: Verify success
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Verify the test item we added is actually in the returned list
    items = response.json()
    assert any(i["name"] == "Test Laptop" for i in items)
