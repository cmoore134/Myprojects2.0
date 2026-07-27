import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import API_BASE from "../api";
import "./Sales.css";

const EMPTY_SALE = { item_id: "", service_id: "", price: "", sale_date: "", sale_amount: "" };

function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_SALE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchJSON("/sales/").then((data) => {
      if (mounted) setItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (sale_id) => {
    if (!window.confirm("Delete this sale?")) return;
    try {
      const res = await fetch(`${API_BASE}/sales/${sale_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((item) => item.sale_id !== sale_id));
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/sales/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: form.item_id ? parseInt(form.item_id) : null,
          service_id: form.service_id ? parseInt(form.service_id) : null,
          price: parseInt(form.price),
          sale_date: form.sale_date,
          sale_amount: parseInt(form.sale_amount),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save");
      }
      const newSale = await res.json();
      setItems((prev) => [newSale, ...prev]);
      setForm(EMPTY_SALE);
      setShowForm(false);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) =>
    String(item.sale_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.item_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.service_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.price || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.sale_amount || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.sale_date || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sales-page">
      <div className="sales-header">
        <h1>Sales</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search your daily grind..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={() => { setShowForm(!showForm); setError(""); }}>
        {showForm ? "Cancel" : "+ Add Sale"}
      </button>

      {showForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <input name="item_id" type="number" placeholder="Item ID (optional)" value={form.item_id} onChange={handleChange} min="1" />
          <input name="service_id" type="number" placeholder="Service ID (optional)" value={form.service_id} onChange={handleChange} min="1" />
          <input name="price" type="number" placeholder="Price *" value={form.price} onChange={handleChange} required min="1" />
          <input name="sale_date" type="date" placeholder="Sale Date *" value={form.sale_date} onChange={handleChange} required />
          <input name="sale_amount" type="number" placeholder="Sale Amount *" value={form.sale_amount} onChange={handleChange} required min="1" />
          {error && <span className="form-error">{error}</span>}
          <button type="submit" className="add-btn" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </form>
      )}

      <table className="sales-table">
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Item ID</th>
            <th>Service ID</th>
            <th>Price</th>
            <th>Sale Date</th>
            <th>Sale Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.sale_id}>
              <td>{item.sale_id}</td>
              <td>{item.item_id ?? "—"}</td>
              <td>{item.service_id ?? "—"}</td>
              <td>{item.price}</td>
              <td>{item.sale_date}</td>
              <td>{item.sale_amount}</td>
              <td><button onClick={() => handleDelete(item.sale_id)} className="delete-btn">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sales;
