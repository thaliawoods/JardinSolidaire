'use client';

import React, { useState } from 'react';
import { removePhotoFromArray } from '@/utils/removePhoto';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';
import { getAnyToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AddGardenPage() {
  const router = useRouter();
  // useSession returns { user, isAuthenticated, loading, refetch }
  const { user, loading } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    area: '',
    needs: '',
    photos: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const total = formData.photos.length + newFiles.length;
    if (total > 5) {
      alert('You can add up to 5 photos maximum.');
      return;
    }
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
  };

  const removePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: removePhotoFromArray(prev.photos, indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Grab a real token from localStorage/cookies
    const token = getAnyToken();

    if (!user?.id || !token) {
      alert('You must be signed in to add a garden.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      area: formData.area ? Number(formData.area) : null,
      needs: formData.needs.trim(),
      photos: [], // keep client-only for now
    };

    if (!payload.title || !payload.address) {
      alert('Title and address are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/gardens`, {
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

      alert('Garden added!');
      router.push('/gardens');
    } catch (err) {
      console.error('Add garden failed:', err);
      alert("Couldn't add the garden. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Ajouter mon jardin</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photos */}
        <section
          className="rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
        >
          <label className="block w-full text-sm font-medium text-gray-800">Photos (max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
          />
          <p className="mt-2 text-xs text-gray-600">
            Les fichiers sont uniquement prévisualisés en local pour le moment.
          </p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.photos.map((file, index) => (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 inline-flex items-center justify-center rounded-full w-7 h-7 text-sm bg-white/90 text-red-600 border border-red-200 hover:bg-red-50 transition"
                  aria-label="Retirer la photo"
                  title="Retirer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section
          className="rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre de l’annonce</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                required
                placeholder="Jardin ensoleillé à partager…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                required
                placeholder="Parlez de votre espace, de l’accès, des outils, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="86 avenue de la République, Paris"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min={0}
                  inputMode="numeric"
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Ex. 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Besoins du jardin</label>
                <input
                  type="text"
                  name="needs"
                  value={formData.needs}
                  onChange={handleChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="arrosage, désherbage, tondre…"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || loading}
                className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
              >
                {submitting ? 'Adding…' : 'Ajouter mon jardin'}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
