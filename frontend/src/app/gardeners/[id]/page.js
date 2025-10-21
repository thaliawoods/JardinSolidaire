'use client';

import React, { useEffect, useState } from 'react';
import { getAnyToken } from '@/lib/api';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function GardenerPage({ params }) {
  const { id } = params || {};
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/api/gardeners/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (alive) {
          setGardener({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            avatarUrl: data.avatarUrl || '',
            isOnline: !!data.isOnline,
            totalReviews: data.totalReviews ?? 0,
            rating: data.rating ?? null,
            location: data.location || '—',
            skills: Array.isArray(data.skills) ? data.skills : [],
            yearsExperience: data.yearsExperience ?? null,
            intro: data.intro || data.description || '—',
            comments: data.comments || [],
          });
        }
      } catch (_e) {
        if (alive) {
          setError("Couldn't load the gardener. Showing an example.");
          setGardener({
            firstName: 'Example',
            lastName: 'Gardener',
            avatarUrl: '',
            isOnline: true,
            totalReviews: 242,
            rating: 4.9,
            location: '—',
            skills: ['mowing', 'weeding'],
            yearsExperience: 2,
            intro: 'Sample introduction text',
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
        <h1 className="sr-only">Gardener profile</h1>

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

        {gardener && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <section className="flex items-start gap-4">
                <div
                  className="relative h-28 w-28 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"
                  aria-label="Gardener avatar"
                >
                  {gardener.avatarUrl && (
                    <img
                      src={gardener.avatarUrl}
                      alt={`${gardener.firstName} ${gardener.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {gardener.isOnline && (
                    <span
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-lime-500 ring-2 ring-white"
                      title="online"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <StatBox value={gardener.totalReviews} label="reviews" />
                  <StatBox value={gardener.rating != null ? `${gardener.rating}★` : '—'} label="average rating" />
                </div>
              </section>

              <section className="lg:col-span-2">
                <Card title="Gardener info">
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <Field
                      label="Name"
                      value={`${gardener.firstName} ${gardener.lastName}`.trim() || '—'}
                    />
                    <Field label="Location" value={gardener.location} />
                    <Field
                      label="Skills"
                      value={
                        gardener.skills?.length
                          ? (Array.isArray(gardener.skills) ? gardener.skills.join(', ') : String(gardener.skills))
                          : '—'
                      }
                    />
                    <Field
                      label="Years of experience"
                      value={gardener.yearsExperience != null ? String(gardener.yearsExperience) : '—'}
                    />
                  </div>
                </Card>
              </section>
            </div>

            <section className="mt-6">
              <Card title="Introduction">
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{gardener.intro}</p>
              </Card>
            </section>

            <section className="mt-6">
              <Card title="Comments">
                <ul className="mt-3 space-y-3">
                  {(gardener.comments || []).length === 0 && (
                    <li className="text-gray-600 text-sm">No comments yet.</li>
                  )}
                  {(gardener.comments || []).map((c) => (
                    <li key={c.id} className="border rounded-lg p-3">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.text}</p>
                      {c.author && <p className="mt-1 text-xs text-gray-500">by {c.author}</p>}
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            {/* Personal availability calendar for the gardener */}
            <section className="mt-8">
              <Card title="Disponibilités du jardinier">
                <div className="rounded-2xl p-2" />
              </Card>
              <AvailabilityCalendar
                mode="gardener"
                ownerId={id}
                token={getAnyToken()}
              />
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
