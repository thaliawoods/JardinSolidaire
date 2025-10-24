// frontend/src/lib/messages.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function authHeaders() {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'request_failed');
  return data;
}

export async function sendMessage({ toUserId, content }) {
  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ toUserId, content }),
  });
  return handle(res);
}

export async function listInbox({ unreadOnly = false } = {}) {
  const url = `${API_BASE}/api/messages${unreadOnly ? '?unread=1' : ''}`;
  const res = await fetch(url, { headers: { ...authHeaders() }, cache: 'no-store' });
  return handle(res); // { messages: [...] }
}

export async function listConversations() {
  const res = await fetch(`${API_BASE}/api/messages/conversations`, {
    headers: { ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res); // { conversations: [...] }
}

export async function getThread(otherUserId) {
  const res = await fetch(`${API_BASE}/api/messages/with/${otherUserId}`, {
    headers: { ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res); // { messages: [...] }
}

export async function markAllRead() {
  const res = await fetch(`${API_BASE}/api/messages/mark-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ all: true }),
  });
  return handle(res); // { ok: true }
}
