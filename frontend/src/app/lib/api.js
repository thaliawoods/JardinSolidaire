export async function apiFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${path}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    }
  );

  // normalize errors
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP_${res.status}`);
  }
  return res.json();
}
