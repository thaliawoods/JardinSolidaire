'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getMyBookings } from '@/lib/bookings';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-full px-3 py-1 text-xs font-medium bg-white border border-gray-200 shadow-sm">
      <span className="text-gray-500">{label}</span>{' '}
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return '—';
  }
}

export default function Page() {
  return (
    <Suspense fallback={<main className="max-w-5xl mx-auto p-6">chargement…</main>}>
      <BookingsListInner />
    </Suspense>
  );
}

function BookingsListInner() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await getMyBookings();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setErr('Impossible de charger vos réservations.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const justCreated = sp.get('created') === '1';

  const stats = useMemo(() => {
    const total = items.length;
    const by = (s) => items.filter((x) => x.status === s).length;
    return {
      total,
      pending: by('pending'),
      confirmed: by('confirmed'),
      cancelled: by('cancelled'),
      completed: by('completed'),
    };
  }, [items]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Mes réservations
            </h1>
            <p className="text-gray-600 mt-1">
              Suis tes créneaux, consulte les détails et gère tes statuts.
            </p>
          </div>

          <Link
            href="/bookings/new"
            className="shrink-0 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            + Nouvelle réservation
          </Link>
        </div>

        {/* Success */}
        {justCreated && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 mb-6">
            Réservation créée ✔
          </div>
        )}

        {/* Error */}
        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}

        {/* Stats */}
        {!loading && !err && (
          <div className="flex flex-wrap gap-2 mb-6">
            <StatPill label="Total" value={stats.total} />
            <StatPill label="En attente" value={stats.pending} />
            <StatPill label="Confirmées" value={stats.confirmed} />
            <StatPill label="Terminées" value={stats.completed} />
            <StatPill label="Annulées" value={stats.cancelled} />
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : items.length === 0 && !err ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
            <div className="text-gray-900 font-semibold">Aucune réservation pour le moment.</div>
            <div className="text-sm text-gray-600 mt-2">
              Crée une réservation depuis un jardin, ou via le bouton “Nouvelle réservation”.
            </div>
            <div className="mt-4">
              <Link
                href="/bookings/new"
                className="inline-flex px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition text-sm font-semibold"
              >
                + Nouvelle réservation
              </Link>
            </div>

            <div
              className="mt-6 h-1 w-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
              }}
            />
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-900 truncate">
                        {r.title || `Réservation #${r.id}`}
                      </div>
                      <BookingStatusBadge status={r.status} />
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      Jardin <span className="text-gray-900 font-medium">#{r.gardenId}</span>
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      <span className="text-gray-500">Du</span>{' '}
                      <span className="text-gray-900">{fmt(r.startsAt)}</span>{' '}
                      <span className="text-gray-500">au</span>{' '}
                      <span className="text-gray-900">{fmt(r.endsAt)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/bookings/${r.id}`}
                    className="shrink-0 rounded-full px-4 py-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
                  >
                    Détails →
                  </Link>
                </div>

                <div
                  className="mt-4 h-1 w-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(22,163,74,0.18), rgba(227,16,125,0.16))',
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
