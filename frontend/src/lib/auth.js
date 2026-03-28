export function persistAuth(payload) {
  try {
    if (!payload?.token) return;
    localStorage.setItem('token', payload.token);
    localStorage.setItem('justRegistered', '1');
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

