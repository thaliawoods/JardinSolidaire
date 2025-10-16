'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const STORAGE_KEY = 'favGardens';

function loadFavs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

function normalizeGarden(g) {
  return {
    id: String(g.id ?? g.id_jardin ?? ''),
    title: g.title ?? g.titre ?? '',
    description: g.description ?? '',
    address: g.address ?? g.adresse ?? '',
    kind: g.kind ?? g.type ?? '',
    photos: Array.isArray(g.photos) ? g.photos : [],
  };
}

export default function FavoritesPage() {
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // read IDs from localStorage
  useEffect(() => {
    setIds(loadFavs());
  }, []);

  // fetch each garden by id
  useEffect(() => {
    let alive = true;

    async function fetchOne(id) {
      // try EN route first
      let res = await fetch(`${API_BASE}/api/gardens/${id}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: 'no-store' });
      }
      if (!res.ok) throw new Error('not_found');
      const g = await res.json();
      return normalizeGarden(g);
    }

    async function loadAll() {
      if (ids.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const results = await Promise.allSettled(ids.map(fetchOne));
        const ok = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value);
        if (alive) setItems(ok);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAll();
    return () => { alive = false; };
  }, [ids]);

  const remove = (id) => {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-green-800">My favorite gardens</h1>
        <Link href="/gardens" className="text-emerald-700 underline">← Back to gardens</Link>
      </div>

      {loading && <p className="text-gray-600">Loading…</p>}
      {!loading && ids.length === 0 && (
        <p className="text-gray-600">
          You haven’t added any favorites yet. Go to <Link className="underline text-emerald-700" href="/gardens">Gardens</Link> and tap the ♥.
        </p>
      )}

      {!loading && ids.length > 0 && items.length === 0 && (
        <p className="text-gray-600">
          None of your saved gardens could be loaded. They may have been removed.
        </p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {items.map((g) => (
          <li key={g.id} className="bg-green-100 rounded-2xl overflow-hidden shadow">
            <Link href={`/gardens/${g.id}`} className="block">
              {/* image */}
              <div className="h-44 bg-green-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.photos?.[0] || '/assets/default.jpg'}
                  alt={g.title}
                  className="h-44 w-full object-cover"
                />
              </div>
              <div className="p-3 text-sm text-gray-800">
                <div className="flex items-start justify-between">
                  <h2 className="font-semibold text-green-900">{g.title}</h2>
                  <button
                    onClick={(e) => { e.preventDefault(); remove(g.id); }}
                    className="text-pink-600 text-base"
                    title="Remove from favorites"
                  >
                    ♥
                  </button>
                </div>
                <p className="text-xs mt-1 line-clamp-2">{g.description}</p>
                <p className="text-xs">{g.address}</p>
                <p className="text-xs">{g.kind}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
