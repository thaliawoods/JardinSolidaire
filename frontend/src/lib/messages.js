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

export async function fetchMessages({ unread = false } = {}) {
  const sp = new URLSearchParams();
  if (unread) sp.set('unread', '1');
  const res = await fetch(`${API_BASE}/api/messages?${sp.toString()}`, {
    headers: { ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res, 'messages_failed'); // { messages: [...] }
}

export async function markRead({ ids, all = false } = {}) {
  const res = await fetch(`${API_BASE}/api/messages/mark-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ ids, all }),
  });
  return handle(res, 'mark_failed'); // { ok: true }
}

export async function unreadCount() {
  const res = await fetch(`${API_BASE}/api/messages/unread-count`, {
    headers: { ...authHeaders() },
    cache: 'no-store',
  });
  return handle(res, 'count_failed'); // { count: number }
}
