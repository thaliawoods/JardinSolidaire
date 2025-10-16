"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSeedling } from "@fortawesome/free-solid-svg-icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState(null); // full /api/me payload: { user: {...} }
  const [loadingMe, setLoadingMe] = useState(true);

  // Derived helpers
  const user = me?.user ?? null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const hasProprietaire = !!user?.proprietaire && (user.proprietaire.published ?? true);
  const hasJardinier = !!user?.jardinier && (user.jardinier.published ?? true);

  const primaryCTA = useMemo(() => {
    if (!user) return null;

    // Prefer more specific CTAs depending on profile presence
    if (hasProprietaire) {
      return { href: "/modifier-jardin", label: "Modifier mon jardin" };
    }
    if (hasJardinier) {
      return { href: "/modifier-jardinier", label: "Modifier mon annonce" };
    }

    // If no profile, choose a generic path (you can adjust this routing)
    // You could also branch by a chosen role saved at signup if you have it.
    return { href: "/ajouter-jardin", label: "Ajouter mon jardin" };
  }, [user, hasProprietaire, hasJardinier]);

  // Load /api/me if we have a token
  useEffect(() => {
    let alive = true;

    async function hydrate() {
      if (!token) {
        setLoadingMe(false);
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
        } else {
          // Token invalid? clear stale session.
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setMe(null);
        }
      } catch {
        if (alive) setMe(null);
      } finally {
        if (alive) setLoadingMe(false);
      }
    }

    hydrate();
    return () => {
      alive = false;
    };
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMe(null);
    setMenuOpen(false);
    // Go home (or /connexion)
    window.location.href = "/";
  }

  return (
    <nav className="w-full bg-green-600 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <FontAwesomeIcon icon={faSeedling} size="lg" className="mr-2" />
          <span className="text-xl font-bold">JardinSolidaire</span>
        </Link>

        {/* Right area */}
        <div className="flex items-center">
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-3 mr-3">
            {!loadingMe && !user && (
              <>
                <Link href="/connexion">
                  <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
                    Se connecter
                  </button>
                </Link>
                <Link href="/inscription">
                  <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
                    S’inscrire
                  </button>
                </Link>
              </>
            )}

            {!loadingMe && user && primaryCTA && (
              <Link href={primaryCTA.href}>
                <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
                  {primaryCTA.label}
                </button>
              </Link>
            )}

            {/* Connected badge */}
            {!loadingMe && user && (
              <span className="hidden md:inline-block text-sm bg-white/20 px-2 py-1 rounded">
                Connecté&nbsp;: {user.prenom || user.email}
              </span>
            )}
          </div>

          {/* Burger only when logged (optional: show even when logged out) */}
          <div
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer ml-2 md:ml-0"
            aria-label="Menu"
          >
            {menuOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
          </div>
        </div>
      </div>

      {/* Mobile / dropdown menu */}
      {menuOpen && (
        <div className="bg-green-600 w-full absolute top-16 left-0 border-t border-white/20">
          <ul className="flex flex-col space-y-2 p-4 text-white">
            {!user && (
              <>
                <li>
                  <Link href="/connexion" onClick={() => setMenuOpen(false)} className="block">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link href="/inscription" onClick={() => setMenuOpen(false)} className="block">
                    S’inscrire
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                {primaryCTA && (
                  <li>
                    <Link href={primaryCTA.href} onClick={() => setMenuOpen(false)} className="block font-semibold">
                      {primaryCTA.label}
                    </Link>
                  </li>
                )}

                <li>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block">
                    Mon profil
                  </Link>
                </li>
                <li>
                  <Link href="/messages" onClick={() => setMenuOpen(false)} className="block">
                    Ma messagerie
                  </Link>
                </li>
                <li>
                  <Link href="/reservations" onClick={() => setMenuOpen(false)} className="block">
                    Réservations
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" onClick={() => setMenuOpen(false)} className="block">
                    Mes favoris
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
