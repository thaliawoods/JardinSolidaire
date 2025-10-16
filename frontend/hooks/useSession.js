'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
function setStoredToken(t) {
  if (typeof window === 'undefined') return;
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}
function setStoredUser(u) {
  if (typeof window === 'undefined') return;
  if (u) localStorage.setItem('user', JSON.stringify(u));
  else localStorage.removeItem('user');
}

async function apiFetch(path, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    let err = { status: res.status, error: 'request_failed' };
    try { err = await res.json(); } catch {}
    throw err;
  }
  return res.json();
}

export default function useSession() {
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthenticated = useMemo(() => !!token, [token]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const t = getStoredToken();
      if (!t) {
        setToken(null);
        setMe(null);
        return;
      }
      setToken(t);
      const data = await apiFetch('/api/me', { token: t });
      setMe(data.user);
      setStoredUser(data.user);
    } catch (e) {
      setError(e?.error || 'server_error');
      setStoredToken(null);
      setToken(null);
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const login = useCallback(async ({ email, password, mot_de_passe } = {}) => {
    const pwd = password ?? mot_de_passe; 
    const res = await apiFetch('/api/login', {
      method: 'POST',
      body: { email, password: pwd },
    });
    setStoredToken(res.token);
    setToken(res.token);
    setStoredUser(res.user);
    setMe(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setStoredUser(null);
    setToken(null);
    setMe(null);
  }, []);

  return { token, me, loading, error, isAuthenticated, login, logout, reload: load };
}
