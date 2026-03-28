'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { unreadCount } from '@/lib/messages';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function broadcastRoleChange(role) {
  try {
    window.dispatchEvent(new CustomEvent('role:changed', { detail: role }));
    window.postMessage({ type: 'role:changed', role }, '*');
    sessionStorage.setItem('role', role || '');
    localStorage.setItem('role', role || '');
  } catch {}
}

const NAV_STYLE = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  background: '#fff',
  borderBottom: '1px solid var(--border)',
  height: 56,
  display: 'flex',
  alignItems: 'center',
};

const INNER = {
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto',
  padding: '0 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.5rem',
};

const LINK = {
  fontSize: '0.875rem',
  color: 'var(--foreground)',
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
};

const LINK_MUTED = { ...LINK, color: 'var(--muted)' };

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [role, setRole] = useState(null);
  const [unread, setUnread] = useState(0);
  const [inboxUnread, setInboxUnread] = useState(0);
  const menuRef = useRef(null);

  const user = me?.user ?? null;

  const displayName = useMemo(() => {
    if (!user) return '';
    const first = user.firstName || user.prenom || '';
    const last = user.lastName || user.nom || '';
    const full = `${first} ${last}`.trim();
    return full || user.email || '';
  }, [user]);

  useEffect(() => {
    if (!menuOpen) return;
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  useEffect(() => {
    let alive = true;
    async function hydrate() {
      const token = localStorage.getItem('token');
      if (!token) { setLoadingMe(false); return; }
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
          setMe(null); setRole(null);
        }
      } catch {
        if (alive) { setMe(null); setRole(null); }
      } finally {
        if (alive) setLoadingMe(false);
      }
    }
    hydrate();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem('role') || localStorage.getItem('role');
    if (cached && !role) setRole(cached);

    function onCustom(e) { if (e?.detail) { setRole(e.detail); refreshMe(); } }
    function onMsg(e) { if (e?.data?.type === 'role:changed') { setRole(e.data.role); refreshMe(); } }

    window.addEventListener('role:changed', onCustom);
    window.addEventListener('message', onMsg);
    return () => {
      window.removeEventListener('role:changed', onCustom);
      window.removeEventListener('message', onMsg);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshMe() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const r = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (r.ok) setMe(await r.json());
  }

  async function switchRole(next) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/me/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: next }),
      });
      if (!res.ok) return;
      const updated = await res.json().catch(() => ({}));
      const newRole = updated.role || next;
      setRole(newRole);
      broadcastRoleChange(newRole);
      await refreshMe();
    } catch {}
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMe(null); setRole(null);
    setUnread(0); setInboxUnread(0);
    setMenuOpen(false);
    window.location.href = '/';
  }

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        if (!user) { if (alive) setUnread(0); return; }
        const r = await unreadCount();
        if (alive) setUnread(Number(r?.count || 0));
      } catch { if (alive) setUnread(0); }
    }
    load();
    function onStorage(e) { if (e.key === 'token' || e.key === 'messagesChanged') load(); }
    window.addEventListener('storage', onStorage);
    return () => { alive = false; window.removeEventListener('storage', onStorage); };
  }, [user, role]);

  const loadInboxUnread = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user || role !== 'OWNER') { setInboxUnread(0); return; }
      const res = await fetch(`${API_BASE}/api/bookings/inbox?status=pending`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json().catch(() => []);
      setInboxUnread(Array.isArray(data) ? data.length : 0);
    } catch { setInboxUnread(0); }
  }, [user, role]);

  useEffect(() => {
    loadInboxUnread();
    function onStorage(e) {
      if (['bookingRequestsChanged', 'token', 'role'].includes(e.key)) loadInboxUnread();
    }
    window.addEventListener('storage', onStorage);
    const t = setInterval(loadInboxUnread, 20000);
    return () => { clearInterval(t); window.removeEventListener('storage', onStorage); };
  }, [loadInboxUnread]);

  return (
    <nav style={NAV_STYLE} role="navigation" aria-label="Navigation principale">
      <div style={INNER}>

        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 400,
            color: 'var(--green)',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}>
            Jardin Solidaire
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: 0 }}>

          {user && (
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
              <button onClick={() => switchRole('OWNER')} type="button" style={{ ...LINK, textDecoration: role === 'OWNER' ? 'underline' : 'none', textUnderlineOffset: '3px', color: role === 'OWNER' ? 'var(--foreground)' : 'var(--muted)' }}>
                Propriétaire
              </button>
              <span style={{ color: 'var(--border)', userSelect: 'none' }}>/</span>
              <button onClick={() => switchRole('GARDENER')} type="button" style={{ ...LINK, textDecoration: role === 'GARDENER' ? 'underline' : 'none', textUnderlineOffset: '3px', color: role === 'GARDENER' ? 'var(--foreground)' : 'var(--muted)' }}>
                Jardinier·e
              </button>
            </div>
          )}

          <Link href="/gardens" className="hidden md:inline" style={{ ...LINK_MUTED, whiteSpace: 'nowrap', ...(pathname?.startsWith('/gardens') ? { color: 'var(--green)', fontWeight: 600 } : {}) }}>Les jardins</Link>
          <Link href="/gardeners" className="hidden md:inline" style={{ ...LINK_MUTED, whiteSpace: 'nowrap', ...(pathname?.startsWith('/gardeners') ? { color: 'var(--green)', fontWeight: 600 } : {}) }}>Les jardinier·es</Link>

          {!loadingMe && !user && (
            <div className="hidden md:flex" style={{ gap: '1.25rem', alignItems: 'center' }}>
              <Link href="/login" style={{ ...LINK, textDecoration: pathname === '/login' ? 'underline' : 'none', textUnderlineOffset: '3px' }}>Se connecter</Link>
              <Link href="/register" style={{ ...LINK, textDecoration: pathname === '/register' ? 'underline' : 'none', textUnderlineOffset: '3px' }}>S&apos;inscrire</Link>
            </div>
          )}

          {user && displayName && (
            <span className="hidden md:inline" style={{ fontSize: '0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{displayName}</span>
          )}

          {user && (
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
              <button onClick={() => switchRole('OWNER')} type="button" style={{ ...LINK, fontSize: '0.8rem', letterSpacing: '0.04em', textDecoration: role === 'OWNER' ? 'underline' : 'none', textUnderlineOffset: '3px', color: role === 'OWNER' ? 'var(--foreground)' : 'var(--muted)' }}>
                P
              </button>
              <span style={{ color: 'var(--border)', userSelect: 'none' }}>/</span>
              <button onClick={() => switchRole('GARDENER')} type="button" style={{ ...LINK, fontSize: '0.8rem', letterSpacing: '0.04em', textDecoration: role === 'GARDENER' ? 'underline' : 'none', textUnderlineOffset: '3px', color: role === 'GARDENER' ? 'var(--foreground)' : 'var(--muted)' }}>
                J
              </button>
            </div>
          )}

          {user && (
            <Link href="/messages" style={{ ...LINK, position: 'relative', zIndex: 200, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }} title="Messagerie">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/envelope-heart.jpg" alt="Messagerie" style={{ width: '1.75rem', height: 'auto', display: 'block' }} />
              {unread > 0 && (
                <sup style={{ fontSize: '0.65rem', color: 'var(--green)' }}>{unread > 9 ? '9+' : unread}</sup>
              )}
            </Link>
          )}

          {user && role === 'OWNER' && (
            <Link href="/owner/inbox" className="hidden md:inline" style={{ ...LINK, position: 'relative', whiteSpace: 'nowrap' }}>
              Demandes
              {inboxUnread > 0 && (
                <sup style={{ fontSize: '0.65rem', color: 'var(--green)', marginLeft: 2 }}>{inboxUnread > 9 ? '9+' : inboxUnread}</sup>
              )}
            </Link>
          )}

          <div style={{ position: 'relative', flexShrink: 0 }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              type="button"
              style={{ ...LINK, letterSpacing: '0.05em', fontSize: '0.8rem', textTransform: 'uppercase' }}
              aria-expanded={menuOpen}
              aria-label="Menu"
            >
              {menuOpen ? 'Fermer' : 'Menu'}
            </button>

            {menuOpen && <DropdownMenu
              user={user}
              displayName={displayName}
              role={role}
              unread={unread}
              inboxUnread={inboxUnread}
              onClose={() => setMenuOpen(false)}
              onLogout={handleLogout}
            />}
          </div>
        </div>

      </div>
    </nav>
  );
}

function DropdownMenu({ user, displayName, role, unread, inboxUnread, onClose, onLogout, mobile }) {
  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: mobile ? -16 : 0,
    width: mobile ? '100vw' : 240,
    background: '#fff',
    border: '1px solid var(--border)',
    borderTop: 'none',
    zIndex: 100,
  };

  const itemStyle = {
    display: 'block',
    padding: '0.6rem 1.25rem',
    fontSize: '0.875rem',
    color: 'var(--foreground)',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    borderBottom: '1px solid var(--border)',
  };

  const muted = { ...itemStyle, color: 'var(--muted)' };

  return (
    <div style={panelStyle} role="menu">
      <Link href="/gardens" className="md:hidden" style={itemStyle} onClick={onClose}>Les jardins</Link>
      <Link href="/gardeners" className="md:hidden" style={itemStyle} onClick={onClose}>Les jardinier·es</Link>

      {!user ? (
        <>
          <Link href="/login" style={itemStyle} onClick={onClose}>Se connecter</Link>
          <Link href="/register" style={itemStyle} onClick={onClose}>S&apos;inscrire</Link>
        </>
      ) : (
        <>
          {displayName && (
            <div style={{ ...muted, cursor: 'default' }}>{displayName}</div>
          )}
          <Link href="/dashboard" style={itemStyle} onClick={onClose}>Tableau de bord</Link>
          {role === 'OWNER' && (
            <>
              <Link href="/my-gardens" style={itemStyle} onClick={onClose}>Mes jardins</Link>
              <Link href="/owner/inbox" style={itemStyle} onClick={onClose}>
                Demandes{inboxUnread > 0 ? ` (${inboxUnread})` : ''}
              </Link>
            </>
          )}
          {role === 'GARDENER' && (
            <Link href="/bookings" style={itemStyle} onClick={onClose}>Mes réservations</Link>
          )}
          <Link href="/favorites" style={itemStyle} onClick={onClose}>Favoris</Link>
          <button onClick={onLogout} style={muted}>Déconnexion</button>
        </>
      )}
    </div>
  );
}
