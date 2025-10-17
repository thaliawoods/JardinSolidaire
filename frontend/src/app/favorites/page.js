'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getFavGardens, getFavGardeners,
  removeFavGarden, removeFavGardener, clearAllFavorites
} from '@/lib/favorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* --------------------- media helpers --------------------- */
function resolveMedia(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (LOCAL_DIRS.some((p) => s.startsWith(p))) return s; // local public asset
  if (s.startsWith('/uploads/')) return `${API_BASE}${s}`;
  if (s.startsWith('/')) return s;
  const clean = s.replace(/^\.?\/*/, '');
  if (clean.startsWith('uploads/')) return `${API_BASE}/${clean}`;
  if (LOCAL_DIRS.some((p) => clean.startsWith(p.slice(1)))) return `/${clean}`;
  return `${API_BASE}/uploads/${clean}`;
}

function initials(a = '', b = '') {
  const x = (a || '').trim()[0] || '';
  const y = (b || '').trim()[0] || '';
  const t = `${x}${y}`.toUpperCase();
  return t || 'U';
}
function greenAvatarPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#22C55E"/><stop offset="100%" stop-color="#16A34A"/>
  </linearGradient></defs>
  <rect width="256" height="256" rx="24" ry="24" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function gardenCoverPlaceholder(title = '') {
  const t = (title || '').trim();
  const letter = t ? t[0].toUpperCase() : 'J';
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#DCFCE7"/><stop offset="100%" stop-color="#BBF7D0"/>
  </linearGradient></defs>
  <rect width="640" height="360" rx="24" ry="24" fill="url(#gg)"/>
  <text x="80" y="240" font-family="Inter, Arial" font-weight="800" font-size="180" fill="#22C55E" opacity="0.25">${letter}</text>
  <text x="40" y="70" font-family="Inter, Arial" font-weight="700" font-size="28" fill="#14532D">🌿 ${t || 'Jardin'}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* -------- fetch the affiliated cover from the API when missing -------- */
async function fetchGardenCoverById(id) {
  // Try EN, then FR endpoint
  let res = await fetch(`${API_BASE}/api/gardens/${id}`, { cache: 'no-store' });
  if (!res.ok) res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;

  const data = await res.json();

  // Try common field names where the cover might be stored
  const candidates = [
    data.cover, data.image, data.mainImage, data.coverImage, data.photo_couverture,
    Array.isArray(data.images) ? data.images[0] : null,
    Array.isArray(data.photos) ? data.photos[0] : null,
  ].filter(Boolean);

  // If an object with url field
  for (const c of candidates) {
    if (typeof c === 'string') return resolveMedia(c);
    if (c && typeof c === 'object') {
      if (c.url) return resolveMedia(c.url);
      if (c.src) return resolveMedia(c.src);
      if (c.path) return resolveMedia(c.path);
    }
  }
  return null;
}

/* ------------------------------ page ------------------------------ */
export default function FavoritesPage() {
  const [gardens, setGardens] = useState([]);
  const [gardeners, setGardeners] = useState([]);

  useEffect(() => {
    // Load from storage
    const storedGardens = getFavGardens().map(g => ({
      ...g,
      cover: resolveMedia(g.cover) || null,
    }));
    const storedGardeners = getFavGardeners().map(p => ({
      ...p,
      avatarUrl: resolveMedia(p.avatarUrl) || null,
    }));

    setGardens(storedGardens);
    setGardeners(storedGardeners);

    // For any garden missing a cover, hydrate from API
    (async () => {
      const needs = storedGardens.filter(g => !g.cover);
      if (needs.length === 0) return;

      const updated = await Promise.all(storedGardens.map(async (g) => {
        if (g.cover) return g;
        const fetchedCover = await fetchGardenCoverById(g.id);
        return { ...g, cover: fetchedCover || null };
      }));

      setGardens(updated);
    })();
  }, []);

  const removeGarden = (id) => setGardens(removeFavGarden(id));
  const removeGardener = (id) => setGardeners(removeFavGardener(id));
  const clearAll = () => { clearAllFavorites(); setGardens([]); setGardeners([]); };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-800">Mes favoris</h1>
          {(gardens.length > 0 || gardeners.length > 0) && (
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              Tout effacer
            </button>
          )}
        </div>

        {/* Gardens */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Jardins</h2>
          {gardens.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Pas encore de jardins favoris. Allez voir{' '}
              <Link href="/gardens" className="underline text-[#E3107D]">Jardins</Link>.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gardens.map((g) => {
                // 1) affiliated cover from API/local if present
                // 2) local default.jpg if that fails
                // 3) pretty SVG as last resort
                const secondFallback = gardenCoverPlaceholder(g.title || `Jardin #${g.id}`);
                const firstChoice = g.cover || '/assets/default.jpg';
                return (
                  <div key={g.id} className="bg-green-50 border border-emerald-100 rounded-2xl overflow-hidden shadow-sm hover:shadow transition">
                    <Link href={`/gardens/${g.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={firstChoice}
                        alt={g.title || `Garden #${g.id}`}
                        className="h-40 w-full object-cover"
                        onError={(e) => { e.currentTarget.src = secondFallback; }}
                      />
                    </Link>
                    <div className="p-4 text-sm">
                      <div className="flex justify-between items-start gap-3">
                        <Link href={`/gardens/${g.id}`} className="font-semibold text-green-900">
                          {g.title || `Garden #${g.id}`}
                        </Link>
                        <button
                          onClick={() => removeGarden(g.id)}
                          className="text-gray-400 hover:text-pink-600"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                      {!!g.address && <p className="text-gray-600 mt-1">📍 {g.address}</p>}
                      {!!g.kind && (
                        <p className="mt-1 inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          {g.kind}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Gardeners */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Jardiniers</h2>
          {gardeners.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Pas encore de jardiniers favoris. Allez voir{' '}
              <Link href="/gardeners" className="underline text-[#E3107D]">Jardiniers</Link>.
            </p>
          ) : (
            <div className="space-y-4">
              {gardeners.map((p) => {
                const avatarFallback = greenAvatarPlaceholder(p.firstName, p.lastName);
                const src = p.avatarUrl || avatarFallback;
                return (
                  <div key={p.id} className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
                    <Link href={`/gardeners/${p.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${p.firstName} ${p.lastName}`}
                        className="w-16 h-16 rounded-full object-cover border-4 border-green-300 shadow"
                        onError={(e) => { e.currentTarget.src = avatarFallback; }}
                      />
                    </Link>
                    <div className="flex-1 text-sm">
                      <Link href={`/gardeners/${p.id}`} className="font-medium text-green-900">
                        {p.firstName} {p.lastName}
                      </Link>
                      {!!p.address && <p className="text-gray-600">📍 {p.address}</p>}
                      <p className="text-gray-600">{p.rating != null ? `${p.rating}★` : '—'}</p>
                    </div>
                    <button
                      onClick={() => removeGardener(p.id)}
                      className="text-gray-400 hover:text-pink-600"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
