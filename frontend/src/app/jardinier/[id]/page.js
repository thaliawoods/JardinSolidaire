'use client';

import React, { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function JardinierPage({ params }) {
  const { id } = params || {};

  const [jardinier, setJardinier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/api/jardiniers/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (alive) {
          setJardinier({
            prenom: data.prenom || '',
            nom: data.nom || '',
            avatarUrl: data.avatarUrl || '',
            isOnline: Boolean(data.isOnline),
            totalReviews: data.totalReviews ?? 0,
            rating: data.rating ?? 4.9,
            localisation: data.localisation || '—',
            competences: Array.isArray(data.competences) ? data.competences : [],
            experienceAnnees: data.experienceAnnees ?? null,
            presentation: data.presentation || data.description || '—',
            comments: data.comments || [],
          });
        }
      } catch (e) {
        if (alive) {
          setError("Impossible de charger le jardinier. (Affichage d'un exemple)");
          setJardinier({
            prenom: 'Exemple',
            nom: 'Jardinier',
            avatarUrl: '',
            isOnline: true,
            totalReviews: 242,
            rating: 4.9,
            localisation: '—',
            competences: ['tonte', 'désherbage'],
            experienceAnnees: 2,
            presentation: 'Texte de présentation',
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
        <h1 className="sr-only">Profil Jardinier</h1>

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

        {jardinier && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <section className="flex items-start gap-4">
                <div
                  className="relative h-28 w-28 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"
                  aria-label="Avatar du jardinier"
                >
                  {jardinier.avatarUrl && (
                    <img src={jardinier.avatarUrl} alt={`${jardinier.prenom} ${jardinier.nom}`} className="h-full w-full object-cover" />
                  )}
                  {jardinier.isOnline && (
                    <span
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-lime-500 ring-2 ring-white"
                      title="en ligne"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <StatBox value={jardinier.totalReviews} label="évaluations" />
                  <StatBox value={`${jardinier.rating}+★`} label="en note globale" />
                </div>
              </section>

              <section className="lg:col-span-2">
                <Card title="Informations du Jardinier">
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <Field label="Prénom/Nom" value={`${jardinier.prenom} ${jardinier.nom}`.trim() || '—'} />
                    <Field label="Localisation" value={jardinier.localisation} />
                    <Field
                      label="Compétence(s)"
                      value={
                        jardinier.competences?.length
                          ? (Array.isArray(jardinier.competences)
                              ? jardinier.competences.join(', ')
                              : String(jardinier.competences))
                          : '—'
                      }
                    />
                    <Field
                      label="Année(s) d’expérience(s)"
                      value={jardinier.experienceAnnees != null ? `${jardinier.experienceAnnees}` : '—'}
                    />
                  </div>
                </Card>
              </section>
            </div>

            <section className="mt-6">
              <Card title="Texte de présentation">
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{jardinier.presentation}</p>
              </Card>
            </section>

            <section className="mt-6">
              <Card title="Commentaire">
                <ul className="mt-3 space-y-3">
                  {(jardinier.comments || []).length === 0 && (
                    <li className="text-gray-600 text-sm">Aucun commentaire pour le moment.</li>
                  )}
                  {(jardinier.comments || []).map((c) => (
                    <li key={c.id} className="border rounded-lg p-3">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.text}</p>
                      {c.author && <p className="mt-1 text-xs text-gray-500">par {c.author}</p>}
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
