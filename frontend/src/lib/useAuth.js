'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { apiFetch } from './api';

const TOKEN_KEY = 'token';
const USER_CACHE_KEY = 'me_cache';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(t) {
  if (typeof window === 'undefined') return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
function cacheUser(u) {
  if (typeof window === 'undefined') return;
  if (u) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_CACHE_KEY);
}

function normalizeUser(u) {
  if (!u) return null;
  return {
    _raw: u,
    id: Number(u.id_utilisateur ?? u.id ?? 0),
    firstName: u.firstName ?? u.prenom ?? '',
    lastName: u.lastName ?? u.nom ?? '',
    email: u.email ?? '',
    role: u.role ?? 'user',
    avatarUrl: u.avatarUrl ?? u.photo_profil ?? null,
    intro: u.bio ?? u.biographie ?? null,
    phone: u.phone ?? u.telephone ?? null,
    address: u.address ?? u.adresse ?? null,
    averageRating: u.averageRating ?? u.note_moyenne ?? null,
    gardener: u.jardinier
      ? { ...u.jardinier, id: Number(u.jardinier.id) }
      : null,
    owner: u.proprietaire
      ? { ...u.proprietaire, id: Number(u.proprietaire.id_proprietaire) }
      : null,
  };
}

export function useAuth() {
  const [user, setUser] = useState(null);   
  const [rawUser, setRawUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  const hardLogout = useCallback(() => {
    setToken(null);
    cacheUser(null);
    setUser(null);
    setRawUser(null);
    setTokenState(null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/me');
      const normalized = normalizeUser(data?.user);
      setRawUser(data?.user ?? null);
      setUser(normalized);
      cacheUser(data?.user ?? null);
      const t = getToken();
      if (t) setTokenState(t);
    } catch (e) {
      const status = e?.status ?? null;
      if (status === 401) {
        hardLogout();
      } else {
        setUser(null);
        setRawUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [hardLogout]);

  const logout = useCallback(() => {
    hardLogout();
  }, [hardLogout]);

  const login = useCallback(async ({ email, password }) => {
    const res = await apiFetch('/api/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(res.token);
    setTokenState(res.token);
    cacheUser(res.user);
    const normalized = normalizeUser(res.user);
    setRawUser(res.user);
    setUser(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    setTokenState(getToken());

    const cached = typeof window !== 'undefined' ? localStorage.getItem(USER_CACHE_KEY) : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setRawUser(parsed);
        setUser(normalizeUser(parsed));
      } catch {}
    }
    refresh();

    const onStorage = (e) => {
      if (e.key === TOKEN_KEY) {
        setTokenState(e.newValue);
        if (!e.newValue) {
          cacheUser(null);
          setUser(null);
          setRawUser(null);
        } else {
          refresh();
        }
      }
      if (e.key === USER_CACHE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setRawUser(parsed);
          setUser(normalizeUser(parsed));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  return {
    user,       
    rawUser,     
    token,
    loading,
    isAuthenticated,
    refresh,
    login,         
    logout,
  };
}
