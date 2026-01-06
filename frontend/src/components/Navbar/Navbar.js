'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { unreadCount } from '@/lib/messages';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/** Broadcast role to the whole app (same tab) */
function broadcastRoleChange(role) {
  try {
    window.dispatchEvent(new CustomEvent('role:changed', { detail: role }));
    window.postMessage({ type: 'role:changed', role }, '*');
    sessionStorage.setItem('role', role || '');
    localStorage.setItem('role', role || '');
  } catch {}
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [role, setRole] = useState(null);

  const [unread, setUnread] = useState(0); // messages unread
  const [inboxUnread, setInboxUnread] = useState(0); // booking requests pending (owner inbox)

  const user = me?.user ?? null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  /* ---------- session hydration ---------- */
  useEffect(() => {
    let alive = true;

    async function hydrate() {
      if (!token) {
        setLoadingMe(false);
        setMe(null);
        setRole(null);
        setUnread(0);
        setInboxUnread(0);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const data = await res.json().catch(() => null);
        if (!alive) return;

        if (res.ok && data?.user) {
          setMe(data);
          setRole(data.user.role || localStorage.getItem('role') || null);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setMe(null);
          setRole(null);
          setUnread(0);
          setInboxUnread(0);
        }
      } catch {
        if (alive) {
          setMe(null);
          setRole(null);
          setUnread(0);
          setInboxUnread(0);
        }
      } finally {
        if (alive) setLoadingMe(false);
      }
    }

    hydrate();
    return () => {
      alive = false;
    };
  }, [token]);

  /* Listen for role changes */
  useEffect(() => {
    const cached = sessionStorage.getItem('role') || localStorage.getItem('role');
    if (cached && !role) setRole(cached);

    function onCustom(e) {
      const next = e?.detail || null;
      if (next) {
        setRole(next);
        refreshMe();
      }
    }

    function onMessage(e) {
      if (e?.data?.type === 'role:changed') {
        setRole(e.data.role);
        refreshMe();
      }
    }

    window.addEventListener('role:changed', onCustom);
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('role:changed', onCustom);
      window.removeEventListener('message', onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshMe() {
    if (!token) return;
    const r2 = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (r2.ok) setMe(await r2.json());
  }

  async function switchRole(nextRole) {
    try {
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/me/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: nextRole }),
      });

      if (!res.ok) return;

      const updated = await res.json().catch(() => ({}));
      const newRole = updated.role || nextRole || null;

      setRole(newRole);
      broadcastRoleChange(newRole);
      await refreshMe();
    } catch (e) {
      console.error('switchRole failed', e);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMe(null);
    setRole(null);
    setUnread(0);
    setInboxUnread(0);
    setMenuOpen(false);
    window.location.href = '/';
  }

  /* ---------- unread messages ---------- */
  useEffect(() => {
    let alive = true;

    async function loadUnread() {
      try {
        if (!user) {
          if (alive) setUnread(0);
          return;
        }
        const r = await unreadCount();
        if (alive) setUnread(Number(r?.count || 0));
      } catch {
        if (alive) setUnread(0);
      }
    }

    loadUnread();

    function onStorage(e) {
      if (e.key === 'token') loadUnread();
      if (e.key === 'messagesChanged') loadUnread();
    }

    window.addEventListener('storage', onStorage);
    return () => {
      alive = false;
      window.removeEventListener('storage', onStorage);
    };
  }, [user, role, token]);

  /* ---------- owner inbox pending count ---------- */
  const loadInboxUnread = useCallback(async () => {
    try {
      if (!token || !user || role !== 'OWNER') {
        setInboxUnread(0);
        return;
      }

      const res = await fetch(`${API_BASE}/api/bookings/inbox?status=pending`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (!res.ok) {
        setInboxUnread(0);
        return;
      }

      const data = await res.json().catch(() => []);
      setInboxUnread(Array.isArray(data) ? data.length : 0);
    } catch (e) {
      console.error('loadInboxUnread failed', e);
      setInboxUnread(0);
    }
  }, [token, user, role]);

  useEffect(() => {
    loadInboxUnread();

    function onStorage(e) {
      if (e.key === 'bookingRequestsChanged') loadInboxUnread();
      if (e.key === 'token') loadInboxUnread();
      if (e.key === 'role') loadInboxUnread();
    }

    window.addEventListener('storage', onStorage);

    const t = setInterval(loadInboxUnread, 20000);

    return () => {
      clearInterval(t);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadInboxUnread]);

  /* ---------- small UI helpers ---------- */
  const RoleSwitcher = () =>
    user ? (
      <div className="hidden md:flex items-center gap-2">
        {/* Switch */}
        <div className="flex items-center bg-white/20 rounded-full p-1">
          <button
            onClick={() => switchRole('OWNER')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              role === 'OWNER' ? 'bg-pink-500 text-white' : 'text-white hover:bg-white/10'
            }`}
            title="Interface Propriétaire"
            type="button"
          >
            Propriétaire
          </button>
          <button
            onClick={() => switchRole('GARDENER')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              role === 'GARDENER' ? 'bg-pink-500 text-white' : 'text-white hover:bg-white/10'
            }`}
            title="Interface Jardinier"
            type="button"
          >
            Jardinier
          </button>
        </div>

        {/* 💌 icon always visible (desktop). badge = pending owner requests */}
        <Link
          href="/owner/inbox"
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/25 transition"
          title="Demandes de réservation"
          aria-label="Demandes de réservation"
        >
          <span className="text-base leading-none">💌</span>
          {role === 'OWNER' && inboxUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {inboxUnread > 9 ? '9+' : inboxUnread}
            </span>
          )}
        </Link>
      </div>
    ) : null;

  return (
    <nav className="w-full bg-green-600 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LEFT: logo only (removed quick links) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <FontAwesomeIcon icon={faSeedling} size="lg" className="mr-2" />
            <span className="text-xl font-bold">JardinSolidaire</span>
          </Link>
        </div>

        {/* RIGHT: role switcher + auth buttons + burger */}
        <div className="flex items-center gap-2">
          <RoleSwitcher />

          {/* Auth CTAs (desktop) */}
          {!loadingMe && !user && (
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login">
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full">
                  Se connecter
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full">
                  S’inscrire
                </button>
              </Link>
            </div>
          )}

          {/* Burger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer ml-1"
            aria-label="Menu"
            type="button"
          >
            {menuOpen ? (
              <FontAwesomeIcon icon={faTimes} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faBars} size="lg" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-green-600 w-full absolute top-16 left-0 border-t border-white/20">
          <ul className="flex flex-col space-y-2 p-4 text-white">
            {!user ? (
              <>
                <li>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    S’inscrire
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>

                {role === 'OWNER' && (
                  <>
                    <li>
                      <Link href="/my-gardens" onClick={() => setMenuOpen(false)}>
                        Mes jardins
                      </Link>
                    </li>

                    <li className="relative">
                      <Link href="/messages" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2">
                        <span>Messagerie</span>
                        {unread > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500 text-white">
                            {unread > 9 ? '9+' : unread}
                          </span>
                        )}
                      </Link>
                    </li>

                    <li className="relative">
                      <Link
                        href="/owner/inbox"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex items-center gap-2"
                      >
                        <span>Demandes</span>
                        <span aria-hidden className="opacity-90">
                          💌
                        </span>
                        {inboxUnread > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500 text-white">
                            {inboxUnread > 9 ? '9+' : inboxUnread}
                          </span>
                        )}
                      </Link>
                    </li>
                  </>
                )}

                {role === 'GARDENER' && (
                  <>
                    <li className="relative">
                      <Link href="/messages" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2">
                        <span>Messagerie</span>
                        {unread > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500 text-white">
                            {unread > 9 ? '9+' : unread}
                          </span>
                        )}
                      </Link>
                    </li>

                    <li>
                      <Link href="/bookings" onClick={() => setMenuOpen(false)}>
                        Mes réservations
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link href="/favorites" onClick={() => setMenuOpen(false)}>
                    Mes Favoris
                  </Link>
                </li>

                <li>
                  <button onClick={handleLogout} className="block text-left w-full" type="button">
                    Déconnexion
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
