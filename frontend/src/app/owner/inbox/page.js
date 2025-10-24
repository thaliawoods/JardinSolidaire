'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchOwnerInbox, confirmBooking, cancelBooking } from '@/lib/ownerInbox';

function Badge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function OwnerInboxPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // all|pending|confirmed|cancelled|completed
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const status = filter === 'all' ? undefined : filter;
      const data = await fetchOwnerInbox({ status });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'failed');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const act = async (id, fn) => {
    try {
      setBusyId(id);
      await fn(id);
      await load();
    } catch (e) {
      alert(e.message || 'action_failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Demandes de réservation</h1>
        <Link href="/my-gardens" className="rounded-full px-4 py-2 border">Mes jardins</Link>
      </div>

      <div className="flex gap-2">
        {['all','pending','confirmed','cancelled','completed'].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-full text-sm border ${filter===k ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {k === 'all' ? 'Toutes' : k}
          </button>
        ))}
      </div>

      {loading && <div className="rounded-xl border p-6 bg-white text-gray-500">Chargement…</div>}
      {err && <div className="rounded-xl border p-6 bg-rose-50 text-rose-700">{err}</div>}

      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="border rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Réservation #{r.id} • Jardin #{r.garden?.id} — {r.garden?.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(r.startsAt).toLocaleString()} → {new Date(r.endsAt).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Demandeur : {r.requester?.firstName} {r.requester?.lastName} ({r.requester?.email})
                </div>
                <Badge status={r.status} />
              </div>

              <div className="flex gap-2">
                <button
                  disabled={busyId === r.id || r.status !== 'pending'}
                  onClick={() => act(r.id, confirmBooking)}
                  className="rounded-full px-3 py-1.5 border hover:bg-gray-50 disabled:opacity-60"
                >
                  Confirmer
                </button>
                <button
                  disabled={busyId === r.id || r.status !== 'pending'}
                  onClick={() => act(r.id, cancelBooking)}
                  className="rounded-full px-3 py-1.5 border hover:bg-gray-50 disabled:opacity-60"
                >
                  Annuler
                </button>
              </div>
            </div>
          </li>
        ))}
        {!loading && !items.length && !err && (
          <li className="text-gray-500">Aucune réservation.</li>
        )}
      </ul>
    </main>
  );
}
