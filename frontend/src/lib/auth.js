// src/lib/auth.js
export function persistAuth(payload) {
  try {
    if (!payload?.token) return;
    localStorage.setItem('token', payload.token);   // apiFetch reads this key
    localStorage.setItem('justRegistered', '1');    // used by Dashboard for first-time form
  } catch {}
}

export function clearAuth() {
  try {
    ['token','accessToken','access_token','jwt','Authorization'].forEach(k =>
      localStorage.removeItem(k)
    );
    document.cookie = 'token=; Max-Age=0; path=/';
  } catch {}
}

