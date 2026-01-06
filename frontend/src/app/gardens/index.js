// /Users/thaliawoods/Documents/Ada/JardinSolidaire/JardinSolidaire/frontend/src/app/gardens/index.js
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { getFavGardens, addFavGarden, removeFavGarden } from '@/lib/favorites';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* ---------- media helper ---------- */
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

/* ---------- normalizer ---------- */
function normalizeGardens(data) {
  if (!Array.isArray(data)) return [];
  return data.map((g) => ({
    id: String(g.id ?? g.id_jardin ?? ''),
    title: g.title ?? g.titre ?? '',
    description: g.description ?? '',
    address: g.address ?? g.adresse ?? '',
    kind: g.kind ?? g.type ?? '',
    photos: Array.isArray(g.photos) ? g.photos.map(resolveMedia) : [],
  }));
}

const uiToApiKind = {
  vegetable: 'potager',
  greenhouse: 'serre',
  flowers: 'fleurs',
  mowing: 'tondre',
};

function kindLabel(kind) {
  const k = String(kind || '').toLowerCase();
  if (!k) return '';
  if (k === 'potager' || k === 'vegetable') return 'Potager';
  if (k === 'serre' || k === 'greenhouse') return 'Serre';
  if (k === 'fleurs' || k === 'flowers') return 'Fleurs';
  if (k === 'tondre' || k === 'mowing') return 'Tonte';
  return kind; // fallback
}

export default function GardensList() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch]       = useState('');
  const [kind, setKind]           = useState('');
  const [gardens, setGardens]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [err, setErr]             = useState('');
  const [isAuthed, setIsAuthed]   = useState(false);

  // auth watcher
  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
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
        setLoading(true); setErr('');
        const en = new URL(`${API_BASE}/api/gardens`);
        if (search) en.searchParams.set('search', search);
        if (kind)   en.searchParams.set('kind', uiToApiKind[kind] ?? kind);

        let res = await fetch(en.toString(), { cache: 'no-store', signal: ac.signal });
        if (!res.ok) {
          const fr = new URL(`${API_BASE}/api/jardins`);
          if (search) fr.searchParams.set('search', search);
          if (kind)   fr.searchParams.set('type', uiToApiKind[kind] ?? kind);
          res = await fetch(fr.toString(), { cache: 'no-store', signal: ac.signal });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json();
        const list = Array.isArray(raw) ? raw : raw?.jardins;
        if (alive) setGardens(normalizeGardens(list || []));
      } catch (e) {
        console.error('Failed to load gardens', e);
        if (alive) { setErr("Couldn't load gardens."); setGardens([]); }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; ac.abort(); };
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
        addFavGarden({ id, title: g.title, address: g.address, kind: g.kind, photos: g.photos });
        return [...prev, id];
      }
    });
  };

  const reset = () => { setSearch(''); setKind(''); };

  const filtered = useMemo(() => {
    if (!search) return gardens;
    const q = search.toLowerCase();
    return gardens.filter((g) =>
      [g.title, g.description, g.address, g.kind].join(' ').toLowerCase().includes(q)
    );
  }, [gardens, search]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700">Les Jardins</h1>

        {isAuthed && (
          <Link
            href="/favorites"
            className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
            title="Voir mes favoris"
          >
            Favoris ({favorites.length})
          </Link>
        )}
      </div>

      <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">
        <label className="relative w-full lg:w-[32%]">
          <span className="sr-only">Rechercher un jardin</span>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un jardin…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
          />
        </label>

        <label className="w-full lg:w-[24%]">
          <span className="sr-only">Type de jardin</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
          >
            <option value="">Tout les types de jardin</option>
            <option value="vegetable">Jardin potager</option>
            <option value="greenhouse">Serre</option>
            <option value="flowers">Fleurs</option>
            <option value="mowing">Tonte</option>
          </select>
        </label>

        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition w-full lg:w-auto"
        >
          Réinitialiser
        </button>
      </div>

      {loading && <p className="text-center text-gray-500" aria-live="polite">Loading…</p>}
      {!!err && <p className="text-center text-red-600 mb-4" role="alert">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filtered.map((g) => {
          const favbed = favorites.includes(String(g.id));
          const kLabel = kindLabel(g.kind);

          return (
            <Link key={g.id} href={`/gardens/${g.id}`} className="block group">
              <div className="rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 hover:shadow-lg transition bg-white">
                {/* image */}
                <div className="relative h-48 overflow-hidden">
                  {g.photos.length > 0 ? (
                    <Slider dots arrows={false} infinite speed={400} slidesToShow={1} slidesToScroll={1}>
                      {g.photos.map((photo, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1} de ${g.title}`}
                          className="h-48 w-full object-cover"
                        />
                      ))}
                    </Slider>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/assets/default.jpg"
                      alt="Image par défaut"
                      className="h-48 w-full object-cover"
                    />
                  )}

                  {/* subtle gradient for readability */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />

                  {/* heart */}
                  {isAuthed && (
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFavorite(g); }}
                      className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
                      aria-label={favbed ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      title={favbed ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      {favbed ? (
                        <span className="text-pink-500 text-xl leading-none">♥</span>
                      ) : (
                        <span className="text-gray-400 text-xl leading-none">♡</span>
                      )}
                    </button>
                  )}
                </div>

                {/* ✅ footer "plus pro" */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-[17px] text-gray-900 leading-snug line-clamp-1">
                        {g.title}
                      </h2>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 min-w-0">
                        <span className="shrink-0">📍</span>
                        <span className="line-clamp-1">{g.address || 'Adresse non renseignée'}</span>
                      </div>
                    </div>

                    {!!kLabel && (
                      <span className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-800 ring-1 ring-green-200">
                        {kLabel}
                      </span>
                    )}
                  </div>

                  {!!g.description && (
                    <p className="mt-3 text-sm text-gray-600 leading-snug line-clamp-2">
                      {g.description}
                    </p>
                  )}

                  {/* tiny "cta" feel without adding buttons */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Disponible
                    </span>
                    <span className="text-green-700 font-medium group-hover:underline">
                      Voir le détail →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
