import coffeeBeanIcon from "../Assets/coffee-bean.png";
import coffeeBeansIcon from "../Assets/coffee-beans.png";
import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import API_BASE from "../api";
import "./Alerts.css";

function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchJSON("/alerts/").then((data) => {
      if (mounted) setItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  // Determine if alert is "low stock" (red) or "expiring" (yellow)
  const isLow = (alert) => {
    return alert.alert_type === "low_stock";
  };

  const handleResolve = async (alert_id) => {
    if (!window.confirm("Resolve this alert?")) return;
    try {
      const res = await fetch(`${API_BASE}/alerts/${alert_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to resolve");
      setItems((prev) => prev.filter((item) => item.alert_id !== alert_id));
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  };

  // Search functionality
  const filteredItems = items.filter((item) =>
    String(item.alert_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.item_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.alert_type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.alert_message || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by most critical (low_stock) first, then by creation date
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.alert_type === "low_stock" && b.alert_type !== "low_stock") return -1;
    if (a.alert_type !== "low_stock" && b.alert_type === "low_stock") return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <h1>Alerts</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for low grounds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="alerts-table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Item ID</th>
            <th>Alert Type</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr
              key={item.alert_id}
              className={isLow(item) ? "low-stock" : "near-low-stock"}
            >
              <td>{item.alert_id}</td>
              <td>{item.item_id}</td>
              <td>
                {item.alert_type === "low_stock" ? "Low Stock" : "Expiring"}
                {item.alert_type === "low_stock" ? (
                  <img
                    src={coffeeBeanIcon}
                    alt="Low Stock"
                    title="Low Stock"
                    className="low-icon"
                  />
                ) : (
                  <img
                    src={coffeeBeansIcon}
                    alt="Expiring"
                    title="Expiring"
                    className="low-icon"
                  />
                )}
              </td>
              <td>{item.alert_message}</td>
              <td className="timestamp-cell">{new Date(item.created_at).toLocaleString()}</td>
              <td><button onClick={() => handleResolve(item.alert_id)} className="resolve-btn">Resolve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Alerts;
