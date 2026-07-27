import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import API_BASE from "../api";
import "./Services.css";

const EMPTY_SVC = { name: "", description: "", price: "", category: "" };

function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_SVC);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchJSON("/services/").then((data) => {
      if (mounted) setItems(data || []);
    });
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (service_id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const res = await fetch(`${API_BASE}/services/${service_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((item) => item.service_id !== service_id));
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/services/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: parseInt(form.price),
          category: form.category || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save");
      }
      const newSvc = await res.json();
      setItems((prev) => [...prev, newSvc]);
      setForm(EMPTY_SVC);
      setShowForm(false);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) =>
    String(item.service_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.price || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Services</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for Services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={() => { setShowForm(!showForm); setError(""); }}>
        {showForm ? "Cancel" : "+ Add Service"}
      </button>

      {showForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price *" value={form.price} onChange={handleChange} required min="1" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          {error && <span className="form-error">{error}</span>}
          <button type="submit" className="add-btn" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </form>
      )}

      <table className="services-table">
        <thead>
          <tr>
            <th>Service ID</th>
            <th>Category</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.service_id}>
              <td>{item.service_id}</td>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>${Number(item.price || 0).toFixed(2)}</td>
              <td><button onClick={() => handleDelete(item.service_id)} className="delete-btn">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Services;
