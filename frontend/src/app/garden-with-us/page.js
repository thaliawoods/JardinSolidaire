'use client';
import React, { useState, useEffect } from 'react';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function IWantToGardenPage() {
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
    (async () => {
      try {
        let res = await fetch(`${API_BASE}/api/skills`, { cache: 'no-store' });
        if (!res.ok) throw new Error('fallback');
        let data = await res.json();

        if (Array.isArray(data) && data[0] && data[0].name === undefined) {
          data = data.map((c) => ({ id: c.id_competence ?? c.id, name: c.nom ?? c.name }));
        }
        setSkillsList(data || []);
      } catch {
        try {
          const res = await fetch(`${API_BASE}/competences`, { cache: 'no-store' });
          const data = await res.json();
          const norm = (data || []).map((c) => ({ id: c.id_competence ?? c.id, name: c.nom ?? c.name }));
          setSkillsList(norm);
        } catch (err) {
          console.error('Skills load failed:', err);
          setSkillsList([]);
        }
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const total = formData.photos.length + newFiles.length;
    if (total > 5) {
      alert('You can add up to 5 photos maximum.');
      return;
    }
    setFormData((p) => ({ ...p, photos: [...p.photos, ...newFiles] }));
    e.target.value = '';
  };

  const removePhoto = (indexToRemove) => {
    setFormData((p) => ({
      ...p,
      photos: p.photos.filter((_, i) => i !== indexToRemove),
    }));
  };

  const toggleSkill = (skillName) => {
    setFormData((p) => {
      const exists = p.skills.includes(skillName);
      return { ...p, skills: exists ? p.skills.filter((s) => s !== skillName) : [...p.skills, skillName] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getAnyToken();
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
      // photos not uploaded yet—add /api/uploads later and pass URLs here
    };

    if (!payload.firstName || !payload.lastName || !payload.intro) {
      alert('First name, last name, and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/me/gardener`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'request_failed');
      }
      alert('Your gardener profile has been saved!');
    } catch (err) {
      console.error('Save failed:', err);
      alert("Couldn't save your info. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">I want to garden</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <label className="block w-full text-sm font-medium text-gray-700 mb-2">Add photos (max 5):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full border rounded px-3 py-2 text-gray-400"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.photos.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-80 transition"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 self-start">
            {formData.photos.length}/5 selected
          </p>
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
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="grid grid-cols-2 gap-2">
              {skillsList.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(s.name)}
                    onChange={() => toggleSkill(s.name)}
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
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

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#E3107D] hover:bg-[#c30c6a] disabled:opacity-60 text-white px-6 py-2 rounded-full mt-4"
          >
            {submitting ? 'Saving…' : 'Save my information'}
          </button>
        </div>
      </form>
    </div>
  );
}
