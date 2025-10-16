'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function JardinDetailPage({ params }) {
  const { id } = params || {};

  const [jardin, setJardin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setJardin(data);
      } catch (e) {
        if (alive) {
          setError("Impossible de charger ce jardin.");
          setJardin(null);
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

  if (error || !jardin) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error || "Erreur inconnue"}
          </div>
          <p className="text-gray-600">Retour aux{' '}
            <Link href="/jardins" className="underline text-green-700">jardins</Link>.
          </p>
        </div>
      </div>
    );
  }

  const owner = jardin.owner;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        {/* Titre + image */}
        <h1 className="text-2xl font-bold text-green-800 mb-4">{jardin.titre}</h1>

        {Array.isArray(jardin.photos) && jardin.photos.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={jardin.photos[0]}
            alt={jardin.titre}
            className="w-full h-56 object-cover rounded-xl mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Colonne gauche: infos jardin */}
          <section className="lg:col-span-2">
            <Card title="Informations du Jardin">
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>{jardin.description}</p>
                <p><strong>Adresse :</strong> {jardin.adresse || '—'}</p>
                <p><strong>Type :</strong> {jardin.type || '—'}</p>
                <p><strong>Besoins :</strong> {jardin.besoins || '—'}</p>
                <p><strong>Note moyenne :</strong> {jardin.note_moyenne ?? '—'}★</p>
              </div>
            </Card>
          </section>

          {/* Colonne droite: propriétaire */}
          <aside>
            <Card title="Informations du Propriétaire">
              {!owner ? (
                <p className="text-sm text-gray-600">Aucun propriétaire lié.</p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
                      {owner.avatarUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={owner.avatarUrl}
                          alt={`${owner.prenom} ${owner.nom}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{owner.prenom} {owner.nom}</p>
                      <p className="text-gray-500">{owner.adresse || '—'}</p>
                    </div>
                  </div>

                  {jardin.proprietaireDemoId && (
                    <Link
                      href={`/proprietaires/${jardin.proprietaireDemoId}`}
                      className="inline-block mt-1 px-4 py-2 rounded-md bg-[#E3107D] text-white hover:bg-[#c30c6a] w-max"
                    >
                      Voir le profil
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </aside>
        </div>

        {/* Présentation du proprio si dispo sur l'utilisateur */}
        {owner?.presentation && (
          <section className="mt-6">
            <Card title="Texte de présentation du propriétaire">
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">{owner.presentation}</p>
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
