'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getMyBookings } from '@/lib/bookings';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';

export default function BookingsListPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyBookings();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setErr('impossible de charger vos réservations');
      }
    })();
  }, []);

  const justCreated = sp.get('created') === '1';

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes réservations</h1>
        <Link href="/bookings/new" className="rounded-full px-4 py-2 border">
          Nouvelle réservation
        </Link>
      </div>

      {justCreated && (
        <div className="rounded-md bg-emerald-50 p-3 text-emerald-800">
          Réservation créée ✅
        </div>
      )}

      {err && <p className="text-red-600">{err}</p>}

      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="border rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">
                {r.title || `Réservation #${r.id}`}
              </div>
              <div className="text-sm text-gray-600">
                Jardin #{r.gardenId} • {new Date(r.startsAt).toLocaleString()} → {new Date(r.endsAt).toLocaleString()}
              </div>
              <BookingStatusBadge status={r.status} />
            </div>
            <Link href={`/bookings/${r.id}`} className="rounded-full px-4 py-2 border">
              Détails
            </Link>
          </li>
        ))}
        {!items.length && !err && <li className="text-gray-500">Aucune réservation pour le moment.</li>}
      </ul>
    </main>
  );
}
