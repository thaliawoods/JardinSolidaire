"use client";

import { useEffect, useMemo, useState } from "react";
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const hasOwner = !!user?.proprietaire && (user.proprietaire.published ?? true);
  const hasGardener =
    !!user?.jardinier && (user.jardinier.published ?? true);

  const ownerCTA = useMemo(() => {
    if (!user) return null;
    return hasOwner
      ? { href: "/edit-garden", label: "Modifier mon jardin" }
      : { href: "/add-garden", label: "Ajouter mon jardin" };
  }, [user, hasOwner]);

  const gardenerCTA = useMemo(() => {
    if (!user) return null;
    return hasGardener
      ? { href: "/edit-gardener", label: "Je veux jardiner" }
      : { href: "/add-gardener", label: "Je veux jardiner" };
  }, [user, hasGardener]);

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
        const data = await res.json();
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
      // refresh /me to update owner/gardener skeletons if we created them
      const r2 = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (r2.ok) setMe(await r2.json());
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

  return (
    <nav className="w-full bg-green-600 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <FontAwesomeIcon icon={faSeedling} size="lg" className="mr-2" />
          <span className="text-xl font-bold">JardinSolidaire</span>
        </Link>

        <div className="flex items-center">
          <div className="hidden md:flex items-center space-x-3 mr-3">
            <Link href="/gardens" className="hover:underline">
              Jardins
            </Link>
            <Link href="/gardeners" className="hover:underline">
              Jardiniers
            </Link>

            {!loadingMe && !user && (
              <>
                <Link href="/login">
                  <button className="bg-ppink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full">
                    Se connecter
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full">
                    S’inscrire
                  </button>
                </Link>
              </>
            )}

            {/* Signed-in desktop items */}
            {!loadingMe && user && (
              <>
                {/* role switch */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchRole("OWNER")}
                    className={`px-3 py-1 rounded ${
                      role === "OWNER"
                        ? "bg-white text-green-700"
                        : "bg-white/20"
                    }`}
                    title="Interface Propriétaire"
                  >
                    Propriétaire
                  </button>
                  <button
                    onClick={() => switchRole("GARDENER")}
                    className={`px-3 py-1 rounded ${
                      role === "GARDENER"
                        ? "bg-white text-green-700"
                        : "bg-white/20"
                    }`}
                    title="Interface Jardinier"
                  >
                    Jardinier
                  </button>
                </div>

                {ownerCTA && (
                  <Link href={ownerCTA.href}>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg">
                      {ownerCTA.label}
                    </button>
                  </Link>
                )}

                {gardenerCTA && (
                  <Link href={gardenerCTA.href}>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg">
                      {gardenerCTA.label}
                    </button>
                  </Link>
                )}

                {/* NEW: Messages + Réservations (desktop) */}
                <Link href="/messages" className="hover:underline">
                  Messages
                </Link>
                <Link href="/bookings" className="hover:underline">
                  Réservations
                </Link>

                <span className="hidden md:inline-block text-sm bg-white/20 px-3 py-1 rounded-full">
                  Connecté&nbsp;: {user.firstName || user.email}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer ml-2 md:ml-0"
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

      {menuOpen && (
        <div className="bg-green-600 w-full absolute top-16 left-0 border-t border-white/20">
          <ul className="flex flex-col space-y-2 p-4 text-white">
            <li>
              <Link href="/gardens" onClick={() => setMenuOpen(false)}>
                Jardins
              </Link>
            </li>
            <li>
              <Link href="/gardeners" onClick={() => setMenuOpen(false)}>
                Jardiniers
              </Link>
            </li>

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
                {/* NEW: Messages + Réservations (mobile/burger) */}
                <li>
                  <Link href="/messages" onClick={() => setMenuOpen(false)}>
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" onClick={() => setMenuOpen(false)}>
                    Réservations
                  </Link>
                </li>

                <li className="flex gap-2">
                  <button
                    onClick={() => {
                      switchRole("OWNER");
                      setMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded ${
                      role === "OWNER"
                        ? "bg-white text-green-700"
                        : "bg-white/20"
                    }`}
                  >
                    Propriétaire
                  </button>
                  <button
                    onClick={() => {
                      switchRole("GARDENER");
                      setMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded ${
                      role === "GARDENER"
                        ? "bg-white text-green-700"
                        : "bg-white/20"
                    }`}
                  >
                    Jardinier
                  </button>
                </li>

                {ownerCTA && (
                  <li>
                    <Link
                      href={ownerCTA.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-semibold"
                    >
                      {ownerCTA.label}
                    </Link>
                  </li>
                )}
                {gardenerCTA && (
                  <li>
                    <Link
                      href={gardenerCTA.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-semibold"
                    >
                      {gardenerCTA.label}
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    Mon tableau de bord
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
