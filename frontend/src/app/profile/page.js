'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ===== Minimal fallbacks (use your own if you already have them) ===== */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
async function apiFetch(path, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    let err = { status: res.status, error: 'request_failed' };
    try { err = await res.json(); } catch {}
    throw err;
  }
  return res.json();
}
/* ==================================================================== */

export default function ProfilePage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const token = getToken();
      if (!token) {
        // not logged: bounce to /connexion
        window.location.href = '/connexion';
        return;
      }
      const r = await apiFetch('/api/me', { token });
      setMe(r.user);
    } catch (e) {
      setErr(e?.error || 'server_error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(kind, next) {
    try {
      setBusy(true);
      const token = getToken();
      if (kind === 'jardinier') {
        await apiFetch('/api/me/jardinier/publish', {
          token,
          method: 'POST',
          body: { published: next },
        });
      } else {
        await apiFetch('/api/me/proprietaire/publish', {
          token,
          method: 'POST',
          body: { published: next },
        });
      }
      await load();
    } catch (e) {
      setErr(e?.error || 'server_error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Mon profil</h1>

      {loading && <Skeleton />}

      {!!err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Erreur : {err}
        </div>
      )}

      {me && (
        <div className="space-y-8">
          {/* --- USER CARD --- */}
          <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <Field label="Nom">{me.nom || '—'}</Field>
              <Field label="Prénom">{me.prenom || '—'}</Field>
              <Field label="Email">{me.email || '—'}</Field>
              <Field label="Rôle">{me.role || '—'}</Field>
              <Field label="Téléphone">{me.telephone || '—'}</Field>
              <Field label="Adresse">{me.adresse || '—'}</Field>
              <Field label="Note">{me.note_moyenne ?? '—'}</Field>
              <Field label="Bio" full>{me.biographie || '—'}</Field>
            </div>
          </section>

          {/* --- JARDINIER CARD --- */}
          <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Profil Jardinier</h2>
              {me.jardinier?.published ? (
                <Badge color="green">Publié</Badge>
              ) : (
                <Badge color="gray">Non publié</Badge>
              )}
            </div>

            {!me.jardinier && (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">Aucun profil jardinier pour le moment.</p>
                <Link
                  href="/ajouter-jardinier"
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Créer mon profil
                </Link>
              </div>
            )}

            {me.jardinier && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Nom complet">
                    {me.jardinier.prenom} {me.jardinier.nom}
                  </Field>
                  <Field label="Localisation">{me.jardinier.localisation || '—'}</Field>
                  <Field label="Compétences" full>
                    {(me.jardinier.competences || []).join(', ') || '—'}
                  </Field>
                  <Field label="Expérience (années)">
                    {me.jardinier.experienceAnnees ?? '—'}
                  </Field>
                  <Field label="Note">{me.jardinier.rating ?? '—'}</Field>
                  <Field label="Présentation" full>
                    {me.jardinier.presentation || '—'}
                  </Field>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/modifier-jardinier"
                    className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Modifier
                  </Link>
                  <button
                    disabled={busy}
                    onClick={() => togglePublish('jardinier', !me.jardinier.published)}
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {me.jardinier.published ? 'Dépublier' : 'Publier'}
                  </button>
                </div>
              </>
            )}
          </section>

          {/* --- PROPRIETAIRE CARD --- */}
          <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Profil Propriétaire</h2>
              {me.proprietaire?.published ? (
                <Badge color="green">Publié</Badge>
              ) : (
                <Badge color="gray">Non publié</Badge>
              )}
            </div>

            {!me.proprietaire && (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">Aucun profil propriétaire pour le moment.</p>
                <Link
                  href="/ajouter-proprietaire"
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Créer mon profil
                </Link>
              </div>
            )}

            {me.proprietaire && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Nom complet">
                    {me.proprietaire.prenom} {me.proprietaire.nom}
                  </Field>
                  <Field label="Quartier">{me.proprietaire.quartier || '—'}</Field>
                  <Field label="Disponibilités">{me.proprietaire.disponibilites || '—'}</Field>
                  <Field label="Surface">{me.proprietaire.surface ? `${me.proprietaire.surface} m²` : '—'}</Field>
                  <Field label="Type de jardin">{me.proprietaire.type || '—'}</Field>
                  <Field label="Présentation" full>{me.proprietaire.presentation || '—'}</Field>
                  <Field label="Description" full>{me.proprietaire.description || '—'}</Field>
                  <Field label="Note">{me.proprietaire.rating ?? '—'}</Field>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/modifier-proprietaire"
                    className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Modifier
                  </Link>
                  <button
                    disabled={busy}
                    onClick={() => togglePublish('proprietaire', !me.proprietaire.published)}
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {me.proprietaire.published ? 'Dépublier' : 'Publier'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

/* ---------------- UI bits ---------------- */
function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <p className="font-medium">{label}</p>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}
function Badge({ color = 'gray', children }) {
  const palette = {
    green: 'bg-green-100 text-green-800 border-green-200',
    gray:  'bg-gray-100 text-gray-800 border-gray-200',
  }[color];
  return (
    <span className={`text-xs px-2 py-1 rounded border ${palette}`}>{children}</span>
  );
}
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
    </div>
  );
}
