import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import API_BASE from "../api";
import "./Purchases.css";

const EMPTY_PO = { item_id: "", order_date: "", status: "pending", quantity: "" };

function Purchases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PO);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchJSON("/purchase_orders/").then((data) => {
      if (mounted) setItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (order_id) => {
    if (!window.confirm("Delete this purchase order?")) return;
    try {
      const res = await fetch(`${API_BASE}/purchase_orders/${order_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((item) => item.order_id !== order_id));
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/purchase_orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: parseInt(form.item_id),
          order_date: form.order_date,
          status: form.status,
          quantity: parseInt(form.quantity),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save");
      }
      const newOrder = await res.json();
      setItems((prev) => [newOrder, ...prev]);
      setForm(EMPTY_PO);
      setShowForm(false);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) =>
    String(item.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.item_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.order_date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.quantity || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="purchases-page">
      <div className="purchases-header">
        <h1>Purchases</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for brewing orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={() => { setShowForm(!showForm); setError(""); }}>
        {showForm ? "Cancel" : "+ Add Purchase Order"}
      </button>

      {showForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <input name="item_id" type="number" placeholder="Item ID *" value={form.item_id} onChange={handleChange} required min="1" />
          <input name="order_date" type="date" placeholder="Order Date *" value={form.order_date} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <input name="quantity" type="number" placeholder="Quantity *" value={form.quantity} onChange={handleChange} required min="1" />
          {error && <span className="form-error">{error}</span>}
          <button type="submit" className="add-btn" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </form>
      )}

      <table className="purchases-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Item ID</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.order_id}>
              <td>{item.order_id}</td>
              <td>{item.item_id}</td>
              <td>{item.order_date}</td>
              <td>{item.status}</td>
              <td>{item.quantity}</td>
              <td><button onClick={() => handleDelete(item.order_id)} className="delete-btn">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Purchases;
