'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getBooking, updateBooking } from '@/lib/bookings';

function fmt(dt) {
  try { return new Date(dt).toLocaleString('fr-FR'); } catch { return '—'; }
}

function statusLabel(s) {
  if (s === 'pending') return 'En attente';
  if (s === 'confirmed') return 'Confirmée';
  if (s === 'cancelled') return 'Annulée';
  if (s === 'completed') return 'Terminée';
  return s || '—';
}

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await getBooking(id);
        if (alive) setData(r);
      } catch {
        if (alive) setErr('Réservation introuvable.');
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const status = String(data?.status || '').toLowerCase();

  const actions = useMemo(() => {
    if (!data) return [];
    if (status === 'pending') return [
      { key: 'confirm', label: 'Confirmer', patch: { status: 'confirmed' } },
      { key: 'cancel', label: 'Annuler', patch: { status: 'cancelled' }, danger: true },
    ];
    if (status === 'confirmed') return [
      { key: 'complete', label: 'Marquer terminé', patch: { status: 'completed' } },
      { key: 'cancel', label: 'Annuler', patch: { status: 'cancelled' }, danger: true },
    ];
    return [];
  }, [data, status]);

  const statusHint = useMemo(() => {
    if (status === 'pending') return 'En attente de validation. Tu peux confirmer ou annuler.';
    if (status === 'confirmed') return 'Réservation confirmée. Tu peux la marquer comme terminée ou annuler.';
    if (status === 'completed') return 'Réservation terminée.';
    if (status === 'cancelled') return 'Réservation annulée.';
    return '';
  }, [status]);

  async function doAction(patch) {
    try { setBusy(true); setErr(''); const u = await updateBooking(id, patch); setData(u); }
    catch (e) { setErr(e?.message || 'Erreur.'); }
    finally { setBusy(false); }
  }

  const title = data ? (data.title || `Réservation #${data.id}`) : '';

  if (!data && !err) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
      </div>
    );
  }

  if (err && !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{err}</p>
          <Link href="/bookings" style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            ← Mes réservations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)' }}>
      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>
              {title}
            </h1>
            <p style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
              Jardin #{data.gardenId} · {fmt(data.startsAt)} → {fmt(data.endsAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ flexShrink: 0, fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Retour
          </button>
        </div>

        {/* Status */}
        <section style={{ border: '1px solid var(--border)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>Statut</p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)', margin: 0 }}>{statusLabel(status)}</p>
              {!!statusHint && (
                <p style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted)', margin: '0.375rem 0 0' }}>{statusHint}</p>
              )}
            </div>
            <Link href="/bookings" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px', flexShrink: 0 }}>
              Mes réservations →
            </Link>
          </div>
        </section>

        {/* Details */}
        <section style={{ border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.8125rem' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>Jardin</span>
            {' '}#{data.gardenId}
          </div>
          <div style={{ fontSize: '0.8125rem' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>Créneau</span>
            {' '}{fmt(data.startsAt)} → {fmt(data.endsAt)}
          </div>
          {data.notes ? (
            <div style={{ fontSize: '0.8125rem' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>Notes</span>
              <p style={{ margin: '0.375rem 0 0', color: 'var(--foreground)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{data.notes}</p>
            </div>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: 0 }}>Aucune note ajoutée.</p>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.75rem' }}>Actions</p>
              {err && <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>{err}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {actions.map((a) => (
                  <button
                    key={a.key}
                    disabled={busy}
                    onClick={() => doAction(a.patch)}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--foreground)',
                      background: 'none',
                      border: '1px solid var(--border)',
                      padding: '0.5rem 1rem',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    {busy ? '…' : a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
