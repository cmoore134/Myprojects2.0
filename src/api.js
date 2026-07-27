const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export async function fetchJSON(path) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("fetchJSON: non-ok response", url, res.status);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("fetchJSON error", url, err);
    return [];
  }
}

export default API_BASE;
