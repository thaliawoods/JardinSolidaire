'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function normalizeGarden(payload) {
  if (!payload) return null;

  if ('title' in payload || 'owner' in payload) {
    return {
      id: String(payload.id ?? payload.id_jardin ?? ''),
      title: payload.title ?? payload.titre ?? '',
      description: payload.description ?? '',
      address: payload.address ?? payload.adresse ?? '',
      kind: payload.kind ?? payload.type ?? '',
      needs: payload.needs ?? payload.besoins ?? '',
      photos: Array.isArray(payload.photos) ? payload.photos : [],
      averageRating: payload.averageRating ?? payload.note_moyenne ?? null,
      owner: payload.owner
        ? {
            id: String(payload.owner.id ?? payload.owner.id_utilisateur ?? ''),
            firstName: payload.owner.firstName ?? payload.owner.prenom ?? '',
            lastName: payload.owner.lastName ?? payload.owner.nom ?? '',
            avatarUrl: payload.owner.avatarUrl ?? null,
            phone: payload.owner.phone ?? payload.owner.telephone ?? null,
            address: payload.owner.address ?? payload.owner.adresse ?? null,
            averageRating: payload.owner.averageRating ?? payload.owner.note ?? null,
            intro: payload.owner.bio ?? payload.owner.presentation ?? null,
          }
        : null,
      demoOwnerId:
        payload.ownerDemoId ??
        payload.proprietaireDemoId ??
        null,
    };
  }

  return {
    id: String(payload.id_jardin ?? ''),
    title: payload.titre ?? '',
    description: payload.description ?? '',
    address: payload.adresse ?? '',
    kind: payload.type ?? '',
    needs: payload.besoins ?? '',
    photos: Array.isArray(payload.photos) ? payload.photos : [],
    averageRating: payload.note_moyenne ?? null,
    owner: payload.owner
      ? {
          id: String(payload.owner.id_utilisateur ?? ''),
          firstName: payload.owner.prenom ?? '',
          lastName: payload.owner.nom ?? '',
          avatarUrl: payload.owner.avatarUrl ?? null,
          phone: payload.owner.telephone ?? null,
          address: payload.owner.adresse ?? null,
          averageRating: payload.owner.note ?? null,
          intro: payload.owner.presentation ?? null,
        }
      : null,
    demoOwnerId: payload.proprietaireDemoId ?? null,
  };
}

export default function GardenDetailPage({ params }) {
  const { id } = params || {};
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError('');

        let res = await fetch(`${API_BASE}/api/gardens/${id}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: 'no-store' });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (alive) setGarden(normalizeGarden(data));
      } catch (e) {
        if (alive) {
          setError("Couldn't load this garden.");
          setGarden(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (id) load();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !garden) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error || 'Unknown error'}
          </div>
          <p className="text-gray-600">
            Back to <Link href="/jardins" className="underline text-green-700">gardens</Link>.
          </p>
        </div>
      </div>
    );
  }

  const owner = garden.owner;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold text-green-800 mb-4">{garden.title}</h1>

        {Array.isArray(garden.photos) && garden.photos.length > 0 && (
          <img
            src={garden.photos[0]}
            alt={garden.title}
            className="w-full h-56 object-cover rounded-xl mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <section className="lg:col-span-2">
            <Card title="Garden information">
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>{garden.description}</p>
                <p><strong>Address:</strong> {garden.address || '—'}</p>
                <p><strong>Kind:</strong> {garden.kind || '—'}</p>
                <p><strong>Needs:</strong> {garden.needs || '—'}</p>
                <p><strong>Average rating:</strong> {garden.averageRating ?? '—'}★</p>
              </div>
            </Card>
          </section>

          <aside>
            <Card title="Owner">
              {!owner ? (
                <p className="text-sm text-gray-600">No owner linked.</p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
                      {owner.avatarUrl && (
                        <img
                          src={owner.avatarUrl}
                          alt={`${owner.firstName} ${owner.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                      <p className="text-gray-500">{owner.address || '—'}</p>
                    </div>
                  </div>

                  {garden.demoOwnerId && (
                    <Link
                      href={`/proprietaires/${garden.demoOwnerId}`}
                      className="inline-block mt-1 px-4 py-2 rounded-md bg-[#E3107D] text-white hover:bg-[#c30c6a] w-max"
                    >
                      View profile
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </aside>
        </div>

        {owner?.intro && (
          <section className="mt-6">
            <Card title="Owner introduction">
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">{owner.intro}</p>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
