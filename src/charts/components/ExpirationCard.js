import { useEffect, useState } from "react";
import { isExpired, isNearExpiration } from "../Utilities/expirationHelpers";
import API_BASE from "../api";
import "./ExpirationCard.css";

function ExpirationCard() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/inventory/`);
        if (!res.ok) throw new Error('bad');
        const data = await res.json();
        if (mounted) setInventoryItems(data || []);
      } catch (e) {
        console.error('ExpirationCard fetch error', e);
        if (mounted) setInventoryItems([]);
      }
    })();
    return () => (mounted = false);
  }, []);

  const nearOrExpiredItems = inventoryItems.filter((item) =>
    item.expiration_date ? isNearExpiration(item.expiration_date) : false
  );

  const sortedItems = [...nearOrExpiredItems].sort(
    (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date)
  );

  return (
    <div className="dashboard-widget">
      <h3>Expiration Tracking</h3>
      <div className="card-grid">
        {sortedItems.length === 0 ? (
          <p>Nothing expiring soon.</p>
        ) : (
          sortedItems.map((item) => (
            <div
              key={item.item_id}
              className={`expiration-card ${isExpired(item.expiration_date) ? "expired" : "expiring-soon"}`}
            >
              <h4>{item.name}</h4>
              <p>{item.category}</p>
              <p>Qty: {item.quantity}</p>
              <p>{item.expiration_date}</p>
              <span className="expiring-icon">
                {isExpired(item.expiration_date) ? "🧀❗" : "🥛⚠️"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExpirationCard;
