'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getFavGardeners,
  addFavGardener,
  removeFavGardener,
} from '@/lib/favorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function unwrapGardeners(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  return (
    raw.gardeners ??    
    raw.gardener ??       
    raw.jardiniers ??     
    raw.jardinier ??      
    raw.data ??           // generic wrapper
    []
  );
}

function normalizeGardeners(raw) {
  const arr = unwrapGardeners(raw);
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if ('firstName' in item || 'lastName' in item || 'avatarUrl' in item) {
      // EN-first
      return {
        id: String(item.id ?? item.id_utilisateur ?? ''),
        firstName: item.firstName ?? '',
        lastName: item.lastName ?? '',
        avatarUrl: item.avatarUrl ?? item.photo_profil ?? null,
        intro: item.intro ?? item.presentation ?? item.biographie ?? '',
        phone: item.phone ?? item.telephone ?? '',
        address: item.address ?? item.localisation ?? item.adresse ?? '',
        rating: item.rating ?? item.note_moyenne ?? null,
      };
    }
    return {
      id: String(item.id ?? item.id_utilisateur ?? ''),
      firstName: item.prenom ?? '',
      lastName: item.nom ?? '',
      avatarUrl: item.photo_profil ?? null,
      intro: item.presentation ?? item.biographie ?? '',
      phone: item.telephone ?? '',
      address: item.localisation ?? item.adresse ?? '',
      rating: item.note_moyenne ?? null,
    };
  });
}

export default function GardenersList() {
  const [gardeners, setGardeners] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [minRating, setMinRating] = useState('');
  const [kind, setKind] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // hydrate favorites
  useEffect(() => {
    setFavorites(getFavGardeners().map((g) => String(g.id)));
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const en = new URL(`${API_BASE}/api/gardeners`);
        if (search) en.searchParams.set('search', search);
        if (minRating) en.searchParams.set('minRating', minRating);
        if (kind) en.searchParams.set('kind', kind);

        let res = await fetch(en.toString(), { cache: 'no-store' });
        let data;
        if (res.ok) {
          data = await res.json();
        } else {
          console.warn('[gardeners] EN list failed:', res.status);
          const fr = new URL(`${API_BASE}/api/jardiniers`);
          if (search) fr.searchParams.set('search', search);
          res = await fetch(fr.toString(), { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = await res.json();
        }

        if (!alive) return;
        const norm = normalizeGardeners(data);
        setGardeners(norm);
      } catch (e) {
        console.error('[gardeners] load error:', e);
        if (alive) {
          setErr("Impossible de charger les jardiniers.");
          setGardeners([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [search, minRating, kind]);

  const filtered = useMemo(() => {
    return gardeners.filter((g) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [g.firstName, g.lastName, g.intro, g.address].join(' ').toLowerCase().includes(q);
      const matchesRating = !minRating || (g.rating ?? 0) >= Number(minRating);
      return matchesSearch && matchesRating;
    });
  }, [gardeners, search, minRating]);

  // persist snapshot on toggle
  const toggleFavorite = (g) => {
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

  const resetFilters = () => {
    setSearch('');
    setMinRating('');
    setKind('');
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-green-800">Gardeners</h1>
        <Link
          href="/favorites"
          className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
          title="See my favorites"
        >
          Favorites ({favorites.length})
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative w-full lg:w-[30%]">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search a gardener…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm text-gray-700"
          />
        </div>

        <input
          type="number"
          step="0.1"
          placeholder="Min rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700"
          min={0}
          max={5}
        />

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700"
        >
          <option value="">Type of gardening</option>
          <option value="vegetable">Vegetable garden</option>
          <option value="flowers">Flowers</option>
          <option value="permaculture">Permaculture</option>
          <option value="learning">Learn gardening</option>
          <option value="mowing">Mowing</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white"
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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {err}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <p className="text-center text-gray-600">Aucun jardinier trouvé.</p>
      )}

      <div className="space-y-6">
        {filtered.map((g) => (
          <Link key={g.id} href={`/gardeners/${g.id}`} className="block">
            <article className="flex bg-green-100 rounded-xl shadow p-4 hover:shadow-md transition">
              <div className="w-32 h-32 bg-green-300 rounded shadow relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.avatarUrl || '/assets/default-avatar.jpg'}
                  alt={`${g.firstName} ${g.lastName}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toggleFavorite(g); }}
                  className="absolute top-2 right-2 text-xl hover:scale-125 transition"
                  aria-label="Add/remove from favorites"
                >
                  {favorites.includes(String(g.id)) ? (
                    <span className="text-pink-500">♥</span>
                  ) : (
                    <span className="text-gray-400">♡</span>
                  )}
                </button>
              </div>

              <div className="ml-6 flex flex-col justify-center">
                <p className="text-sm text-gray-600"><strong>Nom&nbsp;:</strong> {g.lastName}</p>
                <p className="text-sm text-gray-600"><strong>Prénom&nbsp;:</strong> {g.firstName}</p>
                <p className="text-sm text-gray-600"><strong>Description&nbsp;:</strong> {g.intro}</p>
                <p className="text-sm text-gray-600"><strong>Téléphone&nbsp;:</strong> {g.phone}</p>
                <p className="text-sm text-gray-600">📍 {g.address}</p>
                <p className="text-sm text-gray-600"><strong>Note&nbsp;:</strong> {g.rating ?? '—'}★</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
