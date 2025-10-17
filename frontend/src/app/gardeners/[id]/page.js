'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

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
const resolveAvatar = resolveMedia;

function initials(a = '', b = '') { const x=(a||'').trim()[0]||''; const y=(b||'').trim()[0]||''; return (`${x}${y}`.toUpperCase()||'U'); }
function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#22C55E"/><stop offset="100%" stop-color="#16A34A"/>
  </linearGradient></defs>
  <rect width="256" height="256" rx="24" ry="24" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeGardener(raw) {
  if (!raw) return null;
  const firstName = raw.firstName ?? raw.prenom ?? '';
  const lastName  = raw.lastName  ?? raw.nom    ?? '';
  const skillsArr = Array.isArray(raw.skills) ? raw.skills : (raw.competences ?? []);
  const avatarRaw = raw.avatarUrl ?? raw.photo_profil ?? null;
  return {
    id: String(raw.id ?? raw.id_utilisateur ?? ''),
    firstName, lastName,
    avatarUrl: resolveAvatar(avatarRaw),
    intro: raw.intro ?? raw.presentation ?? raw.biographie ?? '',
    phone: raw.phone ?? raw.telephone ?? '',
    address: raw.address ?? raw.localisation ?? raw.adresse ?? '',
    rating: raw.rating ?? raw.note_moyenne ?? null,
    skills: skillsArr,
  };
}

export default function GardenerDetailPage({ params }) {
  const { id } = params || {};
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true); setErr('');
        let res = await fetch(`${API_BASE}/api/gardeners/${id}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`${API_BASE}/api/jardiniers/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setGardener(normalizeGardener(data));
      } catch (e) {
        if (alive) { setErr("Impossible de charger le jardinier."); setGardener(null); }
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const fallback = useMemo(
    () => greenPlaceholder(gardener?.firstName, gardener?.lastName),
    [gardener?.firstName, gardener?.lastName]
  );

  if (loading) {
    return <main className="max-w-3xl mx-auto px-4 py-8"><div className="h-24 bg-gray-100 rounded-2xl animate-pulse mb-4"/><div className="h-40 bg-gray-100 rounded-2xl animate-pulse"/></main>;
  }
  if (err || !gardener) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-4">
          {err || "Impossible de charger le jardinier."}
        </div>
        <Link href="/gardeners" className="inline-block px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">← Retour à la liste</Link>
      </main>
    );
  }

  const avatarSrc = gardener.avatarUrl || fallback; // local asset path wins if provided

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/gardeners" className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">← Jardiniers</Link>
      </div>

      <section className="flex items-center gap-4 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={`${gardener.firstName} ${gardener.lastName}`}
          className="w-20 h-20 rounded-full object-cover border-4 border-green-300 shadow"
          onError={(e) => { e.currentTarget.src = fallback; }}
        />
        <div>
          <h1 className="text-xl font-semibold text-green-800">{gardener.firstName} {gardener.lastName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Jardinier</span>
            {gardener.rating != null && (<span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">★ {Number(gardener.rating).toFixed(1)}</span>)}
            {!!gardener.address && (<span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">📍 {gardener.address}</span>)}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100 shadow-sm space-y-4">
        <p className="text-gray-700"><strong className="text-gray-800">Description&nbsp;:</strong> {gardener.intro || '—'}</p>
        <div className="flex flex-wrap gap-3">
          <p className="text-gray-700"><strong className="text-gray-800">Téléphone&nbsp;:</strong> {gardener.phone || '—'}</p>
          <p className="text-gray-700"><strong className="text-gray-800">Note&nbsp;:</strong> {gardener.rating ?? '—'}★</p>
        </div>
        {!!gardener.skills?.length && (
          <div>
            <p className="font-medium text-gray-800 mb-2">Compétences :</p>
            <div className="flex flex-wrap gap-2">
              {gardener.skills.map((s, i) => <span key={i} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{typeof s === 'string' ? s : (s?.nom ?? '—')}</span>)}
            </div>
          </div>
        )}
        <div className="pt-2 flex flex-wrap gap-3">
          <Link href="/gardeners" className="px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50">Voir d’autres jardiniers</Link>
          <Link href="/gardeners" className="px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50">Voir d’autres jardiniers</Link>
        </div>
      </section>
    </main>
  );
}
