'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getFavGardeners, addFavGardener, removeFavGardener } from '@/lib/favorites';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];
const BRAND_GREEN = '#16a34a';

/* ---------- helpers ---------- */
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
function normalizeGardeners(raw) {
  const arr = unwrapGardeners(raw);
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    const firstName = item.firstName ?? item.prenom ?? '';
    const lastName  = item.lastName  ?? item.nom    ?? '';
    const avatarRaw = item.avatarUrl ?? item.photo_profil ?? null;
    return {
      id: String(item.id ?? item.id_utilisateur ?? ''),
      firstName,
      lastName,
      avatarUrl: resolveAvatar(avatarRaw),
      intro: item.intro ?? item.presentation ?? item.biographie ?? '',
      phone: item.phone ?? item.telephone ?? '',
      address: item.address ?? item.localisation ?? item.adresse ?? '',
      rating: item.rating ?? item.note_moyenne ?? null,
    };
  });
}
/* -------------------------------- */

export default function GardenersList() {
  const [gardeners, setGardeners]   = useState([]);
  const [favorites, setFavorites]   = useState([]);
  const [minRating, setMinRating]   = useState('');
  const [kind, setKind]             = useState('');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [err, setErr]               = useState('');
  const [isAuthed, setIsAuthed]     = useState(false); // NEW

  // auth watcher (login/logout)
  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // only keep local favorites if logged in
  useEffect(() => {
    if (isAuthed) {
      setFavorites(getFavGardeners().map((g) => String(g.id)));
    } else {
      setFavorites([]);
    }
  }, [isAuthed]);

  // load data
  useEffect(() => {
    const ac = new AbortController();
    let alive = true;
    (async () => {
      try {
        setLoading(true); setErr('');
        const en = new URL(`${API_BASE}/api/gardeners`);
        if (search) en.searchParams.set('search', search);
        if (minRating) en.searchParams.set('minRating', minRating);
        if (kind) en.searchParams.set('kind', kind);
        let res = await fetch(en.toString(), { cache: 'no-store', signal: ac.signal });
        if (!res.ok) {
          const fr = new URL(`${API_BASE}/api/jardiniers`);
          if (search) fr.searchParams.set('search', search);
          if (minRating) fr.searchParams.set('minRating', minRating);
          if (kind) fr.searchParams.set('kind', kind);
          res = await fetch(fr.toString(), { cache: 'no-store', signal: ac.signal });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setGardeners(normalizeGardeners(data));
      } catch (_e) {
        if (alive) { setErr('Impossible de charger les jardiniers.'); setGardeners([]); }
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; ac.abort(); };
  }, [search, minRating, kind]);

  const filtered = useMemo(() => {
    return gardeners.filter((g) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || [g.firstName, g.lastName, g.intro, g.address].join(' ').toLowerCase().includes(q);
      const matchesRating = !minRating || (g.rating ?? 0) >= Number(minRating);
      return matchesSearch && matchesRating;
    });
  }, [gardeners, search, minRating]);

  const toggleFavorite = (g) => {
    if (!isAuthed) return; // guard
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
          rating: g.rating,
          address: g.address,
        });
        return [...prev, id];
      }
    });
  };

  const resetFilters = () => { setSearch(''); setMinRating(''); setKind(''); };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-green-800">Jardiniers</h1>

          {/* favorites link hidden if not connected */}
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

        <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">
          <div className="relative w-full lg:w-[30%]">
            <span className="absolute left-3 top-2.5 text-gray-400" aria-hidden>🔍</span>
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
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="h-10 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 w-full lg:w-[20%] text-sm text-gray-700"
            aria-label="Note minimale"
          >
            <option value="">Note minimale</option>
            <option value="5">5★</option>
            <option value="4.5">4.5★</option>
            <option value="4">4★</option>
            <option value="3.5">3.5★</option>
            <option value="3">3★</option>
          </select>

          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-10 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 w-full lg:w-[20%] text-sm text-gray-700"
            aria-label="Type de profil"
          >
            <option value="">Tous les profils</option>
            <option value="arrosage">Arrosage</option>
            <option value="tonte">Tonte</option>
            <option value="plantation">Plantation</option>
            <option value="taille">Taille</option>
          </select>

          <button
            onClick={resetFilters}
            className="h-10 px-5 rounded-full text-white w-full lg:w-auto transition bg-pink-500 hover:bg-pink-600"
          >
            Reset
          </button>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        )}
        {!!err && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-6">
            {err}
          </div>
        )}
        {!loading && !err && filtered.length === 0 && (
          <p className="text-center text-gray-600">Aucun jardinier trouvé.</p>
        )}

        <div className="space-y-6">
          {filtered.map((g) => {
            const fallback = greenPlaceholder(g.firstName, g.lastName);
            const src = g.avatarUrl || fallback;
            const favbed = favorites.includes(String(g.id));
            return (
              <Link key={g.id} href={`/gardeners/${g.id}`} className="block">
                <article
                  className="flex rounded-2xl p-4 hover:shadow transition"
                  style={{
                    backgroundColor: 'rgba(22,163,74,0.08)',
                    border: '1px solid rgba(22,163,74,0.15)',
                  }}
                >
                  <div
                    className="w-32 h-32 rounded-2xl shadow relative overflow-hidden shrink-0"
                    style={{ border: '4px solid rgba(22,163,74,0.35)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${g.firstName} ${g.lastName}`}
                      className="object-cover w-full h-full"
                      onError={(e) => { e.currentTarget.src = fallback; }}
                    />

                    {/* heart hidden if not connected */}
                    {isAuthed && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); toggleFavorite(g); }}
                        className="absolute top-2 right-2 text-xl hover:scale-125 transition"
                        aria-label={favbed ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        {favbed
                          ? <span className="text-pink-500">♥</span>
                          : <span className="text-gray-400">♡</span>}
                      </button>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col justify-center gap-1.5">
                    <p className="text-sm text-gray-700"><strong>Nom&nbsp;:</strong> {g.lastName}</p>
                    <p className="text-sm text-gray-700"><strong>Prénom&nbsp;:</strong> {g.firstName}</p>
                    <p className="text-sm text-gray-700"><strong>Description&nbsp;:</strong> {g.intro || '—'}</p>
                    <p className="text-sm text-gray-700"><strong>Téléphone&nbsp;:</strong> {g.phone || '—'}</p>
                    <p className="text-sm text-gray-700">📍 {g.address || '—'}</p>
                    <p className="text-sm text-gray-700"><strong>Note&nbsp;:</strong> {g.rating ?? '—'}★</p>
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
