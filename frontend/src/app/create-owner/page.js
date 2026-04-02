'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };

export default function CreateOwnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
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
        const o = me?.user?.proprietaire || me?.user?.owner;
        if (o) {
          setForm({
            firstName: o.firstName || '',
            lastName: o.lastName || '',
            district: o.district || '',
            availability: o.availability || '',
            area: o.area == null ? '' : String(o.area),
            kind: o.kind || '',
            intro: o.intro || '',
            description: o.description || '',
          });
        }
      } catch (e) {
        setErr(e?.error || e?.message || '');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      alert('Prénom et nom sont requis.');
      return;
    }
    const areaInt = form.area === '' || form.area == null ? null : Number.parseInt(form.area, 10);
    try {
      setSubmitting(true);
      await apiFetch('/api/me/owner', {
        method: 'POST',
        body: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          district: form.district.trim(),
          availability: form.availability.trim(),
          area: Number.isFinite(areaInt) ? areaInt : null,
          kind: form.kind.trim(),
          intro: form.intro.trim(),
          description: form.description.trim(),
        },
      });
      router.push('/profile');
    } catch (e) {
      console.error('Create/Update owner failed:', e);
      alert(`Impossible d'enregistrer le profil propriétaire. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '48px 24px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', maxWidth: 720, margin: '0 auto' }}>Chargement…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', margin: '0 0 0.75rem' }}>
            Propriétaire
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
            Profil propriétaire
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0.5rem 0 0' }}>
            Ces informations apparaissent sur ton profil public.
          </p>
        </div>

        {err && (
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626', margin: '1.5rem 0' }}>
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem', border: '1px solid var(--border)', padding: '1.5rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={LABEL}>Prénom <span style={{ color: '#dc2626' }}>*</span></label>
              <input name="firstName" value={form.firstName} onChange={onChange} required style={INPUT} placeholder="Jane" />
            </div>
            <div>
              <label style={LABEL}>Nom de famille <span style={{ color: '#dc2626' }}>*</span></label>
              <input name="lastName" value={form.lastName} onChange={onChange} required style={INPUT} placeholder="Doe" />
            </div>
          </div>

          <div>
            <label style={LABEL}>Quartier</label>
            <input name="district" value={form.district} onChange={onChange} style={INPUT} placeholder="Ex. Belleville" />
          </div>

          <div>
            <label style={LABEL}>Disponibilité</label>
            <input name="availability" value={form.availability} onChange={onChange} style={INPUT} placeholder="Ex. soirées et week-ends" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={LABEL}>Surface (m²)</label>
              <input name="area" type="number" min="0" value={form.area} onChange={onChange} style={INPUT} placeholder="Ex. 50" />
            </div>
            <div>
              <label style={LABEL}>Type de jardin</label>
              <input name="kind" value={form.kind} onChange={onChange} style={INPUT} placeholder="cour intérieure, potager…" />
            </div>
          </div>

          <div>
            <label style={LABEL}>Introduction</label>
            <input name="intro" value={form.intro} onChange={onChange} style={INPUT} placeholder="Une courte présentation…" />
          </div>

          <div>
            <label style={LABEL}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
              placeholder="Accès, matériel, contraintes, attentes envers les jardinier·es…"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer le profil propriétaire'}
            </button>
            <Link href="/profile" style={{ padding: '0.65rem 1.5rem', background: '#fff', color: 'var(--foreground)', border: '1px solid var(--border)', fontSize: '0.875rem', textDecoration: 'none' }}>
              Annuler
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
