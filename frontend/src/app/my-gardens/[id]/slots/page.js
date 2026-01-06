'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';

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

function pad2(n) {
  return String(n).padStart(2, '0');
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export default function SlotsPage() {
  const { id } = useParams();
  const router = useRouter();

  const gardenId = useMemo(() => Number(id), [id]);

  const [dateISO, setDateISO] = useState(() => todayISO());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  async function handleCreateSlot(e) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!gardenId || !dateISO || !startTime || !endTime) {
      setErr('Merci de remplir au moins : date, début et fin.');
      return;
    }

    try {
      setBusy(true);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/api/availability/gardens/${gardenId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: dateISO,
          startTime,
          endTime,
          status: 'free',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'create_failed');

      setMsg('Créneau libre ajouté ✅');
    } catch (e2) {
      setErr(e2?.message || 'Erreur lors de la création.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">Mes créneaux</h1>
            <p className="text-gray-600 mt-1">Ajoute des créneaux “libres” pour ce jardin.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/my-gardens"
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
            >
              ← Mes jardins
            </Link>
            <Link
              href={`/garden/${gardenId}`}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
            >
              Voir la fiche →
            </Link>
          </div>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-5">
            {err}
          </div>
        )}
        {msg && !err && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 mb-5">
            {msg}
          </div>
        )}

        {/* ✅ Form card (en haut) */}
        <form onSubmit={handleCreateSlot} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-900">Nouveau créneau (libre)</div>
          <div className="text-sm text-gray-600 mt-1">
            Clique un jour dans le calendrier (en dessous) : la date se remplit automatiquement.
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <Field label="Date" hint="obligatoire">
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Début" hint="obligatoire">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStartTime(v);

                    // ✅ bonus UX : fin = +1h (même minutes)
                    const h = parseInt(v.slice(0, 2), 10);
                    const mm = v.slice(3, 5);
                    const eh = String(Math.min(23, h + 1)).padStart(2, '0');
                    setEndTime(`${eh}:${mm}`);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                />
              </Field>

              <Field label="Fin" hint="obligatoire">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60 font-semibold"
            >
              {busy ? 'Création…' : 'Créer un créneau libre'}
            </button>

            <button
              type="button"
              className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
              onClick={() => router.back()}
            >
              Retour
            </button>

            <span className="text-xs text-gray-500">Fin auto à +1h quand tu changes le début.</span>
          </div>

          <div
            className="mt-5 h-1 w-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
            }}
          />
        </form>

        {/* ✅ Calendrier en dessous (comme avant) */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <AvailabilityCalendar
            mode="garden"
            intent="form"
            gardenId={gardenId}
            title="Calendrier"
            onDateSelect={(iso) => setDateISO(iso)}
          />
        </div>
      </div>
    </div>
  );
}
