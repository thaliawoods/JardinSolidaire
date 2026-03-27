'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAnyToken } from '@/lib/api';
import { getFavGardeners, addFavGardener, removeFavGardener } from '@/lib/favorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];
const BRAND_GREEN = '#16a34a';
const BRAND_PINK = '#E3107D';

/* ----- small utils ----- */
function isAbort(err) {
  return (
    err?.name === 'AbortError' ||
    err?.code === 20 ||
    /aborted|abort/i.test(err?.message || '')
  );
}

function useDebounced(value, ms = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/* ----- helpers ----- */
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
  return (`${x}${y}`.toUpperCase() || 'U');
}

function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="24" fill="${BRAND_GREEN}"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function unwrapGardeners(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  return raw.gardeners ?? raw.gardener ?? raw.jardiniers ?? raw.jardinier ?? raw.data ?? [];
}

function normalizeSkills(maybeSkills) {
  if (!maybeSkills) return [];
  if (Array.isArray(maybeSkills)) return maybeSkills.map((s) => String(s).trim()).filter(Boolean);
  return String(maybeSkills)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeGardeners(raw) {
  const arr = unwrapGardeners(raw);
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    const firstName = item.firstName ?? item.prenom ?? '';
    const lastName = item.lastName ?? item.nom ?? '';

    const avatarRaw =
      item.avatarUrl ??
      item.photo_profil ??
      item.avatar ??
      item.user?.avatarUrl ??
      item.user?.photo_profil ??
      item.user?.avatar ??
      null;

    const skillsRaw =
      item.skills ??
      item.competences ??
      item.user?.skills ??
      item.user?.competences ??
      null;

    return {
      id: String(item.id ?? item.id_utilisateur ?? item.userId ?? ''),
      firstName,
      lastName,
      avatarUrl: resolveMedia(avatarRaw),
      skills: normalizeSkills(skillsRaw),
    };
  });
}

/* ----- robust fetch over multiple endpoints ----- */
async function fetchGardeners(params) {
  const { search, skill, signal } = params || {};
  const candidates = [
    `${API_BASE}/api/gardeners`,
    `${API_BASE}/api/jardiniers`,
    `${API_BASE}/gardeners`,
    `${API_BASE}/jardiniers`,
  ];

  let lastErr;
  for (const base of candidates) {
    try {
      const url = new URL(base);
      if (search) url.searchParams.set('search', search);
      if (skill) url.searchParams.set('skill', skill);

      const res = await fetch(url.toString(), { cache: 'no-store', signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
      const json = await res.json();
      return normalizeGardeners(json);
    } catch (e) {
      if (isAbort(e) || signal?.aborted) {
        const err = new Error('aborted');
        err.name = 'AbortError';
        lastErr = err;
        break;
      }
      lastErr = e;
    }
  }
  throw lastErr || new Error('All endpoints failed');
}

export default function GardenersList() {
  const [gardeners, setGardeners] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [skill, setSkill] = useState('');
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounced(search, 300);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);

  // avatar cache-buster
  const [avatarV, setAvatarV] = useState(0);
  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === 'userUpdated') setAvatarV(Date.now());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // auth watcher
  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (isAuthed) setFavorites(getFavGardeners().map((g) => String(g.id)));
    else setFavorites([]);
  }, [isAuthed]);

  async function load(signal) {
    setLoading(true);
    setErr('');
    try {
      const list = await fetchGardeners({ search: searchDebounced, skill, signal });
      setGardeners(list);
    } catch (e) {
      if (isAbort(e)) return;
      console.error('[gardeners] load failed:', e);
      setErr('Impossible de charger les jardinier.es.');
      setGardeners([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [searchDebounced, skill]);

  const allSkills = useMemo(() => {
    const set = new Set();
    for (const g of gardeners) for (const s of (g.skills || [])) set.add(s);
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [gardeners]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return gardeners.filter((g) => {
      const matchesSearch =
        !q || [g.firstName, g.lastName, ...(g.skills || [])].join(' ').toLowerCase().includes(q);

      const matchesSkill =
        !skill || (g.skills || []).map((x) => x.toLowerCase()).includes(skill.toLowerCase());

      return matchesSearch && matchesSkill;
    });
  }, [gardeners, search, skill]);

  const toggleFavorite = (g) => {
    if (!isAuthed) return;
    const id = String(g.id);
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        removeFavGardener(id);
        return prev.filter((x) => x !== id);
      } else {
        addFavGardener({ id, firstName: g.firstName, lastName: g.lastName, avatarUrl: g.avatarUrl });
        return [...prev, id];
      }
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSkill('');
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
            Les jardinier·es
          </h1>

          {isAuthed && (
            <Link
              href="/favorites"
              style={{ color: 'var(--foreground)', fontSize: '0.875rem', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              Mes favoris →
            </Link>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
          <input
            type="text"
            placeholder="Rechercher un·e jardinier·e…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1 1 220px',
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: '#fff',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              outline: 'none',
              borderRadius: 0,
            }}
          />

          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={{
              flex: '1 1 160px',
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: '#fff',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              outline: 'none',
              borderRadius: 0,
            }}
          >
            <option value="">Toutes les compétences</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--border)',
              background: '#fff',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            Réinitialiser
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
        )}

        {/* Error */}
        {!!err && !loading && (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{err}</p>
        )}

        {/* Empty */}
        {!loading && !err && filtered.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Aucun·e jardinier·e trouvé·e.</p>
        )}

        {/* List */}
        <div>
          {filtered.map((g) => {
            const fallback = greenPlaceholder(g.firstName, g.lastName);
            const baseSrc = g.avatarUrl || fallback;
            const src = g.avatarUrl ? `${baseSrc}${baseSrc.includes('?') ? '&' : '?'}v=${avatarV}` : baseSrc;

            const favbed = favorites.includes(String(g.id));

            return (
              <article
                key={g.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                {/* Avatar */}
                <div style={{ flexShrink: 0, width: 50, height: 50, overflow: 'hidden', borderRadius: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${g.firstName} ${g.lastName}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.src = fallback; }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--foreground)', fontWeight: 400 }}>
                      {g.firstName} {g.lastName}
                    </span>

                    {isAuthed && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); toggleFavorite(g); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0, color: favbed ? 'var(--green)' : 'var(--muted)', lineHeight: 1 }}
                        aria-label={favbed ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        title={favbed ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        {favbed ? '♥' : '♡'}
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {(g.skills || []).slice(0, 8).map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                          padding: '1px 6px',
                          lineHeight: 1.6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {(g.skills || []).length === 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Compétences à venir</span>
                    )}
                  </div>
                </div>

                {/* Link */}
                <Link
                  href={`/gardeners/${g.id}`}
                  style={{ flexShrink: 0, fontSize: '0.8125rem', color: 'var(--muted)', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Voir le profil →
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </main>
  );
}
