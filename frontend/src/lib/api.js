// src/lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function ensureLeadingSlash(p = '') { return p.startsWith('/') ? p : `/${p}`; }

function qs(obj = {}) {
  const sp = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((item) => sp.append(k, String(item)));
    else sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/* ---------- auth helpers ---------- */
function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export function getAnyToken() {
  if (typeof window === 'undefined') return null;
  const keys = ['jwt', 'token', 'accessToken', 'Authorization'];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) return v.replace(/^Bearer\s+/i, '');
  }
  const cookieKeys = ['jwt', 'token', 'accessToken'];
  for (const k of cookieKeys) {
    const v = readCookie(k);
    if (v) return v.replace(/^Bearer\s+/i, '');
  }
  return null;
}

export async function apiFetch(
  path,
  { method = 'GET', body, headers = {}, query, signal, raw = false } = {}
) {
  const token = getAnyToken();
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const url = `${API_BASE}${ensureLeadingSlash(path)}${qs(query)}`;

  const res = await fetch(url, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal,
    ...(token ? {} : { credentials: 'include' }),
  });

  if (raw) return res;

  const ct = res.headers.get('content-type') || '';
  const canJson = ct.includes('application/json');
  let data = null;
  if (res.status !== 204 && canJson) {
    try { data = await res.json(); } catch { data = null; }
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message || data.detail)) ||
      `HTTP_${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.details = data || null;
    throw err;
  }
  return data;
}
