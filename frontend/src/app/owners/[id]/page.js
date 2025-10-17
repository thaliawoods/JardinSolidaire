'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* ---------------- media helpers (same as other pages) ---------------- */
function resolveMedia(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (s.startsWith('http') || s.startsWith('data:')) return s;           // absolute / data
  if (LOCAL_DIRS.some((p) => s.startsWith(p))) return s;                 // local public asset
  if (s.startsWith('/uploads/')) return `${API_BASE}${s}`;               // backend absolute
  if (s.startsWith('/')) return s;                                       // other absolute local
  const clean = s.replace(/^\.?\/*/, '');                                // strip ./ or /
  if (clean.startsWith('uploads/')) return `${API_BASE}/${clean}`;       // backend relative
  if (LOCAL_DIRS.some((p) => clean.startsWith(p.slice(1)))) return `/${clean}`;
  return `${API_BASE}/uploads/${clean}`;                                 // default backend
}
const resolveAvatar = resolveMedia;

function initials(a = '', b = '') {
  const x = (a || '').trim()[0] || '';
  const y = (b || '').trim()[0] || '';
  return (`${x}${y}`.toUpperCase() || 'U');
}
function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#16A34A"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="24" ry="24" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#FFFFFF">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
/* -------------------------------------------------------------------- */

/* ---------------------------- normalizer ---------------------------- */
function normalizeOwner(raw) {
  if (!raw) return null;

  // Names
  const firstName = raw.firstName ?? raw.prenom ?? '';
  const lastName  = raw.lastName  ?? raw.nom    ?? '';

  // Avatar / contact / location
  const avatarRaw = raw.avatarUrl ?? raw.photo_profil ?? null;
  const avatarUrl = resolveAvatar(avatarRaw);

  // Core fields (try EN then FR)
  const address       = raw.address ?? raw.localisation ?? raw.adresse ?? '';
  const availability  = raw.availability ?? raw.disponibilite ?? '';
  const surface       = raw.surface ?? raw.superficie ?? raw.surface_m2 ?? raw.superficie_m2 ?? '';
  const gardenType    = raw.gardenType ?? raw.type_jardin ?? raw.kind ?? '';
  const rating        = raw.rating ?? raw.note_moyenne ?? null;
  const reviewsCount  = raw.reviewsCount ?? raw.nb_avis ?? raw.reviews?.length ?? null;

  // Intro/comments
  const intro         = raw.intro ?? raw.presentation ?? raw.biographie ?? raw.description ?? '';
  const comments      = Array.isArray(raw.comments) ? raw.comments
                     : Array.isArray(raw.avis) ? raw.avis
                     : [];

  return {
    id: String(raw.id ?? raw.id_utilisateur ?? raw.id_proprietaire ?? ''),
    firstName,
    lastName,
    avatarUrl,
    address,
    availability,
    surface,
    gardenType,
    rating,
    reviewsCount,
    intro,
    comments, // each item can be string or object { contenu/commentaire, author, note, date }
  };
}
/* -------------------------------------------------------------------- */

export default function OwnerDetailPage({ params }) {
  const { id } = params || {};
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true); setErr('');

        // Try EN then FR endpoints
        let res = await fetch(`${API_BASE}/api/owners/${id}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`${API_BASE}/api/proprietaires/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!alive) return;
        setOwner(normalizeOwner(data));
      } catch (e) {
        if (alive) { setErr("Impossible de charger le propriétaire."); setOwner(null); }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const fallback = useMemo(
    () => greenPlaceholder(owner?.firstName, owner?.lastName),
    [owner?.firstName, owner?.lastName]
  );

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse mb-4" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      </main>
    );
  }

  if (err || !owner) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-4">
          {err || "Impossible de charger le propriétaire."}
        </div>
        <Link href="/owners" className="inline-block mt-4 px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
          ← Retour
        </Link>
      </main>
    );
  }

  const avatarSrc = owner.avatarUrl || fallback; // if real avatar exists, it’ll be used first

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/owners"
          className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
        >
          ← Propriétaires
        </Link>
      </div>

      {/* identity + stats */}
      <section className="flex items-start gap-4 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={`${owner.firstName} ${owner.lastName}`}
          className="w-20 h-20 rounded-full object-cover border-4 border-green-300 shadow"
          onError={(e) => { e.currentTarget.src = fallback; }}
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-green-800">
            {owner.firstName} {owner.lastName}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!!owner.reviewsCount && (
              <span className="inline-flex items-center gap-1 text-xs bg-white border border-emerald-200 text-emerald-700 px-2 py-1 rounded-full">
                {owner.reviewsCount} avis
              </span>
            )}
            {owner.rating != null && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                ★ {Number(owner.rating).toFixed(1)} note globale
              </span>
            )}
          </div>
        </div>
      </section>

      {/* details grid */}
      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900 mb-3">Owner details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
            <p><span className="font-medium text-gray-800">Full name</span><br />{owner.firstName} {owner.lastName}</p>
            {!!owner.address && <p><span className="font-medium text-gray-800">Neighborhood</span><br />{owner.address}</p>}
            {!!owner.availability && <p><span className="font-medium text-gray-800">Availability</span><br />{owner.availability}</p>}
            {!!owner.surface && <p><span className="font-medium text-gray-800">Surface</span><br />{owner.surface}</p>}
            {!!owner.gardenType && <p><span className="font-medium text-gray-800">Garden type</span><br />{owner.gardenType}</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900 mb-3">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Propriétaire</span>
            {!!owner.gardenType && (
              <span className="px-2 py-1 text-xs rounded-full bg-white border border-emerald-200 text-emerald-700">
                {owner.gardenType}
              </span>
            )}
            {!!owner.address && (
              <span className="px-2 py-1 text-xs rounded-full bg-white border border-emerald-200 text-emerald-700">
                📍 {owner.address}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* intro */}
      <section className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-emerald-900 mb-2">Introduction</h2>
        <p className="text-gray-700">{owner.intro || '—'}</p>
      </section>

      {/* comments */}
      <section className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100 shadow-sm">
        <h2 className="text-sm font-semibold text-emerald-900 mb-2">Comments</h2>
        {owner.comments?.length ? (
          <ul className="space-y-3">
            {owner.comments.map((c, i) => {
              const text = typeof c === 'string' ? c : (c.comment || c.contenu || c.commentaire || '—');
              const who  = typeof c === 'object' ? (c.author || c.auteur || '') : '';
              const note = typeof c === 'object' && (c.note != null) ? ` • ★ ${c.note}` : '';
              return (
                <li key={i} className="text-sm text-gray-700 bg-white/60 border border-emerald-100 rounded-xl px-3 py-2">
                  <span className="block">{text}</span>
                  {(who || note) && <span className="text-xs text-gray-500">{who}{note}</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No comments yet.</p>
        )}
      </section>
    </main>
  );
}
