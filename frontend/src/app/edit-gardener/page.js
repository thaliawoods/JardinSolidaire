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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
        setSkillsList(data || []);
      } catch {
        try {
          const r = await fetch(LEGACY_COMP_URL, { cache: 'no-store' });
          const data = await r.json();
          setSkillsList(
            (data || []).map((c) => ({ id: c.id ?? c.id_competence, name: c.name ?? c.nom }))
          );
        } catch {
          setSkillsList([]);
        }
      }
    })();
  }, []);

  // Prefill with existing gardener
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me');
        const g = me?.user?.jardinier || me?.user?.gardener;
        if (!g) {
          setLoading(false);
          return;
        }
        setFormData({
          firstName: g.firstName || '',
          lastName: g.lastName || '',
          intro: g.intro || '',
          location: g.location || '',
          yearsExperience:
            g.yearsExperience === null || g.yearsExperience === undefined
              ? ''
              : String(g.yearsExperience),
          skills: Array.isArray(g.skills) ? g.skills : [],
        });
      } catch (e) {
        setErr(e?.message || 'server_error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalize = (s) => s.trim().replace(/\s+/g, ' ');
  const alreadyHas = useMemo(
    () => (name) => formData.skills.map((x) => x.toLowerCase()).includes(name.toLowerCase()),
    [formData.skills]
  );

  const addSkill = () => {
    const clean = normalize(newSkill);
    if (!clean) return;
    if (alreadyHas(clean)) {
      setNewSkill('');
      return;
    }
    setFormData((p) => ({ ...p, skills: [...p.skills, clean] }));
    setNewSkill('');
  };

  const removeSkill = (name) =>
    setFormData((p) => ({ ...p, skills: p.skills.filter((s) => s !== name) }));

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

    const payload = {
      firstName: (formData.firstName || '').trim(),
      lastName: (formData.lastName || '').trim(),
      location: (formData.location || '').trim(),
      intro: (formData.intro || '').trim(),
      yearsExperience: Number.isFinite(years) ? years : null,
      skills: Array.isArray(formData.skills) ? formData.skills : [],
    };

    if (!payload.firstName || !payload.lastName || !payload.intro) {
      alert('First name, last name, and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch('/api/me/gardener', { method: 'POST', body: payload });

      // 🔴 Signal dashboard to refresh and go back there
      localStorage.setItem('gardenerUpdated', String(Date.now()));
      window.location.href = '/dashboard';
    } catch (e) {
      console.error('Update gardener failed:', e);
      alert(`Couldn't save your changes. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Modifier mon profil jardinier
      </h1>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Error: {err}
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-5">
          <section
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Jane"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="Paris"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="intro"
                value={formData.intro}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="Parlez de vous, de vos services, disponibilités…"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Nombre d’années d’expérience
              </label>
              <input
                type="number"
                name="yearsExperience"
                min="0"
                value={formData.yearsExperience}
                onChange={handleChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="Ex. 3"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Compétences</label>
              <div className="mt-2 flex gap-2">
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
                  className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="shrink-0 px-4 py-2 rounded-full bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition"
                >
                  Ajouter
                </button>
              </div>

              {formData.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: '#16a34a' }}
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="ml-1 rounded-full w-5 h-5 leading-5 text-center border"
                        style={{ borderColor: 'rgba(22,163,74,0.35)', color: '#16a34a' }}
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
                    const checked = formData.skills.some(
                      (s) => s.toLowerCase() === name.toLowerCase()
                    );
                    return (
                      <label key={comp.id ?? name} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            checked
                              ? removeSkill(name)
                              : setFormData((p) => ({ ...p, skills: [...p.skills, name] }))
                          }
                        />
                        <span>{name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-full bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition"
            >
              Annuler
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-5 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-24 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-24 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
    </div>
  );
}
