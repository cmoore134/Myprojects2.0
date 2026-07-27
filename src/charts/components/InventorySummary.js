import { useEffect, useState } from "react";
import "./InventorySummary.css";
import { fetchJSON } from "../api";

function InventorySummary() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchJSON("/inventory/").then((data) => {
      if (mounted) setInventoryItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  const totalItems = inventoryItems.length;
  let totalQuantity = 0;
  for (let i = 0; i < inventoryItems.length; i++) {
    totalQuantity += inventoryItems[i].quantity || 0;
  }

  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.low_stock_threshold
  );

  return (
    <div className="dashboard-widget">
      <h3>Inventory Overview</h3>
      <div className="card-grid">
        <div className="low-stock-card">
          <h4>Total Items</h4>
          <p>{totalItems}</p>
        </div>
        <div className="low-stock-card">
          <h4>Total Quantity</h4>
          <p>{totalQuantity}</p>
        </div>
        <div className="low-stock-card">
          <h4>Low Stock Items</h4>
          <p>{lowStockItems.length}</p>
        </div>
      </div>
    </div>
  );
}

export default InventorySummary;
