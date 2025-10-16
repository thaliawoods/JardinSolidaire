'use client';
import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from './api';

export function useAuth() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/me');
      setMe(data.user); // { id_utilisateur, prenom, ..., jardinier, proprietaire }
      localStorage.setItem('me_cache', JSON.stringify(data.user));
    } catch (e) {
      setMe(null);
      localStorage.removeItem('me_cache');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('me_cache');
    setMe(null);
  }, []);

  useEffect(() => {
    // try cached user for instant UI, then refresh
    const cached = localStorage.getItem('me_cache');
    if (cached) {
      try { setMe(JSON.parse(cached)); } catch {}
    }
    refresh();
  }, [refresh]);

  return { me, loading, refresh, logout, isAuthenticated: !!me };
}
