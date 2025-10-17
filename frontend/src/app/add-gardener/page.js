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
  const session = useSession(); // may be undefined in your project; it's ok
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

  // Prefill existing gardener
  useEffect(() => {
    if (!isReady) return;
    (async () => {
      try {
        const g = await apiFetch('/api/me/gardener'); // auth handled in apiFetch
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

  // map skill names -> ids (if skillsList provided ids)
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

  // experience -> int (avoid null to bypass strict NOT NULL)
  const exp = formData.yearsExperience;
  const expInt = exp === '' || exp == null ? 0 : Number.parseInt(exp, 10);
  const experience = Number.isFinite(expInt) ? expInt : 0;

  // Strings trimmed; avoid undefined/null in payload
  const prenom = (formData.firstName || '').trim();
  const nom = (formData.lastName || '').trim();
  const localisation = (formData.location || '').trim();
  const presentation = (formData.intro || '').trim();

  if (!prenom || !nom || !presentation) {
    alert('First name, last name, and description are required.');
    return;
  }

  // Build multiple alias payloads the backend might accept
  const baseFR = {
    prenom,
    nom,
    localisation,           // alias A
    presentation,           // alias A
    experienceAnnees: experience, // alias A
  };

  const aliasFR2 = {
    prenom,
    nom,
    adresse: localisation,  // alias B
    description: presentation, // alias B
    anneesExperience: experience, // alias B
  };

  const aliasEN = {
    firstName: prenom,
    lastName: nom,
    location: localisation,
    intro: presentation,
    yearsExperience: experience,
  };

  const skillsBlocks = [
    { competencesIds: selectedIds },                  // preferred: ids array
    { competenceIds: selectedIds },                   // alt key
    { competence_ids: selectedIds },                  // snake
    { competences: selectedNames },                   // names array
    { skills: selectedNames },                        // names array EN
    { competencesCsv: selectedNames.join(',') },      // CSV fallback
  ].filter(b =>
    // keep ids blocks only if we actually have ids
    ('competencesIds' in b || 'competenceIds' in b || 'competence_ids' in b)
      ? selectedIds.length > 0
      : true
  );

  // Try combinations: base only, then base+skills (with FR base), then alias bases + skills, then EN base + skills
  const variants = [
    { body: { ...baseFR } },
    ...skillsBlocks.map(b => ({ body: { ...baseFR, ...b } })),
    ...skillsBlocks.map(b => ({ body: { ...aliasFR2, ...b } })),
    ...skillsBlocks.map(b => ({ body: { ...aliasEN, ...b } })),
  ];

  try {
    setSubmitting(true);

    let ok = false;
    let lastStatus = 0;
    let lastText = '';

    for (const v of variants) {
      // strip empty strings/undefined to avoid server-side validators choking
      const cleaned = Object.fromEntries(
        Object.entries(v.body).filter(([_, val]) =>
          Array.isArray(val) ? true : val !== undefined
        )
      );

      console.log('POST /api/me/gardener →', cleaned);
      const res = await apiFetch('/api/me/gardener', {
        method: 'POST',
        body: cleaned,
        raw: true,
      });

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
        {/* photos */}
        <div className="flex flex-col items-center">
          <label className="block w-full text-sm font-medium text-gray-700 mb-2">Photos (max 5)</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-400" />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {formData.photos.map((file, idx) => (
              <div key={idx} className="relative group">
                <img src={URL.createObjectURL(file)} alt={`Photo ${idx + 1}`} className="w-full h-40 object-cover rounded-lg shadow" />
                <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70 transition">✖</button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 self-start">{formData.photos.length}/5 éléments sélectionnés</p>
        </div>

        {/* fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-700" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-700" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-700" placeholder="Paris" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="intro" value={formData.intro} onChange={handleChange} rows={3} className="mt-1 w-full border rounded px-3 py-2 text-gray-700" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre d’années d’expérience</label>
            <input type="number" name="yearsExperience" min="0" value={formData.yearsExperience} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-700" />
          </div>

          {/* compétences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Compétences</label>
            <div className="mt-2 flex gap-2">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="ex: arrosage, compost, potager…" className="w-full border rounded px-3 py-2 text-gray-700" />
              <button type="button" onClick={addSkill} className="shrink-0 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Ajouter</button>
            </div>

            {formData.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="ml-1 rounded-full border border-green-800 w-5 h-5 leading-5 text-center" aria-label={`retirer ${s}`} title={`retirer ${s}`}>×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4">
              {skillsList.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {skillsList.map((comp) => {
                    const name = comp.name ?? comp.nom ?? '';
                    const checked = formData.skills.some((s) => s.toLowerCase() === name.toLowerCase());
                    return (
                      <label key={comp.id ?? name} className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={() => checked ? removeSkill(name) : setFormData((p) => ({ ...p, skills: [...p.skills, name] }))} />
                        <span>{name}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500" />
              )}
            </div>
          </div>

          {!isReady && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              Connexion en cours… (assure-toi d’être log sur le <b>même port</b>).
            </p>
          )}
          <p className="text-xs text-gray-400">DEBUG token source: {debugSource}</p>

          <button type="submit" disabled={submitting || !isReady} className="bg-[#E3107D] hover:bg-[#c30c6a] disabled:opacity-60 text-white px-6 py-2 rounded-full mt-2">
            {submitting ? 'Saving…' : 'Enregistrer mes informations'}
          </button>
        </div>
      </form>
    </div>
  );
}
