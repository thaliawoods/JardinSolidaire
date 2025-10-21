// frontend/src/lib/bookings.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res, fallbackError = 'request_failed') {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.reasons?.[0] || fallbackError);
  return data;
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, 'create_failed');
}

export async function getMyBookings() {
  const res = await fetch(`${API_BASE}/api/bookings/me`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res, 'list_failed');
}

export async function getBooking(id) {
  const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res, 'not_found');
}

export async function updateBooking(id, patch) {
  const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(patch),
  });
  return handle(res, 'update_failed');
}

export async function canBook({ gardenId, startsAt, endsAt }) {
  const params = new URLSearchParams({
    gardenId: String(gardenId),
    startsAt: new Date(startsAt).toISOString(),
    endsAt: new Date(endsAt).toISOString(),
  });
  const res = await fetch(`${API_BASE}/api/bookings/can-book?${params.toString()}`, {
    headers: { ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res, 'check_failed'); // { ok, reasons, conflict? }
}
