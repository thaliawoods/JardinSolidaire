'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const SKILLS_URL =
  process.env.NEXT_PUBLIC_API_SKILLS || `${API_BASE}/api/skills`;
const LEGACY_COMP_URL = `${API_BASE}/competences`;

export default function EditGardenerPage() {
  const router = useRouter();

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
    skills: [], // string[]
  });
  const [newSkill, setNewSkill] = useState('');

  /* ---------- load selectable skills (optional suggestions) ---------- */
  useEffect(() => {
    (async () => {
      try {
        let r = await fetch(SKILLS_URL, { cache: 'no-store' });
        if (!r.ok) throw 0;
        let data = await r.json();
        if (Array.isArray(data) && data.length && data[0].name === undefined) {
          data = data.map((c) => ({ id: c.id ?? c.id_competence, name: c.name ?? c.nom }));
        }
        setSkillsList(data || []);
      } catch {
        try {
          const r = await fetch(LEGACY_COMP_URL, { cache: 'no-store' });
          const data = await r.json();
          setSkillsList((data || []).map((c) => ({ id: c.id ?? c.id_competence, name: c.name ?? c.nom })));
        } catch {
          setSkillsList([]);
        }
      }
    })();
  }, []);

  /* ---------------------- prefill from /api/me ----------------------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me'); // { user: {..., gardener: {...}} }
        const g = me?.user?.gardener;
        if (!g) {
          // no gardener yet → go to creation page (or keep here as blank)
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

  /* ----------------------------- helpers ----------------------------- */
  const normalize = (s) => s.trim().replace(/\s+/g, ' ');
  const alreadyHas = useMemo(
    () => (name) => formData.skills.map((x) => x.toLowerCase()).includes(name.toLowerCase()),
    [formData.skills]
  );

  const addSkill = () => {
    const clean = normalize(newSkill);
    if (!clean) return;
    if (alreadyHas(clean)) { setNewSkill(''); return; }
    setFormData((p) => ({ ...p, skills: [...p.skills, clean] }));
    setNewSkill('');
  };
  const removeSkill = (name) =>
    setFormData((p) => ({ ...p, skills: p.skills.filter((s) => s !== name) }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ------------------------------ save ------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const years =
      formData.yearsExperience === '' || formData.yearsExperience == null
        ? null
        : Number.parseInt(formData.yearsExperience, 10);

    const payload = {
      firstName: (formData.firstName || '').trim(),
      lastName:  (formData.lastName || '').trim(),
      location:  (formData.location || '').trim(),
      intro:     (formData.intro || '').trim(),
      yearsExperience: Number.isFinite(years) ? years : null,
      skills: Array.isArray(formData.skills) ? formData.skills : [],
    };

    if (!payload.firstName || !payload.lastName || !payload.intro) {
      alert('First name, last name, and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch('/api/me/gardener', {
        method: 'POST',
        body: payload,
      });
      router.push('/profile');
    } catch (e) {
      console.error('Update gardener failed:', e);
      alert(`Couldn't save your changes. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------- render ------------------------------ */
  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Modifier mon profil jardinier</h1>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Error: {err}
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
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
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="Paris"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre d’années d’expérience</label>
            <input
              type="number"
              name="yearsExperience"
              min="0"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          {/* Compétences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Compétences</label>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="ex: arrosage, compost, potager…"
                className="w-full border rounded px-3 py-2 text-gray-700"
              />
              <button
                type="button"
                onClick={addSkill}
                className="shrink-0 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
              >
                Ajouter
              </button>
            </div>

            {formData.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="ml-1 rounded-full border border-green-800 w-5 h-5 leading-5 text-center"
                      aria-label={`retirer ${s}`}
                      title={`retirer ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* optional suggestions list */}
            {skillsList.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {skillsList.map((comp) => {
                  const name = comp.name ?? comp.nom ?? '';
                  const checked = formData.skills.some(
                    (s) => s.toLowerCase() === name.toLowerCase()
                  );
                  return (
                    <label key={comp.id ?? name} className="flex items-center gap-2">
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-2 rounded-full"
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
            <Link
              href="/profile"
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

/* --------------------------- tiny skeleton --------------------------- */
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
