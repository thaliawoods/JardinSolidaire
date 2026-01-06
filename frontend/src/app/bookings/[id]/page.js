'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getBooking, updateBooking } from '@/lib/bookings';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';

const ACTIONS = [
  { key: 'confirm', label: 'Confirmer', patch: { status: 'confirmed' } },
  { key: 'cancel', label: 'Annuler', patch: { status: 'cancelled' } },
  { key: 'complete', label: 'Marquer terminé', patch: { status: 'completed' } },
];

function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return '—';
  }
}

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
        setErr('Réservation introuvable.');
      }
    })();
  }, [id]);

  const title = useMemo(() => {
    if (!data) return '';
    return data.title || `Réservation #${data.id}`;
  }, [data]);

  async function doAction(patch) {
    try {
      setBusy(true);
      const updated = await updateBooking(id, patch);
      setData(updated);
    } catch (e) {
      setErr(e?.message || 'Erreur.');
    } finally {
      setBusy(false);
    }
  }

  if (err) {
    return (
      <div className="min-h-screen px-6 py-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
          <div className="mt-4">
            <Link
              href="/bookings"
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm inline-flex"
            >
              ← Mes réservations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen px-6 py-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-100 rounded-2xl" />
            <div className="h-56 bg-gray-100 rounded-2xl" />
          </div>
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
              {title}
            </h1>
            <p className="text-gray-600 mt-1">
              Jardin #{data.gardenId} · {fmt(data.startsAt)} → {fmt(data.endsAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            ← Retour
          </button>
        </div>

        {/* Status card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Statut</div>
              <div className="mt-1">
                <BookingStatusBadge status={data.status} />
              </div>
            </div>

            <Link
              href="/bookings"
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
            >
              Mes réservations
            </Link>
          </div>

          <div
            className="mt-4 h-1 w-full rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
            }}
          />
        </div>

        {/* Details card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 space-y-3">
          <div className="text-sm text-gray-600">
            <span className="text-gray-500">Jardin :</span>{' '}
            <span className="text-gray-900 font-medium">#{data.gardenId}</span>
          </div>

          <div className="text-sm text-gray-600">
            <span className="text-gray-500">Créneau :</span>{' '}
            <span className="text-gray-900">
              {fmt(data.startsAt)} → {fmt(data.endsAt)}
            </span>
          </div>

          {data.notes ? (
            <div className="pt-2">
              <div className="text-sm font-medium text-gray-700">Notes</div>
              <p className="text-sm text-gray-700 whitespace-pre-line mt-1">
                {data.notes}
              </p>
            </div>
          ) : (
            <div className="pt-2 text-sm text-gray-500">
              Aucune note ajoutée.
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.key}
                disabled={busy}
                onClick={() => doAction(a.patch)}
                className="rounded-full px-4 py-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm disabled:opacity-60"
              >
                {busy ? '…' : a.label}
              </button>
            ))}
          </div>

          <div
            className="mt-4 h-1 w-full rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(22,163,74,0.18), rgba(227,16,125,0.16))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
