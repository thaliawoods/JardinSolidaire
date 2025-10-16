'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function normalizeGardener(raw) {
  if (!raw) return null;
  if ('firstName' in raw || 'lastName' in raw) {
    return {
      id: String(raw.id ?? raw.id_utilisateur ?? ''),
      firstName: raw.firstName ?? '',
      lastName: raw.lastName ?? '',
      avatarUrl: raw.avatarUrl ?? raw.photo_profil ?? null,
      intro: raw.intro ?? raw.presentation ?? raw.biographie ?? '',
      phone: raw.phone ?? raw.telephone ?? '',
      address: raw.address ?? raw.localisation ?? raw.adresse ?? '',
      rating: raw.rating ?? raw.note_moyenne ?? null,
      skills: Array.isArray(raw.skills) ? raw.skills : (raw.competences ?? []),
    };
  }
  return {
    id: String(raw.id_utilisateur ?? ''),
    firstName: raw.prenom ?? '',
    lastName: raw.nom ?? '',
    avatarUrl: raw.photo_profil ?? null,
    intro: raw.presentation ?? raw.biographie ?? '',
    phone: raw.telephone ?? '',
    address: raw.localisation ?? raw.adresse ?? '',
    rating: raw.note_moyenne ?? null,
    skills: Array.isArray(raw.competences) ? raw.competences : [],
  };
}

export default function GardenerDetailPage({ params }) {
  const { id } = params || {};
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr('');

        let res = await fetch(`${API_BASE}/api/gardeners/${id}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`${API_BASE}/api/jardiniers/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!alive) return;
        setGardener(normalizeGardener(data));
      } catch (e) {
        if (!alive) return;
        setErr("Couldn't load the gardener.");
        setGardener(null);
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (id) load();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse h-24 bg-gray-100 rounded-2xl mb-4" />
        <div className="animate-pulse h-40 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (err || !gardener) {
    return (
      <div className="min-h-screen p-6">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-4">
          Couldn&apos;t load the gardener. Showing an example.
        </div>
        <div className="rounded-xl border p-4">
          <p className="font-semibold">Lucas Durand</p>
          <p className="text-sm text-gray-600">Jardinier passionné de permaculture 🍃</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={gardener.avatarUrl || '/assets/default-avatar.jpg'}
          alt={`${gardener.firstName} ${gardener.lastName}`}
          className="w-20 h-20 rounded-full object-cover border-4 border-green-300 shadow"
        />
        <div>
          <p className="text-xl font-semibold text-green-800">
            {gardener.firstName} {gardener.lastName}
          </p>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Jardinier
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100 space-y-3">
        <p><strong>Description :</strong> {gardener.intro || '—'}</p>
        <p><strong>Téléphone :</strong> {gardener.phone || '—'}</p>
        <p>📍 {gardener.address || '—'}</p>
        <p><strong>Note :</strong> {gardener.rating ?? '—'}★</p>
        {!!gardener.skills?.length && (
          <div>
            <p className="font-medium">Compétences :</p>
            <ul className="list-disc list-inside">
              {gardener.skills.map((s, i) => (
                <li key={i}>{typeof s === 'string' ? s : s?.nom ?? '—'}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
