'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function normalizeGardeners(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if ('firstName' in item || 'lastName' in item || 'avatarUrl' in item) {
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
      id: String(item.id_utilisateur ?? ''),
      firstName: item.prenom ?? '',
      lastName: item.nom ?? '',
      avatarUrl: item.photo_profil ?? null,
      intro: item.biographie ?? '',
      phone: item.telephone ?? '',
      address: item.adresse ?? '',
      rating: item.note_moyenne ?? null,
    };
  });
}

export default function ListeJardiniers() {
  const [gardeners, setGardeners] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [minRating, setMinRating] = useState('');
  const [kind, setKind] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const url = new URL(`${API_BASE}/api/gardeners`);
        if (search) url.searchParams.set('search', search);
        if (minRating) url.searchParams.set('minRating', minRating);
        if (kind) url.searchParams.set('kind', kind);

        let res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error('try_legacy');
        const data = await res.json();
        if (!alive) return;
        setGardeners(normalizeGardeners(data));
      } catch {
        try {
          const legacy = new URL(`${API_BASE}/api/jardiniers`);
          if (search) legacy.searchParams.set('search', search);
          const res2 = await fetch(legacy.toString(), { cache: 'no-store' });
          const data2 = await res2.json();
          if (!alive) return;
          setGardeners(normalizeGardeners(data2));
        } catch (err) {
          console.error('Failed to load gardeners:', err);
          if (alive) setGardeners([]);
        }
      }
    })();
    return () => { alive = false; };
  }, [search, minRating, kind]);

  const filtered = useMemo(() => {
    return gardeners.filter((g) => {
      const matchesSearch =
        !search ||
        [g.firstName, g.lastName, g.intro, g.address]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesRating = !minRating || (g.rating ?? 0) >= Number(minRating);
      return matchesSearch && matchesRating;
    });
  }, [gardeners, search, minRating]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const resetFilters = () => {
    setSearch('');
    setMinRating('');
    setKind('');
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Our Gardeners</h1>

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

      <div className="space-y-6">
        {filtered.map((g) => (
          <Link key={g.id} href={`/jardinier/${g.id}`} className="block">
            <article className="flex bg-green-100 rounded-xl shadow p-4 hover:shadow-md transition">
              <div className="w-32 h-32 bg-green-300 rounded shadow relative overflow-hidden">
                <img
                  src={g.avatarUrl || '/assets/default-avatar.jpg'}
                  alt={`${g.firstName} ${g.lastName}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toggleFavorite(g.id); }}
                  className="absolute top-2 right-2 text-xl hover:scale-125 transition"
                  aria-label="Add/remove from favorites"
                >
                  {favorites.includes(g.id) ? (
                    <span className="text-pink-500">♥</span>
                  ) : (
                    <span className="text-gray-400">♡</span>
                  )}
                </button>
              </div>

              <div className="ml-6 flex flex-col justify-center">
                <p className="text-sm text-gray-600"><strong>Name:</strong> {g.lastName}</p>
                <p className="text-sm text-gray-600"><strong>First name:</strong> {g.firstName}</p>
                <p className="text-sm text-gray-600"><strong>Description:</strong> {g.intro}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {g.phone}</p>
                <p className="text-sm text-gray-600">📍 {g.address}</p>
                <p className="text-sm text-gray-600"><strong>Rating:</strong> {g.rating ?? '—'}★</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
