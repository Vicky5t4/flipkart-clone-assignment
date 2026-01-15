const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export async function apiSend(path, method, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export { API_URL };
