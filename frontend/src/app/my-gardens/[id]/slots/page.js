'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };

function pad2(n) { return String(n).padStart(2, '0'); }

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export default function SlotsPage() {
  const { id } = useParams();
  const router = useRouter();

  const gardenId = useMemo(() => Number(id), [id]);

  const [dateISO, setDateISO] = useState(() => todayISO());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  async function handleCreateSlot(e) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!gardenId || !dateISO || !startTime || !endTime) {
      setErr('Merci de remplir au moins : date, début et fin.');
      return;
    }

    try {
      setBusy(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/availability/gardens/${gardenId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: dateISO, startTime, endTime, status: 'free' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'create_failed');
      setMsg('Créneau libre ajouté.');
    } catch (e2) {
      setErr(e2?.message || 'Erreur lors de la création.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', margin: '0 0 0.75rem' }}>
              Propriétaire
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
              Mes créneaux
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0.5rem 0 0' }}>
              Ajoute des créneaux libres pour ce jardin.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/my-gardens" style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>
              ← Mes jardins
            </Link>
            <Link href={`/garden/${gardenId}`} style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>
              Voir la fiche →
            </Link>
          </div>
        </div>

        {err && (
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626', margin: '1.5rem 0' }}>
            {err}
          </div>
        )}
        {msg && !err && (
          <div style={{ borderLeft: '2px solid var(--green)', paddingLeft: '0.75rem', fontSize: '0.875rem', color: 'var(--green)', margin: '1.5rem 0' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleCreateSlot} style={{ border: '1px solid var(--border)', padding: '1.5rem', marginTop: '2rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>
            Nouveau créneau libre
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Clique un jour dans le calendrier ci-dessous : la date se remplit automatiquement.
          </p>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={LABEL}>Date <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} style={INPUT} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={LABEL}>Début <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStartTime(v);
                    const h = parseInt(v.slice(0, 2), 10);
                    const mm = v.slice(3, 5);
                    const eh = String(Math.min(23, h + 1)).padStart(2, '0');
                    setEndTime(`${eh}:${mm}`);
                  }}
                  style={INPUT}
                />
              </div>
              <div>
                <label style={LABEL}>Fin <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={INPUT} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={busy}
              style={{ padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', opacity: busy ? 0.6 : 1 }}
            >
              {busy ? 'Création…' : 'Créer un créneau libre'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{ padding: '0.65rem 1.5rem', background: '#fff', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}
            >
              Retour
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Fin auto à +1h quand tu changes le début.</span>
          </div>
        </form>

        <div style={{ border: '1px solid var(--border)', padding: '1.5rem', marginTop: '1.5rem' }}>
          <AvailabilityCalendar
            mode="garden"
            intent="form"
            gardenId={gardenId}
            title="Calendrier"
            onDateSelect={(iso) => setDateISO(iso)}
          />
        </div>

      </div>
    </div>
  );
}
