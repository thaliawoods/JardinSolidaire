'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import {
  getFavGardens,
  addFavGarden,
  removeFavGarden,
} from '@/lib/favorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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

export default function GardensList() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('');
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    setFavorites(getFavGardens().map((g) => String(g.id)));
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr('');

        const en = new URL(`${API_BASE}/api/gardens`);
        if (search) en.searchParams.set('search', search);
        if (kind) en.searchParams.set('kind', uiToApiKind[kind] ?? kind);

        let res = await fetch(en.toString(), { cache: 'no-store' });

        if (!res.ok) {
          const fr = new URL(`${API_BASE}/api/jardins`);
          if (search) fr.searchParams.set('search', search);
          if (kind) fr.searchParams.set('type', uiToApiKind[kind] ?? kind);
          res = await fetch(fr.toString(), { cache: 'no-store' });
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
    return () => {
      alive = false;
    };
  }, [search, kind]);

  const toggleFavorite = (g) => {
    const id = String(g.id);
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        removeFavGarden(id);
        return prev.filter((x) => x !== id);
      } else {
        addFavGarden({
          id,
          title: g.title,
          address: g.address,
          kind: g.kind,
          photos: g.photos,
        });
        return [...prev, id];
      }
    });
  };

  const reset = () => {
    setSearch('');
    setKind('');
  };

  const filtered = useMemo(() => {
    if (!search) return gardens;
    const q = search.toLowerCase();
    return gardens.filter((g) =>
      [g.title, g.description, g.address, g.kind].join(' ').toLowerCase().includes(q)
    );
  }, [gardens, search]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-green-800">
          Nos Jardins
        </h1>

        <Link
          href="/favorites"
          className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
          title="See my favorites"
        >
          Favoris ({favorites.length})
        </Link>
      </div>

      <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">
        <div className="relative w-full lg:w-[30%]">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search a garden…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm text-gray-700"
          />
        </div>

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 w-full lg:w-[20%] text-sm text-gray-700"
        >
          <option value="">Tout les types de jardin</option>
          <option value="vegetable">Jardin potager</option>
          <option value="greenhouse">Serre</option>
          <option value="flowers">Fleurs</option>
          <option value="mowing">Tonte</option>
        </select>

        <button
          onClick={reset}
          className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white transition w-full lg:w-auto"
        >
          Reset
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading…</p>}
      {!!err && <p className="text-center text-red-600 mb-4">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((g) => (
          <Link key={g.id} href={`/gardens/${g.id}`} className="block">
            <div className="bg-green-100 rounded-2xl overflow-hidden shadow-md relative group hover:shadow-xl transition">
              <div className="h-48 overflow-hidden">
                {g.photos.length > 0 ? (
                  <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                    {g.photos.map((photo, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="h-48 w-full object-cover"
                      />
                    ))}
                  </Slider>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/assets/default.jpg"
                    alt="Default image"
                    className="h-48 w-full object-cover"
                  />
                )}
              </div>

              <div className="px-3 py-2 text-sm text-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-bold text-base text-green-900">{g.title}</h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(g);
                    }}
                    className="text-xl transition-transform transform hover:scale-125"
                    aria-label="Add to favorites"
                  >
                    {favorites.includes(String(g.id)) ? (
                      <span className="text-pink-500">♥</span>
                    ) : (
                      <span className="text-gray-400">♡</span>
                    )}
                  </button>
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
