'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchOwnerInbox, confirmBooking, cancelBooking } from '@/lib/ownerInbox';

const BRAND_GREEN = '#16a34a';

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

      try {
        localStorage.setItem('bookingRequestsChanged', String(Date.now()));
      } catch {}
    } catch (e) {
      alert(e?.message || 'action_failed');
    } finally {
      setBusyId(null);
    }
  };

  function statusLabel(status) {
    if (status === 'pending') return 'En attente';
    if (status === 'confirmed') return 'Confirmée';
    if (status === 'cancelled') return 'Annulée';
    if (status === 'completed') return 'Terminée';
    return status;
  }

  function statusColor(status) {
    if (status === 'confirmed') return 'var(--green)';
    return 'var(--muted)';
  }

  function tabLabel(k) {
    if (k === 'all') return 'Toutes';
    if (k === 'pending') return 'En attente';
    if (k === 'confirmed') return 'Confirmées';
    if (k === 'cancelled') return 'Annulées';
    if (k === 'completed') return 'Terminées';
    return k;
  }

  function emptyLabel(f) {
    if (f === 'pending') return 'Aucune demande en attente.';
    if (f === 'confirmed') return 'Aucune réservation confirmée.';
    if (f === 'cancelled') return 'Aucune réservation annulée.';
    if (f === 'completed') return 'Aucune réservation terminée.';
    return 'Aucune demande.';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
            Demandes
          </h1>
          <Link
            href="/my-gardens"
            style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}
          >
            Mes jardins ←
          </Link>
        </div>

        {filter === 'all' && pendingCount > 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 24 }}>
            {pendingCount} en attente.
          </p>
        )}

        {err && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 20 }}>{err}</p>
        )}

        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 32, marginTop: 24 }}>
          {tabs.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: filter === k ? '2px solid var(--foreground)' : '2px solid transparent',
                marginBottom: -1,
                padding: '8px 0',
                fontSize: '0.875rem',
                color: filter === k ? 'var(--foreground)' : 'var(--muted)',
                cursor: 'pointer',
                fontWeight: filter === k ? 500 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {tabLabel(k)}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Chargement…</p>
        )}

        {!loading && !items.length && !err && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{emptyLabel(filter)}</p>
        )}

        {!loading && items.length > 0 && (
          <div>
            {items.map((r) => {
              const isPending = r.status === 'pending';
              const name = [r.requester?.firstName, r.requester?.lastName].filter(Boolean).join(' ') || '—';
              const email = r.requester?.email || null;

              return (
                <div
                  key={r.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    padding: '20px 0',
                    display: 'flex',
                    gap: 24,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)' }}>
                        Réservation #{r.id}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: statusColor(r.status) }}>
                        {statusLabel(r.status)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)', marginRight: 4 }}>Jardin :</span>
                      {r.garden?.title ? r.garden.title : `#${r.garden?.id ?? '—'}`}
                      {r.garden?.address && (
                        <span style={{ color: 'var(--muted)' }}> · {r.garden.address}</span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)', marginRight: 4 }}>Créneau :</span>
                      {r.startsAt ? new Date(r.startsAt).toLocaleString() : '—'}{' '}→{' '}
                      {r.endsAt ? new Date(r.endsAt).toLocaleString() : '—'}
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)', marginRight: 4 }}>Demandeur :</span>
                      {name}
                      {email && <span style={{ color: 'var(--muted)' }}> ({email})</span>}
                    </div>

                    {r.notes && (
                      <div style={{ marginTop: 10, padding: '10px 12px', border: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--foreground)', whiteSpace: 'pre-line' }}>
                        {r.notes}
                      </div>
                    )}

                    <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--muted)' }}>
                      Jardin #{r.garden?.id ?? '—'} · Slot #{r.slotId ?? '—'}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      disabled={busyId === r.id || !isPending}
                      onClick={() => act(r.id, confirmBooking)}
                      style={{
                        padding: '7px 16px',
                        background: isPending ? 'var(--green)' : 'var(--border)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.8125rem',
                        cursor: isPending ? 'pointer' : 'not-allowed',
                        opacity: busyId === r.id ? 0.6 : 1,
                        borderRadius: 0,
                      }}
                    >
                      {busyId === r.id ? '…' : 'Confirmer'}
                    </button>

                    <button
                      type="button"
                      disabled={busyId === r.id || !isPending}
                      onClick={() => act(r.id, cancelBooking)}
                      style={{
                        padding: '7px 16px',
                        background: '#fff',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        fontSize: '0.8125rem',
                        cursor: isPending ? 'pointer' : 'not-allowed',
                        opacity: busyId === r.id || !isPending ? 0.5 : 1,
                        borderRadius: 0,
                      }}
                    >
                      Annuler
                    </button>

                    <Link
                      href={`/bookings/${r.id}`}
                      style={{ fontSize: '0.8125rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, marginTop: 4 }}
                    >
                      Voir →
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
