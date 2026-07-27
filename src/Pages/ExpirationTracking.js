import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import API_BASE from "../api";
import "./ExpirationTracking.css";

function ExpirationTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchJSON("/expiration/").then((data) => {
      if (mounted) setItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  // Checks if an item's expiration date has already passed
  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  };

  // Checks if an item's expiration date is within 14 days of today (includes already-expired items)
  const isNearExpiration = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 14;
  };

  const handleResolve = async (item_id) => {
    if (!window.confirm("Resolve this expiration?")) return;
    try {
      const res = await fetch(`${API_BASE}/expiration/${item_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to resolve");
      setItems((prev) => prev.filter((item) => item.item_id !== item_id));
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  };

  // Search functionality
  const filteredItems = items.filter((item) =>
    String(item.item_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.quantity || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.expiration_date || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only keep items that are expired or near expiration
  const nearOrExpiredItems = filteredItems.filter((item) =>
    isNearExpiration(item.expiration_date)
  );

  // Sorts items so the ones nearest to expiring (or most expired) show up first
  const sortedItems = [...nearOrExpiredItems].sort((a, b) => {
    return new Date(a.expiration_date) - new Date(b.expiration_date);
  });

  return (
    <div className="expiration-tracking-page">
      <div className="expiration-tracking-header">
        <h1>Expiration Tracking</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for Expired Milk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Category</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr
              key={item.item_id}
              className={isExpired(item.expiration_date) ? "expired" : "expiring-soon"}
            >
              <td>{item.item_id}</td>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                {item.expiration_date}
                {item.category === "Coffee" ? (
                  <span className="expiring-icon" title="Coffee Expiring">
                    ☕⚠️
                  </span>
                ) : isExpired(item.expiration_date) ? (
                  <span className="expiring-icon" title="Expired">
                    🧀❗
                  </span>
                ) : (
                  <span className="expiring-icon" title="Expiring soon">
                    🥛⚠️
                  </span>
                )}
              </td>
              <td><button onClick={() => handleResolve(item.item_id)} className="resolve-btn">Resolve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpirationTracking;
