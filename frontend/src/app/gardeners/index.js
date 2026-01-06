// /Users/thaliawoods/Documents/Ada/JardinSolidaire/JardinSolidaire/frontend/src/app/gardeners/index.js
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAnyToken } from '@/lib/api';
import { getFavGardeners, addFavGardener, removeFavGardener } from '@/lib/favorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];
const BRAND_GREEN = '#16a34a';

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
  if (Array.isArray(maybeSkills)) {
    return maybeSkills.map((s) => String(s).trim()).filter(Boolean);
  }
  // Accept "a,b,c"
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
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} on ${url} — ${txt.slice(0, 200)}`);
      }
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

  // avatar cache-buster + listener (updates when you change avatar from dashboard)
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
      setErr('Impossible de charger les jardiniers.' + (e?.message ? `\n${e.message}` : ''));
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
    for (const g of gardeners) {
      for (const s of (g.skills || [])) set.add(s);
    }
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
        addFavGardener({
          id,
          firstName: g.firstName,
          lastName: g.lastName,
          avatarUrl: g.avatarUrl,
        });
        return [...prev, id];
      }
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSkill('');
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-green-800">Les Jardiniers</h1>
          {isAuthed && (
            <Link
              href="/favorites"
              className="px-4 py-2 rounded-full text-white"
              style={{ backgroundColor: BRAND_GREEN }}
            >
              Favoris ({favorites.length})
            </Link>
          )}
        </div>

        {/* filtres */}
        <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">
          <div className="relative w-full lg:w-[38%]">
            <span className="absolute left-3 top-2.5 text-gray-400" aria-hidden>
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher un·e jardinier·e…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm text-gray-700"
              aria-label="Rechercher un·e jardinier·e"
            />
          </div>

          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="h-10 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 w-full lg:w-[26%] text-sm text-gray-700"
          >
            <option value="">Toutes les compétences</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="h-10 px-5 rounded-full text-white w-full lg:w-auto transition bg-pink-500 hover:bg-pink-600"
          >
            Réinitialiser
          </button>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        )}

        {!!err && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-6 whitespace-pre-wrap">
            {err}
            <div className="mt-3">
              <button
                onClick={() => {
                  const ac = new AbortController();
                  load(ac.signal);
                }}
                className="px-4 py-2 rounded-full text-white bg-pink-500 hover:bg-pink-600"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !err && filtered.length === 0 && (
          <p className="text-center text-gray-600">Aucun jardinier trouvé.</p>
        )}

        <div className="space-y-6">
          {filtered.map((g) => {
            const fallback = greenPlaceholder(g.firstName, g.lastName);
            const baseSrc = g.avatarUrl || fallback;
            const src = g.avatarUrl
              ? `${baseSrc}${baseSrc.includes('?') ? '&' : '?'}v=${avatarV}`
              : baseSrc;

            const favbed = favorites.includes(String(g.id));

            return (
              <Link key={g.id} href={`/gardeners/${g.id}`} className="block">
                <article
                  className="flex rounded-2xl p-4 hover:shadow-md transition"
                  style={{
                    backgroundColor: 'rgba(22,163,74,0.06)',
                    border: '1px solid rgba(22,163,74,0.14)',
                  }}
                >
                  <div
                    className="w-28 h-28 rounded-2xl shadow-sm relative overflow-hidden shrink-0"
                    style={{ border: '3px solid rgba(22,163,74,0.30)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${g.firstName} ${g.lastName}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = fallback;
                      }}
                    />
                    {isAuthed && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(g);
                        }}
                        className="absolute top-2 right-2 text-xl hover:scale-125 transition"
                        aria-label={favbed ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        {favbed ? (
                          <span className="text-pink-500">♥</span>
                        ) : (
                          <span className="text-gray-400">♡</span>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="ml-6 flex-1 flex flex-col justify-center gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-green-900 leading-tight">
                        {g.firstName} {g.lastName}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(g.skills || []).slice(0, 8).map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: 'rgba(22,163,74,0.10)',
                            border: '1px solid rgba(22,163,74,0.18)',
                            color: '#14532d',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {(g.skills || []).length === 0 && (
                        <span className="text-xs text-gray-500">Compétences à venir</span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">Voir le profil →</div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
