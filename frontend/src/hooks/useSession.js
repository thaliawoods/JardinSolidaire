'use client';

import { useEffect, useState, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.user) {
        setUser(data.user);
      } else {
        // stale/invalid token -> clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await fetchMe();
    })();
    return () => {
      alive = false;
    };
  }, [fetchMe]);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    refetch: fetchMe,
  };
}
