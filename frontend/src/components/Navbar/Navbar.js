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

  const user = me?.user ?? null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const hasOwner = !!user?.proprietaire && (user.proprietaire.published ?? true);
  const hasGardener = !!user?.jardinier && (user.jardinier.published ?? true);

  const primaryCTA = useMemo(() => {
    if (!user) return null;

    if (hasOwner) {
      return { href: "/edit-garden", label: "Modifier mon jardin" };
    }
    if (hasGardener) {
      return { href: "/edit-gardener", label: "Modifier mon annonce" };
    }
    return { href: "/add-garden", label: "Ajouter mon jardin" };
  }, [user, hasOwner, hasGardener]);

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
            {!loadingMe && !user && (
              <>
                <Link href="/login">
                  <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
                    Se connecter
                  </button>
                </Link>
                <Link href="/signup">
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

            {!loadingMe && user && (
              <span className="hidden md:inline-block text-sm bg-white/20 px-2 py-1 rounded">
                Connecté&nbsp;: {user.prenom || user.email}
              </span>
            )}
          </div>

          <div
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer ml-2 md:ml-0"
            aria-label="Menu"
          >
            {menuOpen ? (
              <FontAwesomeIcon icon={faTimes} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faBars} size="lg" />
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-green-600 w-full absolute top-16 left-0 border-t border-white/20">
          <ul className="flex flex-col space-y-2 p-4 text-white">
            {!user && (
              <>
                <li>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="block">
                    S’inscrire
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                {primaryCTA && (
                  <li>
                    <Link
                      href={primaryCTA.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-semibold"
                    >
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
                  <Link href="/bookings" onClick={() => setMenuOpen(false)} className="block">
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
