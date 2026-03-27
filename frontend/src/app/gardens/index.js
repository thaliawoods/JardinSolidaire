// /Users/thaliawoods/Documents/Ada/JardinSolidaire/JardinSolidaire/frontend/src/app/gardens/index.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { getFavGardens, addFavGarden, removeFavGarden } from "@/lib/favorites";
import { getAnyToken } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const LOCAL_DIRS = ["/assets/", "/images/", "/img/", "/icons/"];

/* ---------- media helper ---------- */
function resolveMedia(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  if (LOCAL_DIRS.some((p) => s.startsWith(p))) return s;
  if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;
  if (s.startsWith("/")) return s;
  const clean = s.replace(/^\.?\/*/, "");
  if (clean.startsWith("uploads/")) return `${API_BASE}/${clean}`;
  if (LOCAL_DIRS.some((p) => clean.startsWith(p.slice(1)))) return `/${clean}`;
  return `${API_BASE}/uploads/${clean}`;
}

/* ---------- normalizer ---------- */
function normalizeGardens(data) {
  if (!Array.isArray(data)) return [];
  return data.map((g) => ({
    id: String(g.id ?? g.id_jardin ?? ""),
    title: g.title ?? g.titre ?? "",
    description: g.description ?? "",
    address: g.address ?? g.adresse ?? "",
    kind: g.kind ?? g.type ?? "",
    photos: Array.isArray(g.photos) ? g.photos.map(resolveMedia) : [],
  }));
}

const uiToApiKind = {
  vegetable: "potager",
  greenhouse: "serre",
  flowers: "fleurs",
  mowing: "tondre",
};

function kindLabel(kind) {
  const k = String(kind || "").toLowerCase();
  if (!k) return "";
  if (k === "potager" || k === "vegetable") return "Potager";
  if (k === "serre" || k === "greenhouse") return "Serre";
  if (k === "fleurs" || k === "flowers") return "Fleurs";
  if (k === "tondre" || k === "mowing") return "Tonte";
  return kind; // fallback
}

export default function GardensList() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  // auth watcher
  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // favorites only when logged in
  useEffect(() => {
    if (isAuthed) setFavorites(getFavGardens().map((g) => String(g.id)));
    else setFavorites([]);
  }, [isAuthed]);

  // data load
  useEffect(() => {
    const ac = new AbortController();
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const en = new URL(`${API_BASE}/api/gardens`);
        if (search) en.searchParams.set("search", search);
        if (kind) en.searchParams.set("kind", uiToApiKind[kind] ?? kind);

        let res = await fetch(en.toString(), {
          cache: "no-store",
          signal: ac.signal,
        });

        if (!res.ok) {
          const fr = new URL(`${API_BASE}/api/jardins`);
          if (search) fr.searchParams.set("search", search);
          if (kind) fr.searchParams.set("type", uiToApiKind[kind] ?? kind);

          res = await fetch(fr.toString(), {
            cache: "no-store",
            signal: ac.signal,
          });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json();
        const list = Array.isArray(raw) ? raw : raw?.jardins;

        if (alive) setGardens(normalizeGardens(list || []));
      } catch (e) {
        if (e?.name === 'AbortError') return;
        if (alive) {
          setErr("Couldn't load gardens.");
          setGardens([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [search, kind]);

  const toggleFavorite = (g) => {
    if (!isAuthed) return;
    const id = String(g.id);

    setFavorites((prev) => {
      const isFav = prev.includes(id);

      if (isFav) {
        removeFavGarden(id);
        return prev.filter((x) => x !== id);
      } else {
        addFavGarden({
          id,
          title: g.title,
          address: g.address,
          kind: g.kind,
          photos: g.photos,
        });
        return [...prev, id];
      }
    });
  };

  const reset = () => {
    setSearch("");
    setKind("");
  };

  const filtered = useMemo(() => {
    if (!search) return gardens;
    const q = search.toLowerCase();
    return gardens.filter((g) =>
      [g.title, g.description, g.address, g.kind]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [gardens, search]);

  return (
    <div style={{ minHeight: "100vh", padding: "2.5rem 1.5rem", background: "#fff" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 400, color: "var(--foreground)", margin: 0, lineHeight: 1.1 }}>
          Les jardins
        </h1>

        {isAuthed && (
          <Link
            href="/favorites"
            style={{ color: "var(--foreground)", fontSize: "0.875rem", textDecoration: "underline", textUnderlineOffset: "3px" }}
            title="Voir mes favoris"
          >
            Mes favoris →
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2.5rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Rechercher un jardin…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 260px",
            padding: "0.6rem 0.875rem",
            border: "1px solid var(--border)",
            borderRadius: 0,
            background: "#fff",
            fontSize: "0.875rem",
            color: "var(--foreground)",
            outline: "none",
            boxShadow: "none",
          }}
        />

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          style={{
            flex: "0 1 220px",
            padding: "0.6rem 0.875rem",
            border: "1px solid var(--border)",
            borderRadius: 0,
            background: "#fff",
            fontSize: "0.875rem",
            color: "var(--foreground)",
            outline: "none",
            boxShadow: "none",
            appearance: "none",
            cursor: "pointer",
          }}
        >
          <option value="">Tous les types</option>
          <option value="vegetable">Jardin potager</option>
          <option value="greenhouse">Serre</option>
          <option value="flowers">Fleurs</option>
          <option value="mowing">Tonte</option>
        </select>

        <button
          onClick={reset}
          style={{
            padding: "0.6rem 1.25rem",
            border: "1px solid var(--border)",
            borderRadius: 0,
            background: "#fff",
            fontSize: "0.875rem",
            color: "var(--foreground)",
            cursor: "pointer",
          }}
        >
          Réinitialiser
        </button>
      </div>

      {/* States */}
      {loading && (
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }} aria-live="polite">
          Chargement…
        </p>
      )}
      {!!err && (
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1rem" }} role="alert">
          {err}
        </p>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {filtered.map((g) => {
          const favbed = favorites.includes(String(g.id));
          const kLabel = kindLabel(g.kind);

          return (
            <div
              key={g.id}
              style={{ border: "1px solid var(--border)", background: "#fff", display: "flex", flexDirection: "column" }}
            >
              {/* Image area */}
              <div style={{ position: "relative", height: "200px", overflow: "hidden", flexShrink: 0 }}>
                {g.photos.length > 0 ? (
                  <div style={{ height: "200px", overflow: "hidden" }}>
                  <Slider
                    dots
                    arrows={false}
                    infinite
                    speed={400}
                    slidesToShow={1}
                    slidesToScroll={1}
                  >
                    {g.photos.map((photo, index) => (
                      <div key={index} style={{ height: "200px", overflow: "hidden" }}>
                        <img
                          src={photo}
                          alt={`Photo ${index + 1} de ${g.title}`}
                          style={{ height: "200px", width: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    ))}
                  </Slider>
                  </div>
                ) : (
                  <img
                    src="/assets/default.jpg"
                    alt="Image par défaut"
                    style={{ height: "200px", width: "100%", objectFit: "cover", display: "block" }}
                  />
                )}

                {/* Favorite button */}
                {isAuthed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(g);
                    }}
                    style={{
                      position: "absolute",
                      top: "0.625rem",
                      right: "0.625rem",
                      background: "none",
                      border: "none",
                      padding: "0.25rem",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                      lineHeight: 1,
                      color: favbed ? "var(--green)" : "var(--muted)",
                    }}
                    aria-label={favbed ? "Retirer des favoris" : "Ajouter aux favoris"}
                    title={favbed ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {favbed ? "♥" : "♡"}
                  </button>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 400, color: "var(--foreground)", margin: 0, lineHeight: 1.2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                  {g.title}
                </h2>

                <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                  {g.address || "Adresse non renseignée"}
                </p>

                {!!kLabel && (
                  <p style={{ fontSize: "0.6875rem", color: "var(--muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {kLabel}
                  </p>
                )}

                <p style={{ fontSize: "0.8125rem", color: "var(--foreground)", margin: "0.25rem 0 0", lineHeight: 1.5, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: "2.4rem" }}>
                  {g.description || "\u00a0"}
                </p>

                <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
                  <Link
                    href={`/gardens/${g.id}`}
                    style={{ fontSize: "0.8125rem", color: "var(--muted)", textDecoration: "none" }}
                  >
                    Voir le détail →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
