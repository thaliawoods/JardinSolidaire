'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBooking, updateBooking } from '@/lib/bookings';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';

const ACTIONS = [
  { key: 'confirm', label: 'Confirmer', patch: { status: 'confirmed' } },
  { key: 'cancel', label: 'Annuler', patch: { status: 'cancelled' } },
  { key: 'complete', label: 'Marquer terminé', patch: { status: 'completed' } },
];

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const r = await getBooking(id);
        setData(r);
      } catch {
        setErr('introuvable');
      }
    })();
  }, [id]);

  async function doAction(patch) {
    try {
      setBusy(true);
      const updated = await updateBooking(id, patch);
      setData(updated);
    } catch (e) {
      setErr(e.message || 'erreur');
    } finally {
      setBusy(false);
    }
  }

  if (err) return <main className="max-w-3xl mx-auto p-6">Erreur: {err}</main>;
  if (!data) return <main className="max-w-3xl mx-auto p-6">Chargement…</main>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <button onClick={() => router.back()} className="text-sm underline">← retour</button>

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {data.title || `Réservation #${data.id}`}
        </h1>
        <BookingStatusBadge status={data.status} />
      </header>

      <section className="space-y-2">
        <div className="text-gray-700">Jardin #{data.gardenId}</div>
        <div>
          {new Date(data.startsAt).toLocaleString()} → {new Date(data.endsAt).toLocaleString()}
        </div>
        {data.notes && <p className="text-gray-700 whitespace-pre-line">{data.notes}</p>}
      </section>

      <section className="flex gap-2 flex-wrap">
        {ACTIONS.map((a) => (
          <button
            key={a.key}
            disabled={busy}
            onClick={() => doAction(a.patch)}
            className="rounded-full px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
          >
            {a.label}
          </button>
        ))}
      </section>
    </main>
  );
}
