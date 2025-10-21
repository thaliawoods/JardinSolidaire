'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBooking, canBook } from '@/lib/bookings';

export default function NewBookingPage() {
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
  const [checking, setChecking] = useState(false);
  const [can, setCan] = useState(null); // { ok, reasons }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  async function runCheck(s = startsAt, e = endsAt, g = gardenId) {
    setCan(null);
    if (!g || !s || !e) return;
    try {
      setChecking(true);
      const r = await canBook({ gardenId: g, startsAt: s, endsAt: e });
      setCan(r);
    } catch (e) {
      setCan({ ok: false, reasons: [e.message] });
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!gardenId || !startsAt || !endsAt) {
      setErr('merci de remplir au moins: jardin, début et fin');
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
    } catch (e) {
      setErr(e.message || 'erreur');
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Nouvelle réservation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm mb-1">Jardin (ID)</span>
          <input
            value={gardenId}
            onChange={(e) => { setGardenId(e.target.value); runCheck(startsAt, endsAt, e.target.value); }}
            className="w-full rounded border p-2"
            placeholder="ex: 42"
          />
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Titre (optionnel)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="ex: tonte + taille"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm mb-1">Début</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => { setStartsAt(e.target.value); runCheck(e.target.value, endsAt, gardenId); }}
              className="w-full rounded border p-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm mb-1">Fin</span>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => { setEndsAt(e.target.value); runCheck(startsAt, e.target.value, gardenId); }}
              className="w-full rounded border p-2"
            />
          </label>
        </div>

        {checking && <p className="text-sm text-gray-500">Vérification du créneau…</p>}
        {can && (
          can.ok ? (
            <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 text-sm">
              Créneau disponible ✅
            </div>
          ) : (
            <div className="text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm">
              Créneau indisponible ❌
              <ul className="list-disc ml-5 mt-1">
                {can.reasons?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )
        )}

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || can?.ok === false}
            className="bg-emerald-600 text-white rounded-full px-4 py-2 disabled:opacity-60"
          >
            {submitting ? 'Envoi...' : 'Créer la réservation'}
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-2 border"
            onClick={() => router.back()}
          >
            Annuler
          </button>
        </div>
      </form>
    </main>
  );
}
