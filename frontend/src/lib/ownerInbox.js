const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
async function handle(res, fallback = 'request_failed') {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || fallback);
  return data;
}

export async function fetchOwnerInbox({ status } = {}) {
  const sp = new URLSearchParams();
  if (status) sp.set('status', status);
  const res = await fetch(`${API_BASE}/api/bookings/inbox?${sp.toString()}`, {
    headers: { ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res, 'inbox_failed');
}

export async function confirmBooking(id) {
  const res = await fetch(`${API_BASE}/api/bookings/${id}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handle(res, 'confirm_failed');
}

export async function cancelBooking(id) {
  const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handle(res, 'cancel_failed');
}
