'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  getFavGardens,
  getFavGardeners,
  removeFavGarden,
  removeFavGardener,
  clearAllFavorites,
  getFavoritesOwnerId,
} from '@/lib/favorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* ---------------- utils ---------------- */
function resolveMedia(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (LOCAL_DIRS.some((p) => s.startsWith(p))) return s;
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

async function fetchGardenCoverById(id) {
  let res = await fetch(`${API_BASE}/api/gardens/${id}`, { cache: 'no-store' });
  if (!res.ok) res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;

  const data = await res.json();
  const candidates = [
    data.cover,
    data.image,
    data.mainImage,
    data.coverImage,
    data.photo_couverture,
    Array.isArray(data.images) ? data.images[0] : null,
    Array.isArray(data.photos) ? data.photos[0] : null,
  ].filter(Boolean);

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

/* ---------------- small UI bits ---------------- */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
      {children}
    </span>
  );
}

function EmptyCard({ title, subtitle, href, linkText }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl">💚</div>
        <div className="flex-1">
          <p className="text-base font-semibold text-emerald-900">{title}</p>
          <p className="mt-1 text-sm text-emerald-900/70">{subtitle}</p>
          <div className="mt-4">
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              {linkText} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function FavoritesPage() {
  const [gardens, setGardens] = useState([]);
  const [gardeners, setGardeners] = useState([]);
  const [tab, setTab] = useState('gardens'); // 'gardens' | 'gardeners'
  const [ownerId, setOwnerId] = useState('guest');

  useEffect(() => {
    const uid = getFavoritesOwnerId();
    setOwnerId(uid);

    const storedGardens = getFavGardens(uid).map((g) => ({
      ...g,
      cover: resolveMedia(g.cover) || null,
    }));
    const storedGardeners = getFavGardeners(uid).map((p) => ({
      ...p,
      avatarUrl: resolveMedia(p.avatarUrl) || null,
    }));

    setGardens(storedGardens);
    setGardeners(storedGardeners);

    (async () => {
      const needs = storedGardens.filter((g) => !g.cover);
      if (needs.length === 0) return;

      const results = await Promise.all(
        storedGardens.map(async (g) => {
          if (g.cover) return g;
          const fetchedCover = await fetchGardenCoverById(g.id);
          return { ...g, cover: fetchedCover || null };
        })
      );

      setGardens(results);
    })();
  }, []);

  const syncGardens = (uid = ownerId) =>
    setGardens(getFavGardens(uid).map((g) => ({ ...g, cover: resolveMedia(g.cover) || null })));

  const syncGardeners = (uid = ownerId) =>
    setGardeners(getFavGardeners(uid).map((p) => ({ ...p, avatarUrl: resolveMedia(p.avatarUrl) || null })));

  const removeGarden = (id) => {
    removeFavGarden(id, ownerId);
    syncGardens(ownerId);
  };

  const removeGardener = (id) => {
    removeFavGardener(id, ownerId);
    syncGardeners(ownerId);
  };

  const clearAll = () => {
    clearAllFavorites(ownerId);
    setGardens([]);
    setGardeners([]);
  };

  const hasAny = gardens.length > 0 || gardeners.length > 0;

  const headerSubtitle = useMemo(() => {
    if (ownerId === 'guest') return 'Connecte-toi pour garder tes favoris liés à ton compte.';
    return 'Tes favoris sont enregistrés pour ton compte (et pas pour les autres).';
  }, [ownerId]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-950">Mes favoris</h1>
                {hasAny && <Pill>{gardens.length + gardeners.length} total</Pill>}
              </div>
              <p className="mt-2 text-sm text-emerald-900/70">{headerSubtitle}</p>
            </div>

            {hasAny && (
              <button
                onClick={clearAll}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition"
                title="Supprimer tous les favoris"
              >
                🧹 Tout effacer
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setTab('gardens')}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition border',
                tab === 'gardens'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50',
              ].join(' ')}
            >
              Jardins <span className="ml-2 opacity-90">({gardens.length})</span>
            </button>

            <button
              onClick={() => setTab('gardeners')}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition border',
                tab === 'gardeners'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50',
              ].join(' ')}
            >
              Jardiniers <span className="ml-2 opacity-90">({gardeners.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Gardens */}
        {tab === 'gardens' && (
          <section>
            {gardens.length === 0 ? (
              <EmptyCard
                title="Aucun jardin en favoris"
                subtitle="Ajoute des jardins pour les retrouver ici en 1 clic."
                href="/gardens"
                linkText="Explorer les jardins"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gardens.map((g) => {
                  const title = g.title || `Jardin #${g.id}`;
                  const coverFallback = gardenCoverPlaceholder(title);
                  const firstChoice = g.cover || '/assets/default.jpg';

                  return (
                    <div
                      key={g.id}
                      className="group rounded-3xl border border-emerald-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <Link href={`/gardens/${g.id}`} className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={firstChoice}
                          alt={title}
                          className="h-44 w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = coverFallback;
                          }}
                        />
                      </Link>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/gardens/${g.id}`}
                              className="block font-semibold text-emerald-950 truncate group-hover:underline"
                              title={title}
                            >
                              {title}
                            </Link>
                            {!!g.address && <p className="mt-1 text-sm text-emerald-900/70">📍 {g.address}</p>}
                          </div>

                          <button
                            onClick={() => removeGarden(g.id)}
                            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200 transition"
                            title="Retirer des favoris"
                            aria-label={`Retirer ${title} des favoris`}
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {!!g.kind && <Pill>{g.kind}</Pill>}
                          <Pill>💚 Favori</Pill>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Gardeners */}
        {tab === 'gardeners' && (
          <section>
            {gardeners.length === 0 ? (
              <EmptyCard
                title="Aucun jardinier en favoris"
                subtitle="Ajoute des profils pour les recontacter facilement."
                href="/gardeners"
                linkText="Explorer les jardiniers"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {gardeners.map((p) => {
                  const name = [p.firstName, p.lastName].filter(Boolean).join(' ') || `Jardinier #${p.id}`;
                  const avatarFallback = greenAvatarPlaceholder(p.firstName, p.lastName);
                  const src = p.avatarUrl || avatarFallback;

                  return (
                    <div
                      key={p.id}
                      className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <Link href={`/gardeners/${p.id}`} className="shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-emerald-200 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = avatarFallback;
                            }}
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/gardeners/${p.id}`}
                            className="block font-semibold text-emerald-950 truncate hover:underline"
                            title={name}
                          >
                            {name}
                          </Link>
                          {!!p.address && <p className="mt-1 text-sm text-emerald-900/70">📍 {p.address}</p>}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Pill>{p.rating != null ? `⭐ ${p.rating}` : '⭐ —'}</Pill>
                            <Pill>💚 Favori</Pill>
                          </div>
                        </div>

                        <button
                          onClick={() => removeGardener(p.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200 transition"
                          title="Retirer des favoris"
                          aria-label={`Retirer ${name} des favoris`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
