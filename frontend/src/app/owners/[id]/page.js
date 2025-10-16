'use client';

import React, { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function OwnerPage({ params }) {
  const { id } = params || {};

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/api/proprietaires/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setOwner(data);
      } catch (_e) {
        if (alive) {
          setError('Unable to load the owner (showing an example).');
          setOwner({
            prenom: 'Example',
            nom: 'Owner',
            avatarUrl: '',
            isOnline: true,
            totalReviews: 0,
            rating: 4.8,
            quartier: '—',
            disponibilites: '—',
            surface: null,
            type: '—',
            presentation: 'Example introduction text.',
            comments: [],
          });
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (id) load();
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Owner information</h1>

        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-28 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
          </div>
        )}

        {!!error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {owner && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <section className="flex items-start gap-4">
                <div
                  className="relative h-28 w-28 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"
                  aria-label="Owner avatar"
                >
                  {owner.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={owner.avatarUrl} alt={`${owner.prenom ?? ''} ${owner.nom ?? ''}`} className="h-full w-full object-cover" />
                  )}
                  {owner.isOnline && (
                    <span
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-lime-500 ring-2 ring-white"
                      title="online"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <StatBox value={owner.totalReviews ?? 0} label="reviews" />
                  <StatBox value={`${owner.rating ?? '—'}★`} label="global rating" />
                </div>
              </section>

              <section className="lg:col-span-2">
                <Card title="Owner details">
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <Field label="Full name" value={`${owner.prenom ?? ''} ${owner.nom ?? ''}`.trim() || '—'} />
                    <Field label="Neighborhood" value={owner.quartier || '—'} />
                    <Field label="Availability" value={owner.disponibilites || '—'} />
                    <Field label="Surface" value={owner.surface ? `${owner.surface} m²` : '—'} />
                    <Field label="Garden type" value={owner.type || '—'} />
                  </div>
                </Card>
              </section>
            </div>

            <section className="mt-6">
              <Card title="Introduction">
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{owner.presentation || '—'}</p>
              </Card>
            </section>

            <section className="mt-6">
              <Card title="Comments">
                <ul className="mt-3 space-y-3">
                  {(owner.comments || []).length === 0 && (
                    <li className="text-gray-600 text-sm">No comments yet.</li>
                  )}
                  {(owner.comments || []).map((c) => (
                    <li key={c.id} className="border rounded-lg p-3">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.text}</p>
                      {(c.author || c.createdAt) && (
                        <p className="mt-1 text-xs text-gray-500">
                          {c.author ? `by ${c.author}` : ''} {c.createdAt ? `• ${new Date(c.createdAt).toLocaleDateString()}` : ''}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          </>
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
function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">{value ?? '—'}</p>
    </div>
  );
}
function StatBox({ value, label }) {
  return (
    <div className="border rounded-md px-3 py-2 text-xs leading-tight w-28 bg-white">
      <div className="font-semibold text-sm">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
