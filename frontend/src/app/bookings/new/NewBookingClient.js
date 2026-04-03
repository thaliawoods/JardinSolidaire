'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBooking, canBook } from '@/lib/bookings';

const INPUT = {
  display: 'block',
  width: '100%',
  border: '1px solid var(--border)',
  padding: '0.6rem 0.75rem',
  background: '#fff',
  color: 'var(--foreground)',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  borderRadius: 0,
};

const TEXTAREA = { ...INPUT, resize: 'vertical' };

const LABEL = {
  display: 'block',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--muted)',
  marginBottom: '0.4rem',
};

const HINT = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--muted)',
};

const BTN_PRIMARY = {
  display: 'inline-block',
  padding: '0.65rem 1.5rem',
  background: 'var(--green)',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  letterSpacing: '0.01em',
  borderRadius: 0,
};

const BTN_SECONDARY = {
  display: 'inline-block',
  padding: '0.65rem 1.5rem',
  background: '#fff',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  letterSpacing: '0.01em',
  borderRadius: 0,
};

function Field({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
        <span style={LABEL}>{label}</span>
        {hint && <span style={HINT}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem' }}><p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p></div>}>
      <NewBookingInner />
    </Suspense>
  );
}

function NewBookingInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const prefilledGardenId = useMemo(() => sp.get('gardenId') || '', [sp]);

  const [gardenId, setGardenId] = useState(prefilledGardenId);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const [checking, setChecking] = useState(false);
  const [can, setCan] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (prefilledGardenId && prefilledGardenId !== gardenId) {
      setGardenId(prefilledGardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledGardenId]);

  async function runCheck(s = startsAt, e = endsAt, g = gardenId) {
    setCan(null);
    if (!g || !s || !e) return;

    try {
      setChecking(true);
      const r = await canBook({ gardenId: g, startsAt: s, endsAt: e });
      setCan(r);
    } catch (e2) {
      setCan({ ok: false, reasons: [e2?.message || 'Erreur de vérification'] });
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!gardenId || !startsAt || !endsAt) {
      setErr('Merci de remplir au moins : jardin, début et fin.');
      return;
    }

    if (new Date(endsAt) <= new Date(startsAt)) {
      setErr('La date de fin doit être après la date de début.');
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        gardenId,
        title,
        notes,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      });
      router.push('/bookings?created=1');
    } catch (e2) {
      setErr(e2?.message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', margin: 0 }}>
            Réservation
          </p>
          <Link
            href="/bookings"
            style={{ fontSize: '0.8125rem', color: 'var(--muted)', textDecoration: 'none' }}
          >
            ← Mes réservations
          </Link>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: '0 0 0.5rem' }}>
          Nouvelle réservation
        </h1>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>
          Choisis un jardin et un créneau. On vérifie si c'est réservable.
        </p>

        {err && (
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626', marginBottom: '1.5rem' }}>
            {err}
          </div>
        )}
        {msg && !err && (
          <div style={{ borderLeft: '2px solid var(--green)', paddingLeft: '0.75rem', fontSize: '0.875rem', color: 'var(--green)', marginBottom: '1.5rem' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <Field label="Jardin (ID)" hint="obligatoire">
            <input
              value={gardenId}
              onChange={(e) => {
                setGardenId(e.target.value);
                runCheck(startsAt, endsAt, e.target.value);
              }}
              style={INPUT}
              placeholder="ex: 42"
            />
          </Field>

          <Field label="Titre" hint="optionnel">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={INPUT}
              placeholder="ex: tonte + taille"
            />
          </Field>

          <Field label="Notes" hint="optionnel">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              style={TEXTAREA}
              placeholder="Ce que tu comptes faire, matériel, infos utiles…"
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Début" hint="obligatoire">
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => {
                  setStartsAt(e.target.value);
                  runCheck(e.target.value, endsAt, gardenId);
                }}
                style={INPUT}
              />
            </Field>

            <Field label="Fin" hint="obligatoire">
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => {
                  setEndsAt(e.target.value);
                  runCheck(startsAt, e.target.value, gardenId);
                }}
                style={INPUT}
              />
            </Field>
          </div>

          {checking && (
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
              Vérification du créneau…
            </p>
          )}

          {can && (
            can.ok ? (
              <div style={{ borderLeft: '2px solid var(--green)', paddingLeft: '0.75rem', fontSize: '0.875rem', color: 'var(--green)' }}>
                Créneau disponible
              </div>
            ) : (
              <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626' }}>
                Créneau indisponible
                {can.reasons?.length > 0 && (
                  <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                    {can.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting || can?.ok === false}
              style={{ ...BTN_PRIMARY, opacity: submitting || can?.ok === false ? 0.5 : 1 }}
            >
              {submitting ? 'Création…' : 'Créer la réservation'}
            </button>

            <button
              type="button"
              style={BTN_SECONDARY}
              onClick={() => router.back()}
            >
              Annuler
            </button>

            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              Si le créneau est indisponible, le bouton est désactivé.
            </span>
          </div>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2.5rem', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', margin: '0 0 0.25rem' }}>
            Conseil
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0, lineHeight: 1.5 }}>
            Pense à ajouter un titre clair (ex: "désherbage + arrosage") et une note
            courte pour faciliter la validation.
          </p>
        </div>

      </div>
    </div>
  );
}
