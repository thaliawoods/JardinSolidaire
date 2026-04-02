const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function uploadImage(file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });

  if (!res.ok) throw new Error('upload_failed');
  return res.json();
}
