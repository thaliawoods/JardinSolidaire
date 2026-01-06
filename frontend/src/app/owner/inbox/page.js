'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchOwnerInbox, confirmBooking, cancelBooking } from '@/lib/ownerInbox';

const BRAND_GREEN = '#16a34a';

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
    confirmed: 'bg-blue-50 text-blue-800 ring-blue-200',
    cancelled: 'bg-rose-50 text-rose-800 ring-rose-200',
    completed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  };

  const label =
    status === 'pending'
      ? 'En attente'
      : status === 'confirmed'
      ? 'Confirmée'
      : status === 'cancelled'
      ? 'Annulée'
      : status === 'completed'
      ? 'Terminée'
      : status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${
        map[status] || 'bg-gray-50 text-gray-800 ring-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full border transition ${
        active
          ? 'bg-pink-500 text-white border-pink-500'
          : 'bg-white text-gray-700 border-gray-200 shadow-sm hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

function SkeletonList() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-24 bg-gray-100 rounded-2xl" />
      <div className="h-24 bg-gray-100 rounded-2xl" />
      <div className="h-24 bg-gray-100 rounded-2xl" />
    </div>
  );
}

function EmptyState({ filter }) {
  const label =
    filter === 'pending'
      ? 'Aucune demande en attente.'
      : filter === 'confirmed'
      ? 'Aucune réservation confirmée.'
      : filter === 'cancelled'
      ? 'Aucune réservation annulée.'
      : filter === 'completed'
      ? 'Aucune réservation terminée.'
      : 'Aucune demande pour le moment.';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
      <div className="text-2xl">💌</div>
      <div className="mt-2 text-gray-800 font-semibold">{label}</div>
      <div className="mt-2 text-sm text-gray-500">Les nouvelles demandes apparaîtront ici.</div>
    </div>
  );
}

export default function OwnerInboxPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // all|pending|confirmed|cancelled|completed
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busyId, setBusyId] = useState(null);

  const tabs = useMemo(() => ['all', 'pending', 'confirmed', 'cancelled', 'completed'], []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const status = filter === 'all' ? undefined : filter;
      const data = await fetchOwnerInbox({ status });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || 'impossible de charger les demandes');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const pendingCount = useMemo(
    () => (items || []).filter((x) => String(x?.status || '').toLowerCase() === 'pending').length,
    [items]
  );

  const act = async (id, fn) => {
    try {
      setBusyId(id);
      await fn(id);
      await load();

      // ✅ refresh navbar badge (other tabs/windows)
      try {
        localStorage.setItem('bookingRequestsChanged', String(Date.now()));
      } catch {}
    } catch (e) {
      alert(e?.message || 'action_failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">Demandes</h1>
            <p className="text-gray-600 mt-1">
              Gère les demandes de réservation de tes jardins.
              {filter === 'all' && pendingCount > 0 ? (
                <span className="ml-2 text-gray-700">
                  <span className="font-semibold">{pendingCount}</span> en attente.
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/my-gardens"
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
              style={{ color: BRAND_GREEN }}
            >
              ← Mes jardins
            </Link>
          </div>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((k) => (
            <Tab key={k} active={filter === k} onClick={() => setFilter(k)}>
              {k === 'all'
                ? 'Toutes'
                : k === 'pending'
                ? 'En attente'
                : k === 'confirmed'
                ? 'Confirmées'
                : k === 'cancelled'
                ? 'Annulées'
                : k === 'completed'
                ? 'Terminées'
                : k}
            </Tab>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonList />
        ) : !items.length && !err ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-3">
            {items.map((r) => {
              const isPending = r.status === 'pending';
              const name = [r.requester?.firstName, r.requester?.lastName].filter(Boolean).join(' ') || '—';
              const email = r.requester?.email || null;

              return (
                <div key={r.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-gray-900 font-semibold">Réservation #{r.id}</div>
                        <StatusBadge status={r.status} />
                      </div>

                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Jardin :</span>{' '}
                        {r.garden?.title ? r.garden.title : `#${r.garden?.id ?? '—'}`}
                        {r.garden?.address ? <span className="text-gray-500"> • {r.garden.address}</span> : null}
                      </div>

                      <div className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Créneau :</span>{' '}
                        {r.startsAt ? new Date(r.startsAt).toLocaleString() : '—'} →{' '}
                        {r.endsAt ? new Date(r.endsAt).toLocaleString() : '—'}
                      </div>

                      <div className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Demandeur :</span> {name}
                        {email ? <span className="text-gray-500"> ({email})</span> : null}
                      </div>

                      {r.notes ? (
                        <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700 whitespace-pre-line">
                          {r.notes}
                        </div>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={busyId === r.id || !isPending}
                        onClick={() => act(r.id, confirmBooking)}
                        className="px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60"
                      >
                        {busyId === r.id ? '…' : 'Confirmer'}
                      </button>

                      <button
                        type="button"
                        disabled={busyId === r.id || !isPending}
                        onClick={() => act(r.id, cancelBooking)}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition disabled:opacity-60"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                    <div>
                      Jardin #{r.garden?.id ?? '—'} • Slot #{r.slotId ?? '—'}
                    </div>

                    <Link
                      href={`/bookings/${r.id}`}
                      className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm text-gray-700"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
