"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { unreadCount } from "@/lib/messages";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/** Broadcast role to the whole app (same tab) */
function broadcastRoleChange(role) {
  try {
    window.dispatchEvent(new CustomEvent("role:changed", { detail: role }));
    window.postMessage({ type: "role:changed", role }, "*");
    sessionStorage.setItem("role", role);
    localStorage.setItem("role", role);
  } catch {}
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [role, setRole] = useState(null);
  const [unread, setUnread] = useState(0);

  const user = me?.user ?? null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const roleLabel =
    role === "OWNER"
      ? "Propriétaire"
      : role === "GARDENER"
      ? "Jardinier"
      : null;

  /* ---------- session hydration ---------- */
  useEffect(() => {
    let alive = true;
    async function hydrate() {
      if (!token) {
        setLoadingMe(false);
        setMe(null);
        setRole(null);
        setUnread(0);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!alive) return;
        if (res.ok && data?.user) {
          setMe(data);
          setRole(data.user.role || localStorage.getItem("role") || null);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setMe(null);
          setRole(null);
          setUnread(0);
        }
      } catch {
        if (alive) {
          setMe(null);
          setRole(null);
          setUnread(0);
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

  /* Listen for role changes fired by Dashboard (and other places) */
  useEffect(() => {
    const cached =
      sessionStorage.getItem("role") || localStorage.getItem("role");
    if (cached && !role) setRole(cached);

    function onCustom(e) {
      const next = e?.detail || null;
      if (next) {
        setRole(next);
        refreshMe();
      }
    }
    function onMessage(e) {
      if (e?.data?.type === "role:changed") {
        setRole(e.data.role);
        refreshMe();
      }
    }
    window.addEventListener("role:changed", onCustom);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("role:changed", onCustom);
      window.removeEventListener("message", onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshMe() {
    if (!token) return;
    const r2 = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (r2.ok) setMe(await r2.json());
  }

  async function switchRole(nextRole) {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/me/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: nextRole }),
      });
      if (!res.ok) return;
      const updated = await res.json().catch(() => ({}));
      const newRole = updated.role || nextRole || null;
      setRole(newRole);
      broadcastRoleChange(newRole);
      await refreshMe();
    } catch (e) {
      console.error("switchRole failed", e);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMe(null);
    setRole(null);
    setUnread(0);
    setMenuOpen(false);
    window.location.href = "/";
  }

  /* ---------- unread messages ---------- */
  useEffect(() => {
    let alive = true;
    async function loadUnread() {
      try {
        if (!user) { if (alive) setUnread(0); return; }
        const r = await unreadCount();
        if (alive) setUnread(Number(r?.count || 0));
      } catch {
        if (alive) setUnread(0);
      }
    }
    loadUnread();

    function onStorage(e) {
      if (e.key === 'token') loadUnread();
    }
    window.addEventListener('storage', onStorage);
    return () => { alive = false; window.removeEventListener('storage', onStorage); };
  }, [user, role, token]);

  /* ---------- small UI helpers ---------- */
  const RoleBadge = () =>
    user && roleLabel ? (
      <span
        className="ml-3 text-xs px-2 py-1 rounded-full bg-white/20"
        aria-live="polite"
      >
        Mode&nbsp;: <strong>{roleLabel}</strong>
      </span>
    ) : null;

  const RoleSwitcher = () =>
    user ? (
      <div className="hidden md:flex items-center bg-white/20 rounded-full p-1 mr-3">
        <button
          onClick={() => switchRole("OWNER")}
          className={`px-3 py-1 rounded-full text-sm transition ${
            role === "OWNER"
              ? "bg-pink-500 text-white"
              : "text-white hover:bg-white/10"
          }`}
          title="Interface Propriétaire"
        >
          Propriétaire
        </button>
        <button
          onClick={() => switchRole("GARDENER")}
          className={`px-3 py-1 rounded-full text-sm transition ${
            role === "GARDENER"
              ? "bg-pink-500 text-white"
              : "text-white hover:bg-white/10"
          }`}
          title="Interface Jardinier"
        >
          Jardinier
        </button>
      </div>
    ) : null;

  /* ---------- render ---------- */
  return (
    <nav className="w-full bg-green-600 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <FontAwesomeIcon icon={faSeedling} size="lg" className="mr-2" />
            <span className="text-xl font-bold">JardinSolidaire</span>
          </Link>
          <RoleBadge />
        </div>

        <div className="flex items-center">
          {/* Desktop mode switcher */}
          <RoleSwitcher />

          {/* Quick link to map (desktop) */}
          <Link
            href="/map"
            className="hidden md:inline-block ml-3 rounded-full px-3 py-1.5 bg-white/20 hover:bg-white/10"
            title="Carte des jardins"
          >
            Carte
          </Link>

          {/* Desktop Messages link with badge */}
          {user && (
            <Link
              href="/messages"
              className="hidden md:inline-block ml-3 relative rounded-full px-3 py-1.5 bg-white/20 hover:bg-white/10"
              title="Messagerie"
            >
              Messages
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-1 rounded-full bg-pink-500 text-white">
                  {unread}
                </span>
              )}
            </Link>
          )}

          {/* Owner quick link to inbox (optional) */}
          {user && role === 'OWNER' && (
            <Link href="/owner/inbox" className="hidden md:inline-block ml-3 rounded-full px-3 py-1.5 bg-white/20 hover:bg-white/10">
              Demandes
            </Link>
          )}

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
            className="cursor-pointer ml-3 md:ml-2"
            aria-label="Menu"
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
                {roleLabel && (
                  <li className="text-xs opacity-90 mb-1">
                    Mode actuel&nbsp;: <strong>{roleLabel}</strong>
                  </li>
                )}
                <li>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                    Tableau de bord
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                    Mon profil
                  </Link>
                </li>
                <li>
                  <Link href="/my-gardens" onClick={() => setMenuOpen(false)}>
                    Mes jardins
                  </Link>
                </li>
                <li>
                  <Link href="/map" onClick={() => setMenuOpen(false)}>
                    Carte
                  </Link>
                </li>
                <li className="relative">
                  <Link href="/messages" onClick={() => setMenuOpen(false)}>
                    Messagerie
                  </Link>
                  {unread > 0 && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500 text-white align-middle">
                      {unread}
                    </span>
                  )}
                </li>
                {role === 'OWNER' && (
                  <li>
                    <Link href="/owner/inbox" onClick={() => setMenuOpen(false)}>
                      Demandes
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block text-left w-full"
                  >
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
