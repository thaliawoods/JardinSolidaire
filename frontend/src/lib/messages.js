import { apiFetch } from '@/lib/api';

export async function listInbox({ unreadOnly = false } = {}) {
  const query = {};
  if (unreadOnly) query.unread = 1;
  return apiFetch('/api/messages', { query });
}

export async function listConversations() {
  return apiFetch('/api/messages/conversations');
}

export async function getThread(userId) {
  return apiFetch(`/api/messages/with/${encodeURIComponent(String(userId))}`);
}

export async function sendMessage({ toUserId, content }) {
  return apiFetch('/api/messages', {
    method: 'POST',
    body: { toUserId: Number(toUserId), content },
  });
}

export async function markAllRead() {
  return apiFetch('/api/messages/mark-read', {
    method: 'POST',
    body: { all: true },
  });
}

export async function markThreadRead(fromUserId) {
  return apiFetch('/api/messages/mark-read', {
    method: 'POST',
    body: { fromUserId: Number(fromUserId) },
  });
}

export async function unreadCount() {
  const inbox = await listInbox({ unreadOnly: true });
  const msgs = inbox?.messages || [];
  return { count: Array.isArray(msgs) ? msgs.length : 0 };
}
