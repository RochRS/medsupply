const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiClient(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}