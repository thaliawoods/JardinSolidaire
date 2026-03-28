'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };
const BTN_PRIMARY = { padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em' };
const BTN_SECONDARY = { padding: '0.65rem 1.5rem', background: 'none', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em', textDecoration: 'none', display: 'inline-block' };

export default function EditOwnerPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const [meName, setMeName] = useState({ firstName: '', lastName: '' });

  const [form, setForm] = useState({
    district: '',
    availability: '',
    area: '',
    kind: '',
    intro: '',
    description: '',
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me');
        const user = me?.user || me || {};
        const owner = user?.proprietaire || user?.owner || null;
        setMeName({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
        if (owner) {
          setForm({
            district: owner.district || owner.quartier || '',
            availability: owner.availability || owner.disponibilite || '',
            area: owner.area == null ? (owner.surface == null ? '' : String(owner.surface)) : String(owner.area),
            kind: owner.kind || owner.type || '',
            intro: owner.intro || owner.presentation || '',
            description: owner.description || owner.details || '',
          });
        }
      } catch (e) {
        setErr(e?.message || 'server_error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fullName = useMemo(() => {
    const fn = (meName.firstName || '').trim();
    const ln = (meName.lastName || '').trim();
    return [fn, ln].filter(Boolean).join(' ') || '—';
  }, [meName]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const areaInt = form.area === '' || form.area == null ? null : Number.parseInt(form.area, 10);
    const payload = {
      firstName: (meName.firstName || '').trim(),
      lastName: (meName.lastName || '').trim(),
      district: (form.district || '').trim(),
      availability: (form.availability || '').trim(),
      area: Number.isFinite(areaInt) ? areaInt : null,
      kind: (form.kind || '').trim(),
      intro: (form.intro || '').trim(),
      description: (form.description || '').trim(),
      quartier: (form.district || '').trim(),
      disponibilite: (form.availability || '').trim(),
      surface: Number.isFinite(areaInt) ? areaInt : null,
      type: (form.kind || '').trim(),
      presentation: (form.intro || '').trim(),
      details: (form.description || '').trim(),
    };
    if (!payload.firstName || !payload.lastName) {
      alert("Ton compte n'a pas de prénom/nom. Va sur Dashboard > Mon profil.");
      return;
    }
    try {
      setSubmitting(true);
      await apiFetch('/api/me/owner', { method: 'POST', body: payload });
      localStorage.setItem('ownerUpdated', String(Date.now()));
      window.location.href = '/dashboard';
    } catch (e) {
      console.error('Update owner failed:', e);
      const details = e?.details ? `\n${JSON.stringify(e.details, null, 2)}` : '';
      alert(`Impossible d'enregistrer. ${e?.message || ''}${details}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: 56 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 2rem' }}>

        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)', marginBottom: '0.3rem' }}>Profil</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--foreground)', margin: 0 }}>Profil Propriétaire</h1>
          </div>
          <Link href="/dashboard" style={{ ...BTN_SECONDARY, fontSize: '0.8rem' }}>← Dashboard</Link>
        </div>

        {err && (
          <p style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '1.25rem', borderLeft: '2px solid #c0392b', paddingLeft: '0.75rem' }}>Erreur : {err}</p>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 0.2rem' }}>Identité (depuis le compte)</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--foreground)', margin: 0 }}>{fullName}</p>
              </div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)' }}>Propriétaire</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={LABEL}>Quartier</label>
                <input name="district" value={form.district} onChange={onChange} style={INPUT} placeholder="Ex : Belleville" />
              </div>

              <div>
                <label style={LABEL}>Disponibilité</label>
                <input name="availability" value={form.availability} onChange={onChange} style={INPUT} placeholder="Ex : soirs + weekends" />
              </div>

              <div>
                <label style={LABEL}>Surface (m²)</label>
                <input name="area" type="number" min="0" value={form.area} onChange={onChange} style={INPUT} placeholder="Ex : 50" />
              </div>

              <div>
                <label style={LABEL}>Type de jardin</label>
                <input name="kind" value={form.kind} onChange={onChange} style={INPUT} placeholder="cour intérieure, potager…" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={LABEL}>Introduction</label>
                <input name="intro" value={form.intro} onChange={onChange} style={INPUT} placeholder="En 1 phrase : qui tu es / ton jardin…" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={LABEL}>Description</label>
                <textarea name="description" value={form.description} onChange={onChange} rows={5} style={{ ...INPUT, resize: 'vertical' }} placeholder="Accès, outils, attentes, règles…" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="submit" disabled={submitting} style={{ ...BTN_PRIMARY, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <Link href="/dashboard" style={BTN_SECONDARY}>Annuler</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
