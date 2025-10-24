'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOwnerInbox, ownerConfirmBooking, ownerCancelBooking } from '@/lib/bookings';

export default function OwnerBookingsPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  async function load() {
    try {
      setErr('');
      const data = await getOwnerInbox();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'erreur');
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function onConfirm(id) {
    try {
      setBusyId(id);
      await ownerConfirmBooking(id);
      await load();
    } catch (e) {
      alert(e.message || 'Échec confirmation');
    } finally {
      setBusyId(null);
    }
  }

  async function onCancel(id) {
    try {
      setBusyId(id);
      await ownerCancelBooking(id);
      await load();
    } catch (e) {
      alert(e.message || 'Échec annulation');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Demandes de réservation (mes jardins)</h1>
        <Link href="/gardens" className="rounded-full px-4 py-2 border">Voir mes jardins</Link>
      </div>

      {err && <div className="text-red-600">{err}</div>}

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="border rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Réservation #{r.id} — {r.status}</div>
              <div className="text-sm text-gray-600">
                Jardin #{r.gardenId}{r.garden?.title ? ` · ${r.garden.title}` : ''} •{' '}
                {new Date(r.startsAt).toLocaleString()} → {new Date(r.endsAt).toLocaleString()}
              </div>
              {r.gardener && (
                <div className="text-xs text-gray-600">
                  Demandeur: {r.gardener.firstName} {r.gardener.lastName} ({r.gardener.email})
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                disabled={busyId === r.id || r.status !== 'pending'}
                onClick={() => onConfirm(r.id)}
                className="rounded-full px-4 py-2 border disabled:opacity-60"
              >
                Confirmer
              </button>
              <button
                disabled={busyId === r.id || (r.status !== 'pending' && r.status !== 'confirmed')}
                onClick={() => onCancel(r.id)}
                className="rounded-full px-4 py-2 border bg-rose-50 disabled:opacity-60"
              >
                Annuler
              </button>
              <Link href={`/bookings/${r.id}`} className="rounded-full px-4 py-2 border">
                Détails
              </Link>
            </div>
          </li>
        ))}
        {!rows.length && !err && <li className="text-gray-500">Aucune réservation reçue.</li>}
      </ul>
    </main>
  );
}
