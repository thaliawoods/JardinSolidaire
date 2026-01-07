'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const SKILLS_URL = process.env.NEXT_PUBLIC_API_SKILLS || `${API_BASE}/api/skills`;
const LEGACY_COMP_URL = `${API_BASE}/competences`;

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

  // Load skills (API then legacy)
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

  // Prefill with existing gardener + identity from user
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const me = await apiFetch('/api/me');
        const user = me?.user || me || {};
        const g = user?.jardinier || user?.gardener || null;

        setMeName({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
        });

        if (g) {
          setFormData({
            intro: g.intro || g.description || g.bio || '',
            location: g.location || g.address || g.adresse || '',
            yearsExperience:
              g.yearsExperience == null
                ? (g.years_experience == null ? '' : String(g.years_experience))
                : String(g.yearsExperience),
            skills: Array.isArray(g.skills)
              ? g.skills
              : Array.isArray(g.competences)
              ? g.competences
              : [],
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
    if (alreadyHas(clean)) {
      setNewSkill('');
      return;
    }
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

    // ✅ payload compat (UI + alias backend possibles)
    const payload = {
      // identity from user
      firstName,
      lastName,

      // UI fields
      location,
      intro,
      yearsExperience: Number.isFinite(years) ? years : null,
      skills,

      // aliases backend possibles
      address: location,
      adresse: location,

      description: intro,
      bio: intro,

      years_experience: Number.isFinite(years) ? years : null,
      experience: Number.isFinite(years) ? years : null,

      competences: skills,
      skillIds: [],
      skills_ids: [],
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
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Profil Jardinier.e
            </h1>
            <p className="text-gray-600 mt-1">
              Mets à jour ton profil jardinier.e (sans ressaisir ton identité).
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identity card */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Identité (depuis le compte)</div>
                  <div className="text-gray-900 font-semibold">{fullName}</div>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-800 ring-1 ring-green-200">
                  Jardinier.e
                </span>
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Adresse (optionnel)">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Paris"
                  />
                </Field>

                <Field label="Description (obligatoire)">
                  <textarea
                    name="intro"
                    value={formData.intro}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Parle de toi, de tes services, disponibilités…"
                    required
                  />
                </Field>

                <Field label="Années d’expérience (optionnel)">
                  <input
                    type="number"
                    name="yearsExperience"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Ex. 3"
                  />
                </Field>

                <Field label="Compétences">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="ex: arrosage, compost, potager…"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="shrink-0 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
                    >
                      Ajouter
                    </button>
                  </div>

                  {(formData.skills || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-50 text-green-800 ring-1 ring-green-200"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => removeSkill(s)}
                            className="ml-1 rounded-full w-5 h-5 leading-5 text-center border border-green-200 text-green-800 hover:bg-green-100"
                            aria-label={`retirer ${s}`}
                            title={`retirer ${s}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {skillsList.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {skillsList.map((comp) => {
                        const name = comp.name ?? comp.nom ?? '';
                        const checked = (formData.skills || []).some(
                          (s) => String(s).toLowerCase() === String(name).toLowerCase()
                        );
                        return (
                          <label key={comp.id ?? name} className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                checked
                                  ? removeSkill(name)
                                  : setFormData((p) => ({ ...p, skills: [...(p.skills || []), name] }))
                              }
                            />
                            <span>{name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </Field>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60"
                >
                  {submitting ? 'Enregistrement…' : 'Enregistrer'}
                </button>

                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                >
                  Annuler
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-100 rounded-2xl" />
      <div className="h-80 bg-gray-100 rounded-2xl" />
    </div>
  );
}
