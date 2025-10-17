'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';
import { apiFetch, getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const SKILLS_URL =
  process.env.NEXT_PUBLIC_API_SKILLS || `${API_BASE}/api/skills`;
const LEGACY_COMP_URL = `${API_BASE}/competences`;

export default function AddGardener() {
  const session = useSession();
  const router = useRouter();

  const hookToken = session?.token ?? null;
  const token = hookToken || (typeof window !== 'undefined' ? getAnyToken() : null);
  const user  = session?.user ?? null;
  const loading = Boolean(session?.loading);
  const isReady = (!loading && (!!token || !!user));
  const debugSource = useMemo(() => (hookToken ? 'hook' : token ? 'storage/cookie' : 'none'), [hookToken, token]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    intro: '',
    location: '',
    yearsExperience: '',
    skills: [],
    photos: [],
  });

  const [skillsList, setSkillsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');

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
        } catch (e) {
          console.error('Failed to load skills:', e);
          setSkillsList([]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    (async () => {
      try {
        const g = await apiFetch('/api/me/gardener'); 
        if (g) {
          setFormData((p) => ({
            ...p,
            firstName: g.prenom ?? g.firstName ?? p.firstName,
            lastName: g.nom ?? g.lastName ?? p.lastName,
            intro: g.presentation ?? g.intro ?? p.intro,
            location: g.localisation ?? g.location ?? p.location,
            yearsExperience: g.experienceAnnees ?? g.yearsExperience ?? p.yearsExperience,
            skills: Array.isArray(g.competences) ? g.competences : (Array.isArray(g.skills) ? g.skills : p.skills),
          }));
        }
      } catch (_) { /* no profile yet is fine */ }
    })();
  }, [isReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const total = formData.photos.length + files.length;
    if (total > 5) return alert('You can add up to 5 photos maximum.');
    setFormData((p) => ({ ...p, photos: [...p.photos, ...files] }));
    e.target.value = '';
  };
  const removePhoto = (i) => setFormData((p) => ({ ...p, photos: p.photos.filter((_, k) => k !== i) }));

  const normalize = (s) => s.trim().replace(/\s+/g, ' ');
  const alreadyHas = (name) => formData.skills.map((x) => x.toLowerCase()).includes(name.toLowerCase());
  const addSkill = () => {
    const clean = normalize(newSkill);
    if (!clean) return;
    if (alreadyHas(clean)) return setNewSkill('');
    setFormData((p) => ({ ...p, skills: [...p.skills, clean] }));
    setNewSkill('');
  };
  const removeSkill = (name) => setFormData((p) => ({ ...p, skills: p.skills.filter((s) => s !== name) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;

    const selectedNames = formData.skills || [];
    const nameToId = new Map(
      (skillsList || []).map(s => [
        (s.name ?? s.nom ?? '').toLowerCase(),
        s.id ?? s.id_competence
      ])
    );
    const selectedIds = selectedNames
      .map(n => nameToId.get(String(n).toLowerCase()))
      .filter((v) => Number.isFinite(v));

    const exp = formData.yearsExperience;
    const expInt = exp === '' || exp == null ? 0 : Number.parseInt(exp, 10);
    const experience = Number.isFinite(expInt) ? expInt : 0;

    const prenom = (formData.firstName || '').trim();
    const nom = (formData.lastName || '').trim();
    const localisation = (formData.location || '').trim();
    const presentation = (formData.intro || '').trim();

    if (!prenom || !nom || !presentation) {
      alert('First name, last name, and description are required.');
      return;
    }

    const baseFR = { prenom, nom, localisation, presentation, experienceAnnees: experience };
    const aliasFR2 = { prenom, nom, adresse: localisation, description: presentation, anneesExperience: experience };
    const aliasEN  = { firstName: prenom, lastName: nom, location: localisation, intro: presentation, yearsExperience: experience };

    const skillsBlocks = [
      { competencesIds: selectedIds },
      { competenceIds: selectedIds },
      { competence_ids: selectedIds },
      { competences: selectedNames },
      { skills: selectedNames },
      { competencesCsv: selectedNames.join(',') },
    ].filter(b => (('competencesIds' in b || 'competenceIds' in b || 'competence_ids' in b) ? selectedIds.length > 0 : true));

    const variants = [
      { body: { ...baseFR } },
      ...skillsBlocks.map(b => ({ body: { ...baseFR, ...b } })),
      ...skillsBlocks.map(b => ({ body: { ...aliasFR2, ...b } })),
      ...skillsBlocks.map(b => ({ body: { ...aliasEN,  ...b } })),
    ];

    try {
      setSubmitting(true);

      let ok = false;
      let lastStatus = 0;
      let lastText = '';

      for (const v of variants) {
        const cleaned = Object.fromEntries(
          Object.entries(v.body).filter(([_, val]) => (Array.isArray(val) ? true : val !== undefined))
        );

        const res = await apiFetch('/api/me/gardener', { method: 'POST', body: cleaned, raw: true });
        lastStatus = res.status;
        lastText = await res.text().catch(() => '');
        if (res.ok) { ok = true; break; }
        console.error('Variant failed:', lastStatus, lastText);
      }

      if (!ok) {
        alert(`Couldn't save the gardener profile.\nServer said: ${lastStatus} ${lastText || '(no body)'}`);
        return;
      }

      router.push('/profile');
    } catch (err) {
      console.error('Save gardener failed (thrown):', err);
      alert(`Couldn't save the gardener profile. ${err?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Je veux jardiner</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section
          className="rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
        >
          <label className="block w-full text-sm font-medium text-gray-800 mb-2">Photos (max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full h-11 rounded-xl px-3
                       border border-gray-300
                       bg-white text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
          />
          <p className="mt-2 text-xs text-gray-600">{formData.photos.length}/5 éléments sélectionnés</p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.photos.map((file, idx) => (
              <div key={idx} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 inline-flex items-center justify-center
                             rounded-full w-7 h-7 text-sm
                             bg-white/90 text-red-600 border border-red-200
                             hover:bg-red-50 transition"
                  aria-label="Retirer la photo"
                  title="Retirer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
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
                placeholder="Paris"
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="intro"
                value={formData.intro}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
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
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Compétences</label>

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="ex: arrosage, compost, potager…"
                  className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="shrink-0 px-4 py-2 rounded-full bg-white border border-[rgba(22,163,74,0.25)] text-[#16a34a] hover:bg-[rgba(22,163,74,0.06)]"
                >
                  Ajouter
                </button>
              </div>

              {formData.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: '#166534' }}
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="ml-1 rounded-full border border-[rgba(22,163,74,0.5)] w-5 h-5 leading-5 text-center"
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

            {!isReady && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                Connexion en cours… (assure-toi d’être log sur le <b>même port</b>).
              </p>
            )}
            <p className="text-xs text-gray-400">DEBUG token source: {debugSource}</p>

            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting || !isReady}
                className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Enregistrer mes informations'}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
