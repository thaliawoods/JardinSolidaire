'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBooking, canBook } from '@/lib/bookings';

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-100 rounded-2xl" />
      <div className="h-96 bg-gray-100 rounded-2xl" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="max-w-3xl mx-auto p-6">chargement…</main>}>
      <NewBookingInner />
    </Suspense>
  );
}

function NewBookingInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const prefilledGardenId = useMemo(() => sp.get('gardenId') || '', [sp]);

  const [gardenId, setGardenId] = useState(prefilledGardenId);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const [checking, setChecking] = useState(false);
  const [can, setCan] = useState(null); // { ok, reasons }
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    setReady(true);
  }, [router]);

  // keep gardenId in sync if URL param changes
  useEffect(() => {
    if (prefilledGardenId && prefilledGardenId !== gardenId) {
      setGardenId(prefilledGardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledGardenId]);

  async function runCheck(s = startsAt, e = endsAt, g = gardenId) {
    setCan(null);
    if (!g || !s || !e) return;

    try {
      setChecking(true);
      const r = await canBook({ gardenId: g, startsAt: s, endsAt: e });
      setCan(r);
    } catch (e2) {
      setCan({ ok: false, reasons: [e2?.message || 'Erreur de vérification'] });
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!gardenId || !startsAt || !endsAt) {
      setErr('Merci de remplir au moins : jardin, début et fin.');
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        gardenId,
        title,
        notes,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      });
      router.push('/bookings?created=1');
    } catch (e2) {
      setErr(e2?.message || 'Erreur lors de la création.');
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen px-6 py-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Nouvelle réservation
            </h1>
            <p className="text-gray-600 mt-1">
              Choisis un jardin + un créneau. On vérifie si c’est réservable.
            </p>
          </div>

          <Link
            href="/bookings"
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            ← Mes réservations
          </Link>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}
        {msg && !err && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 mb-6">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Jardin (ID)" hint="obligatoire">
                <input
                  value={gardenId}
                  onChange={(e) => {
                    setGardenId(e.target.value);
                    runCheck(startsAt, endsAt, e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                  placeholder="ex: 42"
                />
              </Field>

              <Field label="Titre" hint="optionnel">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                  placeholder="ex: tonte + taille"
                />
              </Field>

              <Field label="Notes" hint="optionnel">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                  placeholder="Ce que tu comptes faire, matériel, infos utiles…"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Début" hint="obligatoire">
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => {
                      setStartsAt(e.target.value);
                      runCheck(e.target.value, endsAt, gardenId);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                  />
                </Field>

                <Field label="Fin" hint="obligatoire">
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => {
                      setEndsAt(e.target.value);
                      runCheck(startsAt, e.target.value, gardenId);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                  />
                </Field>
              </div>

              {checking && (
                <div className="text-sm text-gray-500">
                  Vérification du créneau…
                </div>
              )}

              {can &&
                (can.ok ? (
                  <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm">
                    Créneau disponible ✅
                  </div>
                ) : (
                  <div className="text-red-800 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm">
                    Créneau indisponible ❌
                    {can.reasons?.length ? (
                      <ul className="list-disc ml-5 mt-2 text-red-700">
                        {can.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting || can?.ok === false}
                className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60 font-semibold"
              >
                {submitting ? 'Création…' : 'Créer la réservation'}
              </button>

              <button
                type="button"
                className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                onClick={() => router.back()}
              >
                Annuler
              </button>

              <span className="text-xs text-gray-500">
                Si le créneau est indisponible, le bouton est désactivé.
              </span>
            </div>

            <div
              className="mt-5 h-1 w-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
              }}
            />
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <div className="text-sm font-semibold text-gray-900">Conseil</div>
            <div className="text-sm text-gray-600 mt-1">
              Pense à ajouter un titre clair (ex: “désherbage + arrosage”) et une note
              courte pour faciliter la validation.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
