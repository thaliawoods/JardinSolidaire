'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND_GREEN = '#16a34a';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

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

/* pick best avatar source consistently */
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

function normalizeSkills(maybeSkills) {
  if (!maybeSkills) return [];
  if (Array.isArray(maybeSkills)) return maybeSkills.map((s) => String(s).trim()).filter(Boolean);
  return String(maybeSkills)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function Chip({ children }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: 'rgba(22,163,74,0.06)',
        border: '1px solid rgba(22,163,74,0.18)',
        color: '#14532d',
      }}
    >
      {children}
    </span>
  );
}

export default function GardenerPage({ params }) {
  const { id } = params || {};
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarV, setAvatarV] = useState(0);

  // reload on cross-tab updates
  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === 'gardenerUpdated' || e?.key === 'userUpdated') {
        setAvatarV(Date.now());
        load();
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
      let res = await fetch(`${API_BASE}/api/gardeners/${id}`, { cache: 'no-store' });
      if (!res.ok) res = await fetch(`${API_BASE}/api/jardinier.es/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setGardener({
        firstName: data.firstName || data.prenom || '',
        lastName: data.lastName || data.nom || '',
        avatarUrl: resolveMedia(pickAvatar(data)),
        isOnline: !!data.isOnline,
        location: data.location || data.localisation || '—',
        skills: normalizeSkills(data.skills ?? data.competences),
        yearsExperience: data.yearsExperience ?? data.experienceAnnees ?? null,
        intro: data.intro || data.presentation || data.description || '—',
      });
    } catch (_e) {
      setError('Impossible de charger le profil jardinier.e.');
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
        <div className="mb-6">
          <Link
            href="/gardeners"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition"
          >
            <span aria-hidden>←</span> Retour aux jardinier.es
          </Link>
        </div>

        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-100 rounded-2xl" />
            <div className="h-36 bg-gray-100 rounded-2xl" />
            <div className="h-56 bg-gray-100 rounded-2xl" />
          </div>
        )}

        {!!error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {gardener && (
          <>
            {/* ✅ même disposition qu’avant : avatar + nom + chips + pills */}
            <section className="rounded-2xl p-6 mb-6 bg-white border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden flex-shrink-0"
                     style={{ border: '4px solid rgba(22,163,74,0.20)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt={`${gardener.firstName} ${gardener.lastName}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.src = greenPlaceholder(gardener.firstName, gardener.lastName); }}
                  />
                  {gardener.isOnline && (
                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-lime-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-green-900 leading-tight">
                    {gardener.firstName} {gardener.lastName}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(gardener.skills || []).slice(0, 10).map((s) => <Chip key={s}>{s}</Chip>)}
                    {(gardener.skills || []).length === 0 && (
                      <span className="text-sm text-gray-600">Compétences à venir</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <MetaPill label="Localisation" value={gardener.location} />
                  <MetaPill
                    label="Expérience"
                    value={gardener.yearsExperience != null ? `${gardener.yearsExperience} an(s)` : '—'}
                  />
                </div>
              </div>
            </section>

            <section className="mb-6">
              <Card title="Présentation">
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{gardener.intro || '—'}</p>
              </Card>
            </section>

            <section className="mt-6">
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
    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-green-800">{title}</h2>
      {children}
    </div>
  );
}

function MetaPill({ label, value }) {
  return (
    <div
      className="rounded-full px-4 py-2 text-sm"
      style={{
        backgroundColor: 'rgba(22,163,74,0.06)',
        border: '1px solid rgba(22,163,74,0.18)',
        color: '#14532d',
      }}
      title={label}
    >
      <span className="opacity-80">{label} :</span> <span className="font-medium">{value}</span>
    </div>
  );
}
