'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getMyBookings } from '@/lib/bookings';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';

function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return '—';
  }
}

function statusStyle(status) {
  if (status === 'confirmed') return { color: 'var(--green)' };
  if (status === 'cancelled') return { color: 'var(--muted)', textDecoration: 'line-through' };
  return { color: 'var(--muted)' };
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>Chargement…</main>}>
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
    <div style={{ background: '#fff', minHeight: '100vh', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: '2rem',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              Mes réservations
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
              Suis tes créneaux, consulte les détails et gère tes statuts.
            </p>
          </div>

          <Link
            href="/bookings/new"
            style={{
              flexShrink: 0,
              background: 'none',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              padding: '0.6rem 1.25rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            + Nouvelle réservation
          </Link>
        </div>

        {justCreated && (
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
            Réservation créée.
          </p>
        )}

        {err && (
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
            {err}
          </p>
        )}

        {!loading && !err && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            {stats.total} total
            {stats.pending > 0 ? ` · ${stats.pending} en attente` : ''}
            {stats.confirmed > 0 ? ` · ${stats.confirmed} confirmée${stats.confirmed > 1 ? 's' : ''}` : ''}
            {stats.completed > 0 ? ` · ${stats.completed} terminée${stats.completed > 1 ? 's' : ''}` : ''}
            {stats.cancelled > 0 ? ` · ${stats.cancelled} annulée${stats.cancelled > 1 ? 's' : ''}` : ''}
          </p>
        )}

        {loading ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Chargement…</p>
        ) : items.length === 0 && !err ? (
          <div style={{ padding: '2.5rem 0' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)' }}>Aucune réservation pour le moment.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.375rem' }}>
              Crée une réservation depuis un jardin, ou via le bouton &quot;Nouvelle réservation&quot;.
            </p>
            <Link
              href="/bookings/new"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                background: 'var(--green)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.25rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              + Nouvelle réservation
            </Link>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((r) => (
              <li
                key={r.id}
                style={{ borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                          color: 'var(--foreground)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.title || `Réservation #${r.id}`}
                      </span>
                      <span style={{ fontSize: '0.8125rem', ...statusStyle(r.status) }}>
                        {r.status === 'pending' && 'En attente'}
                        {r.status === 'confirmed' && 'Confirmée'}
                        {r.status === 'cancelled' && 'Annulée'}
                        {r.status === 'completed' && 'Terminée'}
                        {!['pending', 'confirmed', 'cancelled', 'completed'].includes(r.status) && r.status}
                      </span>
                    </div>

                    <div style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                      Jardin <span style={{ color: 'var(--foreground)' }}>#{r.gardenId}</span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      <span>Du</span>{' '}
                      <span style={{ color: 'var(--foreground)' }}>{fmt(r.startsAt)}</span>{' '}
                      <span>au</span>{' '}
                      <span style={{ color: 'var(--foreground)' }}>{fmt(r.endsAt)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/bookings/${r.id}`}
                    style={{
                      flexShrink: 0,
                      fontSize: '0.875rem',
                      color: 'var(--foreground)',
                      textDecoration: 'none',
                    }}
                  >
                    Détails →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
