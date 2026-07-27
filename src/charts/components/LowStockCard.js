import { useEffect, useState } from "react";
import "./LowStockCard.css";
import { fetchJSON } from "../api";

function LowStockCard() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchJSON("/inventory/").then((data) => {
      if (mounted) setInventoryItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.low_stock_threshold
  );

  return (
    <div className="dashboard-widget">
      <h3>Low Stock Alerts</h3>
      <div className="card-grid">
        {lowStockItems.length === 0 ? (
          <p>No low stock items right now.</p>
        ) : (
          lowStockItems.map((item) => (
            <div key={item.item_id} className="low-stock-card">
              <h4>{item.name}</h4>
              <p>{item.category}</p>
              <p>Qty: {item.quantity} (reorder at {item.low_stock_threshold})</p>
              <span className="alert-icon">📦⚠️</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LowStockCard;
