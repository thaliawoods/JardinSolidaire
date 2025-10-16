'use client';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function useSession() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        if (!token) {
          setMe(null);
          return;
        }
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setMe(data.user || null);
      } catch {
        // token invalide → on nettoie
        localStorage.removeItem('token');
        if (alive) setMe(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return { me, loading, logout };
}
