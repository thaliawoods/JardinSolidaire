'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { getFavGardens, addFavGarden, removeFavGarden } from '@/lib/favorites';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/* ---------- helpers ---------- */
function normalizeGardens(data) {
  if (!Array.isArray(data)) return [];
  return data.map((g) => ({
    id: String(g.id ?? g.id_jardin ?? ''),
    title: g.title ?? g.titre ?? '',
    description: g.description ?? '',
    address: g.address ?? g.adresse ?? '',
    kind: g.kind ?? g.type ?? '',
    photos: Array.isArray(g.photos) ? g.photos : [],
  }));
}
const uiToApiKind = {
  vegetable: 'potager',
  greenhouse: 'serre',
  flowers: 'fleurs',
  mowing: 'tondre',
};
/* -------------------------------- */

export default function GardensList() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch]       = useState('');
  const [kind, setKind]           = useState('');
  const [gardens, setGardens]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [err, setErr]             = useState('');
  const [isAuthed, setIsAuthed]   = useState(false); // NEW

  // auth watcher
  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // load favorites only when logged in
  useEffect(() => {
    if (isAuthed) {
      setFavorites(getFavGardens().map((g) => String(g.id)));
    } else {
      setFavorites([]);
    }
  }, [isAuthed]);

  // data load
  useEffect(() => {
    const ac = new AbortController();
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr('');

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
        if (alive) {
          setErr("Couldn't load gardens.");
          setGardens([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; ac.abort(); };
  }, [search, kind]);

  const toggleFavorite = (g) => {
    if (!isAuthed) return; // guard
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

        {/* favorites link hidden if not connected */}
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
        {filtered.map((g) => (
          <Link key={g.id} href={`/gardens/${g.id}`} className="block group">
            <div className="bg-green-100 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
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
              </div>

              <div className="px-4 py-3 text-sm text-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-bold text-base text-green-900">{g.title}</h2>

                  {/* heart hidden if not connected */}
                  {isAuthed && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(g);
                      }}
                      className="text-xl transition-transform hover:scale-110"
                      aria-label={favorites.includes(String(g.id)) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      title={favorites.includes(String(g.id)) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      {favorites.includes(String(g.id)) ? (
                        <span className="text-pink-500">♥</span>
                      ) : (
                        <span className="text-gray-300 group-hover:text-gray-400">♡</span>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs leading-tight line-clamp-2">{g.description}</p>
                <p className="text-xs leading-tight">{g.address}</p>
                <p className="text-xs leading-tight">{g.kind}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
