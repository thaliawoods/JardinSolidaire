'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const SKILLS_URL = process.env.NEXT_PUBLIC_API_SKILLS || `${API_BASE}/api/skills`;
const LEGACY_COMP_URL = `${API_BASE}/competences`;

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };
const BTN_PRIMARY = { padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em' };
const BTN_SECONDARY = { padding: '0.65rem 1.5rem', background: 'none', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em', textDecoration: 'none', display: 'inline-block' };

export default function EditGardenerPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [skillsList, setSkillsList] = useState([]);

  const [meName, setMeName] = useState({ firstName: '', lastName: '' });

  const [formData, setFormData] = useState({
    intro: '',
    location: '',
    yearsExperience: '',
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let r = await fetch(SKILLS_URL, { cache: 'no-store' });
        if (!r.ok) throw new Error();
        let data = await r.json();
        if (Array.isArray(data) && data.length && data[0].name === undefined) {
          data = data.map((c) => ({ id: c.id ?? c.id_competence, name: c.name ?? c.nom }));
        }
        setSkillsList(Array.isArray(data) ? data : []);
      } catch {
        try {
          const r = await fetch(LEGACY_COMP_URL, { cache: 'no-store' });
          const data = await r.json();
          setSkillsList(
            (Array.isArray(data) ? data : []).map((c) => ({ id: c.id ?? c.id_competence, name: c.name ?? c.nom }))
          );
        } catch {
          setSkillsList([]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me');
        const user = me?.user || me || {};
        const g = user?.jardinier || user?.gardener || null;
        setMeName({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
        if (g) {
          setFormData({
            intro: g.intro || g.description || g.bio || '',
            location: g.location || g.address || g.adresse || '',
            yearsExperience:
              g.yearsExperience == null
                ? (g.years_experience == null ? '' : String(g.years_experience))
                : String(g.yearsExperience),
            skills: Array.isArray(g.skills) ? g.skills : Array.isArray(g.competences) ? g.competences : [],
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

  const normalize = (s) => s.trim().replace(/\s+/g, ' ');
  const alreadyHas = useMemo(
    () => (name) => (formData.skills || []).map((x) => String(x).toLowerCase()).includes(String(name).toLowerCase()),
    [formData.skills]
  );

  const addSkill = () => {
    const clean = normalize(newSkill);
    if (!clean) return;
    if (alreadyHas(clean)) { setNewSkill(''); return; }
    setFormData((p) => ({ ...p, skills: [...(p.skills || []), clean] }));
    setNewSkill('');
  };

  const removeSkill = (name) =>
    setFormData((p) => ({ ...p, skills: (p.skills || []).filter((s) => s !== name) }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const years =
      formData.yearsExperience === '' || formData.yearsExperience == null
        ? null
        : Number.parseInt(formData.yearsExperience, 10);
    const firstName = (meName.firstName || '').trim();
    const lastName = (meName.lastName || '').trim();
    const location = (formData.location || '').trim();
    const intro = (formData.intro || '').trim();
    const skills = Array.isArray(formData.skills) ? formData.skills : [];

    if (!firstName || !lastName) {
      alert("Ton compte n'a pas de prénom/nom. Va sur Dashboard > Mon profil.");
      return;
    }
    if (!intro) {
      alert('La description est obligatoire.');
      return;
    }

    const payload = {
      firstName, lastName, location, intro,
      yearsExperience: Number.isFinite(years) ? years : null, skills,
      address: location, adresse: location,
      description: intro, bio: intro,
      years_experience: Number.isFinite(years) ? years : null,
      experience: Number.isFinite(years) ? years : null,
      competences: skills, skillIds: [], skills_ids: [],
    };

    try {
      setSubmitting(true);
      await apiFetch('/api/me/gardener', { method: 'POST', body: payload });
      localStorage.setItem('gardenerUpdated', String(Date.now()));
      window.location.href = '/dashboard';
    } catch (e) {
      console.error('Update gardener failed:', e);
      const details = e?.details ? `\n${JSON.stringify(e.details, null, 2)}` : '';
      alert(`Impossible d'enregistrer. ${e?.message || ''}${details}`);
      setErr(e?.message || 'validation_error');
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--foreground)', margin: 0 }}>Profil Jardinier·e</h1>
          </div>
          <Link href="/dashboard" style={{ ...BTN_SECONDARY, fontSize: '0.8rem' }}>← Dashboard</Link>
        </div>

        {err && (
          <p style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '1.25rem', borderLeft: '2px solid #c0392b', paddingLeft: '0.75rem' }}>{err}</p>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 0.2rem' }}>Identité (depuis le compte)</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--foreground)', margin: 0 }}>{fullName}</p>
              </div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)' }}>Jardinier·e</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={LABEL}>Adresse (optionnel)</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} style={INPUT} placeholder="Paris" />
              </div>

              <div>
                <label style={LABEL}>Description (obligatoire)</label>
                <textarea
                  name="intro" value={formData.intro} onChange={handleChange} rows={5}
                  style={{ ...INPUT, resize: 'vertical' }}
                  placeholder="Parle de toi, de tes services, disponibilités…"
                  required
                />
              </div>

              <div>
                <label style={LABEL}>{"Années d'expérience (optionnel)"}</label>
                <input type="number" name="yearsExperience" min="0" value={formData.yearsExperience} onChange={handleChange} style={{ ...INPUT, maxWidth: 160 }} placeholder="Ex. 3" />
              </div>

              <div>
                <label style={LABEL}>Compétences</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    placeholder="arrosage, compost, potager…"
                    style={{ ...INPUT, flex: 1 }}
                  />
                  <button type="button" onClick={addSkill} style={BTN_SECONDARY}>Ajouter</button>
                </div>

                {(formData.skills || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {formData.skills.map((s) => (
                      <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', border: '1px solid var(--border)', padding: '2px 8px', color: 'var(--foreground)' }}>
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--muted)', lineHeight: 1 }} aria-label={`retirer ${s}`}>×</button>
                      </span>
                    ))}
                  </div>
                )}

                {skillsList.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                    {skillsList.map((comp) => {
                      const name = comp.name ?? comp.nom ?? '';
                      const checked = (formData.skills || []).some((s) => String(s).toLowerCase() === String(name).toLowerCase());
                      return (
                        <label key={comp.id ?? name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--foreground)', cursor: 'pointer' }}>
                          <input
                            type="checkbox" checked={checked}
                            onChange={() => checked ? removeSkill(name) : setFormData((p) => ({ ...p, skills: [...(p.skills || []), name] }))}
                          />
                          <span>{name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
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
