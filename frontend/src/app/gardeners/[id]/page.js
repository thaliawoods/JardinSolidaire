'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND_GREEN = '#16a34a';
const LOCAL_DIRS  = ['/assets/', '/images/', '/img/', '/icons/'];

/* -------- media helpers -------- */
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

function initials(a = '', b = '') {
  const x = (a || '').trim()[0] || '';
  const y = (b || '').trim()[0] || '';
  return (`${x}${y}`.toUpperCase() || 'U');
}
function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="24" fill="${BRAND_GREEN}"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* pick best avatar source consistently (profile → user) */
function pickAvatar(raw) {
  return (
    raw?.avatarUrl ??
    raw?.photo_profil ??
    raw?.avatar ??
    raw?.user?.avatarUrl ??
    raw?.user?.photo_profil ??
    raw?.user?.avatar ??
    null
  );
}

export default function GardenerPage({ params }) {
  const { id } = params || {};
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [avatarV, setAvatarV]   = useState(0); // cache-buster for <img src>

  // reload on cross-tab avatar updates
  useEffect(() => {
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === 'gardenerUpdated' || e.key === 'userUpdated') {
        setAvatarV(Date.now());
        load(); // refetch fresh data
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/gardeners/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setGardener({
        firstName: data.firstName || data.prenom || '',
        lastName:  data.lastName  || data.nom    || '',
        avatarUrl: resolveMedia(pickAvatar(data)),
        isOnline:  !!data.isOnline,
        totalReviews: data.totalReviews ?? 0,
        rating:    data.rating ?? null,
        location:  data.location || data.localisation || '—',
        skills:    Array.isArray(data.skills) ? data.skills : [],
        yearsExperience: data.yearsExperience ?? data.experienceAnnees ?? null,
        intro:     data.intro || data.presentation || data.description || '—',
        comments:  data.comments || [],
      });
    } catch (_e) {
      setError("Impossible de charger le profil jardinier.");
      setGardener(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const avatarSrc = useMemo(() => {
    if (!gardener) return null;
    const base = gardener.avatarUrl || greenPlaceholder(gardener.firstName, gardener.lastName);
    return gardener.avatarUrl ? `${base}${base.includes('?') ? '&' : '?'}v=${avatarV}` : base;
  }, [gardener, avatarV]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        {/* Back */}
        <div className="mb-4">
          <Link
            href="/gardeners"
            aria-label="Retour aux jardiniers"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/80 text-[#16a34a] border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
          >
            <span aria-hidden>←</span> Retour aux jardiniers
          </Link>
        </div>

        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-28 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
          </div>
        )}

        {!!error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
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
                  style={{ border: `4px solid rgba(22,163,74,0.35)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt={`${gardener.firstName} ${gardener.lastName}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.src = greenPlaceholder(gardener.firstName, gardener.lastName); }}
                  />
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
                <Card title="Informations sur le jardinier">
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <Field label="Nom" value={`${gardener.firstName} ${gardener.lastName}`.trim() || '—'} />
                    <Field label="Localisation" value={gardener.location} />
                    <Field
                      label="Compétences"
                      value={
                        gardener.skills?.length
                          ? (Array.isArray(gardener.skills) ? gardener.skills.join(', ') : String(gardener.skills))
                          : '—'
                      }
                    />
                    <Field
                      label="Années d'expérience"
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

            <section className="mt-8">
              <h2 className="sr-only">Disponibilités du jardinier</h2>
              <div
                className="rounded-2xl p-6 mb-3"
                style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}
              />
              <AvailabilityCalendar mode="gardener" ownerId={id} token={getAnyToken()} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}
    >
      <h2 className="text-lg font-semibold text-green-800">{title}</h2>
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
