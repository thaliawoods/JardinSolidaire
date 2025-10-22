"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSeedling } from "@fortawesome/free-solid-svg-icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [role, setRole] = useState(null);

  const user = me?.user ?? null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const roleLabel =
    role === "OWNER" ? "Propriétaire" : role === "GARDENER" ? "Jardinier" : null;

  /* ---------- session hydration ---------- */
  useEffect(() => {
    let alive = true;
    async function hydrate() {
      if (!token) {
        setLoadingMe(false);
        setMe(null);
        setRole(null);
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
          setRole(data.user.role || null);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setMe(null);
          setRole(null);
        }
      } catch {
        if (alive) {
          setMe(null);
          setRole(null);
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
      const updated = await res.json();
      setRole(updated.role || null);
      await refreshMe();
      // Optional: redirect to dashboard after switching mode
      // window.location.href = "/dashboard";
    } catch (e) {
      console.error("switchRole failed", e);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMe(null);
    setRole(null);
    setMenuOpen(false);
    window.location.href = "/";
  }

  /* ---------- small UI helpers ---------- */
  const RoleBadge = () =>
    user && roleLabel ? (
      <span className="ml-3 text-xs px-2 py-1 rounded-full bg-white/20" aria-live="polite">
        Mode&nbsp;: <strong>{roleLabel}</strong>
      </span>
    ) : null;

  const RoleSwitcher = () =>
    user ? (
      <div className="hidden md:flex items-center bg-white/20 rounded-full p-1 mr-3">
        <button
          onClick={() => switchRole("OWNER")}
          className={`px-3 py-1 rounded-full text-sm transition ${
            role === "OWNER" ? "bg-white text-green-700" : "text-white hover:bg-white/10"
          }`}
          title="Interface Propriétaire"
        >
          Propriétaire
        </button>
        <button
          onClick={() => switchRole("GARDENER")}
          className={`px-3 py-1 rounded-full text-sm transition ${
            role === "GARDENER" ? "bg-white text-green-700" : "text-white hover:bg-white/10"
          }`}
          title="Interface Jardinier"
        >
          Jardinier
        </button>
      </div>
    ) : null;

  const DesktopCTAs = () => {
    if (loadingMe || !user) return null;

    if (role === "OWNER") {
      return (
        <div className="hidden md:flex items-center gap-3">
          <Link href="/add-garden">
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold">
              Ajouter mon jardin
            </button>
          </Link>
          <span className="hidden md:inline-block text-sm bg-white/20 px-3 py-1 rounded-full">
            Connecté&nbsp;: {user.firstName || user.email}
          </span>
        </div>
      );
    }

    if (role === "GARDENER") {
      return (
        <div className="hidden md:flex items-center gap-3">
          <Link href="/add-gardener">
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold">
              Ajouter mon profil jardinier
            </button>
          </Link>
          <span className="hidden md:inline-block text-sm bg-white/20 px-3 py-1 rounded-full">
            Connecté&nbsp;: {user.firstName || user.email}
          </span>
        </div>
      );
    }

    return null;
  };

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

          {/* Role-specific primary action (desktop) */}
          <DesktopCTAs />

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

      {/* Mobile menu (NO role toggles here) */}
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
                  <Link href="/bookings" onClick={() => setMenuOpen(false)}>
                    Réservations
                  </Link>
                </li>
                <li>
                  <Link href="/messages" onClick={() => setMenuOpen(false)}>
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" onClick={() => setMenuOpen(false)}>
                    Favoris
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="block text-left w-full">
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
