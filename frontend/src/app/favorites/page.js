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

  const total = gardens.length + gardeners.length;

  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
                Mes favoris
              </h1>
              {hasAny && (
                <p style={{ marginTop: 6, fontSize: '0.875rem', color: 'var(--muted)' }}>
                  ({total} au total) — {headerSubtitle}
                </p>
              )}
              {!hasAny && (
                <p style={{ marginTop: 6, fontSize: '0.875rem', color: 'var(--muted)' }}>
                  {headerSubtitle}
                </p>
              )}
            </div>

            {hasAny && (
              <button
                onClick={clearAll}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--border)',
                  background: '#fff',
                  color: 'var(--foreground)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
                title="Supprimer tous les favoris"
              >
                Tout effacer
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 28, display: 'flex', gap: 24 }}>
            <button
              onClick={() => setTab('gardens')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === 'gardens' ? '2px solid var(--foreground)' : '2px solid transparent',
                padding: '6px 0',
                fontSize: '0.9375rem',
                color: tab === 'gardens' ? 'var(--foreground)' : 'var(--muted)',
                cursor: 'pointer',
                fontWeight: tab === 'gardens' ? 500 : 400,
              }}
            >
              Jardins ({gardens.length})
            </button>

            <button
              onClick={() => setTab('gardeners')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === 'gardeners' ? '2px solid var(--foreground)' : '2px solid transparent',
                padding: '6px 0',
                fontSize: '0.9375rem',
                color: tab === 'gardeners' ? 'var(--foreground)' : 'var(--muted)',
                cursor: 'pointer',
                fontWeight: tab === 'gardeners' ? 500 : 400,
              }}
            >
              Jardinier·es ({gardeners.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {/* Gardens tab */}
        {tab === 'gardens' && (
          <section>
            {gardens.length === 0 ? (
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)' }}>
                Aucun jardin en favoris.{' '}
                <Link href="/gardens" style={{ color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Explorer les jardins →
                </Link>
              </p>
            ) : (
              <div>
                {gardens.map((g) => {
                  const title = g.title || `Jardin #${g.id}`;
                  const coverFallback = gardenCoverPlaceholder(title);
                  const firstChoice = g.cover || '/assets/default.jpg';

                  return (
                    <div
                      key={g.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        padding: '16px 0',
                        display: 'flex',
                        gap: 16,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Thumbnail */}
                      <Link href={`/gardens/${g.id}`} style={{ flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={firstChoice}
                          alt={title}
                          style={{ width: 80, height: 56, objectFit: 'cover', display: 'block' }}
                          onError={(e) => { e.currentTarget.src = coverFallback; }}
                        />
                      </Link>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link
                          href={`/gardens/${g.id}`}
                          style={{ fontSize: '0.9375rem', color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }}
                          title={title}
                        >
                          {title}
                        </Link>
                        {!!g.address && (
                          <p style={{ marginTop: 4, fontSize: '0.8125rem', color: 'var(--muted)' }}>{g.address}</p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeGarden(g.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', padding: '0 0 0 8px', lineHeight: 1, flexShrink: 0 }}
                        title="Retirer des favoris"
                        aria-label={`Retirer ${title} des favoris`}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Gardeners tab */}
        {tab === 'gardeners' && (
          <section>
            {gardeners.length === 0 ? (
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)' }}>
                Aucun·e jardinier·e en favoris.{' '}
                <Link href="/gardeners" style={{ color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Explorer les jardinier·es →
                </Link>
              </p>
            ) : (
              <div>
                {gardeners.map((p) => {
                  const name = [p.firstName, p.lastName].filter(Boolean).join(' ') || `Jardinier·e #${p.id}`;
                  const avatarFallback = greenAvatarPlaceholder(p.firstName, p.lastName);
                  const src = p.avatarUrl || avatarFallback;

                  return (
                    <div
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        padding: '14px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      {/* Avatar */}
                      <Link href={`/gardeners/${p.id}`} style={{ flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={name}
                          style={{ width: 40, height: 40, objectFit: 'cover', display: 'block', borderRadius: 2 }}
                          onError={(e) => { e.currentTarget.src = avatarFallback; }}
                        />
                      </Link>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link
                          href={`/gardeners/${p.id}`}
                          style={{ fontSize: '0.9375rem', color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }}
                          title={name}
                        >
                          {name}
                        </Link>
                        {p.rating != null && (
                          <p style={{ marginTop: 2, fontSize: '0.8125rem', color: 'var(--muted)' }}>
                            Note : {p.rating}
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeGardener(p.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', padding: '0 0 0 8px', lineHeight: 1, flexShrink: 0 }}
                        title="Retirer des favoris"
                        aria-label={`Retirer ${name} des favoris`}
                      >
                        ×
                      </button>
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
