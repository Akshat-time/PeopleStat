const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "API request failed");
    return json.data;
  },

  post: async (endpoint, payload) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "API request failed");
    return json.data;
  },
  
  postMultipart: async (endpoint, formData) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "API request failed");
    return json.data;
  }
};
