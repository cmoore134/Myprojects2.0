import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import API_BASE from "../api";
import "./Inventory.css";

const EMPTY_INV = { name: "", category: "", quantity: "", low_stock_threshold: "", expiration_date: "" };

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_INV);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchJSON("/inventory/").then((data) => {
      if (mounted) setItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (item_id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/inventory/${item_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((item) => item.item_id !== item_id));
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/inventory/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category || null,
          quantity: parseInt(form.quantity) || 0,
          low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
          expiration_date: form.expiration_date || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save");
      }
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
      setForm(EMPTY_INV);
      setShowForm(false);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) =>
    String(item.item_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.quantity).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.expiration_date || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h1>Inventory</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search what's brewing in stock..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={() => { setShowForm(!showForm); setError(""); }}>
        {showForm ? "Cancel" : "+ Add Item"}
      </button>

      {showForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} min="0" />
          <input name="low_stock_threshold" type="number" placeholder="Low Stock Threshold" value={form.low_stock_threshold} onChange={handleChange} min="0" />
          <input name="expiration_date" type="date" value={form.expiration_date} onChange={handleChange} />
          {error && <span className="form-error">{error}</span>}
          <button type="submit" className="add-btn" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </form>
      )}

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
          {filteredItems.map((item) => (
            <tr key={item.item_id}>
              <td>{item.item_id}</td>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.expiration_date || "—"}</td>
              <td><button onClick={() => handleDelete(item.item_id)} className="delete-btn">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
