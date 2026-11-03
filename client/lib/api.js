const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("kindora_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API}${path}`, { ...options, headers, cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed");
  return body;
}
export { API };
