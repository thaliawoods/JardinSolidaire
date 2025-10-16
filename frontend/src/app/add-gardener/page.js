'use client';

import React, { useEffect, useState } from 'react';
import useSession from '@/hooks/useSession';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const SKILLS_URL =
  process.env.NEXT_PUBLIC_API_SKILLS || `${API_BASE}/api/skills`; 
const LEGACY_COMP_URL = `${API_BASE}/competences`; 

export default function AddGardener() {
  const { token } = useSession();
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

  useEffect(() => {
    const loadSkills = async () => {
      try {
        let res = await fetch(SKILLS_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('skills_not_found');
        let data = await res.json();

        if (Array.isArray(data) && data.length && data[0].name === undefined) {
          data = data.map((c) => ({
            id: c.id ?? c.id_competence,
            name: c.name ?? c.nom,
          }));
        }
        setSkillsList(data || []);
      } catch {
        try {
          const res = await fetch(LEGACY_COMP_URL, { cache: 'no-store' });
          const data = await res.json();
          const norm = (data || []).map((c) => ({
            id: c.id ?? c.id_competence,
            name: c.name ?? c.nom,
          }));
          setSkillsList(norm);
        } catch (err) {
          console.error('Failed to load skills:', err);
          setSkillsList([]);
        }
      }
    };
    loadSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const total = formData.photos.length + files.length;
    if (total > 5) {
      alert('You can add up to 5 photos maximum.');
      return;
    }
    setFormData((p) => ({ ...p, photos: [...p.photos, ...files] }));
    e.target.value = '';
  };

  const removePhoto = (index) => {
    setFormData((p) => ({
      ...p,
      photos: p.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSkillToggle = (skillName) => {
    setFormData((p) => {
      const exists = p.skills.includes(skillName);
      return { ...p, skills: exists ? p.skills.filter((s) => s !== skillName) : [...p.skills, skillName] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be signed in.');
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      location: formData.location.trim(),
      intro: formData.intro.trim(),
      yearsExperience: formData.yearsExperience ? Number(formData.yearsExperience) : null,
      skills: formData.skills,
    };

    if (!payload.firstName || !payload.lastName || !payload.intro) {
      alert('First name, last name, and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/me/gardener`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'request_failed');
      }
      alert('Gardener profile saved!');
    } catch (err) {
      console.error('Save gardener failed:', err);
      alert("Couldn't save the gardener profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Add a Gardener</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <label className="block w-full text-sm font-medium text-gray-700 mb-2">
            Photos (max 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full border rounded px-3 py-2 text-gray-400"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {formData.photos.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70 transition"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 self-start">{formData.photos.length}/5 selected</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name</label>
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
              <label className="block text-sm font-medium text-gray-700">Last name</label>
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
            <label className="block text-sm font-medium text-gray-700">Location</label>
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
              rows={3}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of experience</label>
            <input
              type="number"
              name="yearsExperience"
              min="0"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="grid grid-cols-2 gap-2">
              {skillsList.map((comp) => (
                <label key={comp.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(comp.name)}
                    onChange={() => handleSkillToggle(comp.name)}
                  />
                  <span>{comp.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#E3107D] hover:bg-[#c30c6a] disabled:opacity-60 text-white px-6 py-2 rounded-full mt-4"
          >
            {submitting ? 'Saving…' : 'Save my info'}
          </button>
        </div>
      </form>
    </div>
  );
}
