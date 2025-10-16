'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getFavGardens, getFavGardeners,
  removeFavGarden, removeFavGardener, clearAllFavorites
} from '@/lib/favorites';

export default function FavoritesPage() {
  const [gardens, setGardens] = useState([]);
  const [gardeners, setGardeners] = useState([]);

  useEffect(() => {
    setGardens(getFavGardens());
    setGardeners(getFavGardeners());
  }, []);

  const removeGarden = (id) => setGardens(removeFavGarden(id));
  const removeGardener = (id) => setGardeners(removeFavGardener(id));
  const clearAll = () => {
    clearAllFavorites();
    setGardens([]);
    setGardeners([]);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-800">My favorites</h1>
          {(gardens.length > 0 || gardeners.length > 0) && (
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Gardens */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Gardens</h2>
          {gardens.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No favorite gardens yet. Go to{' '}
              <Link href="/gardens" className="underline text-[#E3107D]">Gardens</Link>.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gardens.map((g) => (
                <div key={g.id} className="bg-green-100 rounded-xl overflow-hidden shadow">
                  <Link href={`/gardens/${g.id}`}>
                    <img
                      src={g.cover || '/assets/default.jpg'}
                      alt={g.title}
                      className="h-40 w-full object-cover"
                    />
                  </Link>
                  <div className="p-3 text-sm">
                    <div className="flex justify-between items-start gap-3">
                      <Link href={`/gardens/${g.id}`} className="font-semibold text-green-900">
                        {g.title || `Garden #${g.id}`}
                      </Link>
                      <button
                        onClick={() => removeGarden(g.id)}
                        className="text-gray-400 hover:text-pink-600"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-gray-600 mt-1">{g.address}</p>
                    <p className="text-gray-600">{g.kind}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gardeners */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Gardeners</h2>
          {gardeners.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No favorite gardeners yet. Browse{' '}
              <Link href="/gardeners" className="underline text-[#E3107D]">Gardeners</Link>.
            </p>
          ) : (
            <div className="space-y-4">
              {gardeners.map((p) => (
                <div key={p.id} className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <Link href={`/gardeners/${p.id}`}>
                    <img
                      src={p.avatarUrl || '/assets/default-avatar.jpg'}
                      alt={`${p.firstName} ${p.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 text-sm">
                    <Link href={`/gardeners/${p.id}`} className="font-medium text-green-900">
                      {p.firstName} {p.lastName}
                    </Link>
                    <p className="text-gray-600">{p.address}</p>
                    <p className="text-gray-600">{p.rating != null ? `${p.rating}★` : '—'}</p>
                  </div>
                  <button
                    onClick={() => removeGardener(p.id)}
                    className="text-gray-400 hover:text-pink-600"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
