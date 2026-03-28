// /frontend/src/app/owners/[id]/page.js
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const LOCAL_DIRS = ["/assets/", "/images/", "/img/", "/icons/"];

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

function initials(a = "", b = "") {
  const x = (a || "").trim()[0] || "";
  const y = (b || "").trim()[0] || "";
  return (`${x}${y}`.toUpperCase() || "U");
}

function darkAvatar(first, last) {
  const txt = initials(first, last);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#111111"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
    font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeOwner(raw) {
  if (!raw) return null;
  const base = raw.owner || raw.proprietaire || raw.utilisateur || raw;
  const firstName = base.firstName ?? base.prenom ?? "";
  const lastName = base.lastName ?? base.nom ?? "";
  const avatarUrl = resolveMedia(base.avatarUrl ?? base.photo_profil ?? base.avatar ?? null);
  const address = base.address ?? base.localisation ?? base.adresse ?? "";
  const availability = base.availability ?? base.disponibilite ?? "";
  const surface = base.surface ?? base.superficie ?? base.surface_m2 ?? "";
  const gardenType = base.gardenType ?? base.type_jardin ?? base.kind ?? "";
  const intro = base.intro ?? base.presentation ?? base.biographie ?? base.description ?? "";
  const ownerId = base.id != null ? String(base.id) : "";
  const userId = base.userId != null ? String(base.userId) : "";
  return { id: ownerId, userId, firstName, lastName, avatarUrl, address, availability, surface, gardenType, intro };
}

export default function OwnerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        let res = await fetch(`${API_BASE}/api/owners/${id}`, { cache: "no-store" });
        if (!res.ok) res = await fetch(`${API_BASE}/api/proprietaires/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setOwner(normalizeOwner(data));
      } catch {
        if (alive) { setErr("Impossible de charger ce profil."); setOwner(null); }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const fallback = useMemo(() => darkAvatar(owner?.firstName, owner?.lastName), [owner?.firstName, owner?.lastName]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
      </div>
    );
  }

  if (err || !owner) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{err || 'Profil introuvable.'}</p>
          <button onClick={() => router.back()} style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const avatarSrc = owner.avatarUrl || fallback;
  const threadUserId = owner.userId || String(id);

  const metaItems = [
    owner.address && { label: 'Localisation', value: owner.address },
    owner.gardenType && { label: 'Type', value: owner.gardenType },
    owner.surface && { label: 'Surface', value: String(owner.surface) },
    owner.availability && { label: 'Disponibilité', value: String(owner.availability) },
  ].filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)' }}>
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Back */}
        <div>
          <button
            onClick={() => router.back()}
            style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Retour
          </button>
        </div>

        {/* Profile header */}
        <section style={{ border: '1px solid var(--border)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-start' }}>

            {/* Avatar */}
            <div style={{ width: 72, height: 72, flexShrink: 0, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt={`${owner.firstName} ${owner.lastName}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.src = fallback; }}
              />
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>
                {owner.firstName} {owner.lastName}
              </h1>

              <p style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>Propriétaire</p>

              {metaItems.length > 0 && (
                <div style={{ marginTop: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  {metaItems.map(({ label, value }) => (
                    <span key={label}>
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>{label}</span>
                      {' '}{value}
                    </span>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => router.push(`/messages/${threadUserId}`)}
                  style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Contacter →
                </button>
                <Link
                  href="/gardens"
                  style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Voir les jardins →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Présentation */}
        {owner.intro && (
          <section style={{ border: '1px solid var(--border)', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.875rem' }}>
              Présentation
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
              {owner.intro}
            </p>
          </section>
        )}

      </main>
    </div>
  );
}
