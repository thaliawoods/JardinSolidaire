'use client';

import React, { useState } from 'react';
import { removePhotoFromArray } from '@/utils/removePhoto';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AddGardenPage() {
  const router = useRouter();
  const { me, token } = useSession();

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

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newFiles],
    }));
  };

  const removePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: removePhotoFromArray(prev.photos, indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!me?.id) {
      alert('You must be signed in to add a garden.');
      return;
    }

    const payload = {
      ownerUserId: Number(me.id),
      title: formData.title.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      area: formData.area ? Number(formData.area) : null,
      needs: formData.needs.trim(),
      photos: [],
    };

    if (!payload.title || !payload.description) {
      alert('Title and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/gardens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Add a Garden</h1>

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
          <p className="mt-2 text-xs text-gray-500">
            Files are previewed locally only for now. Uploading to the server will be added soon.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
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
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Listing title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="86 avenue de la République, Paris"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Area (m²)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              min={0}
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Needs</label>
            <input
              type="text"
              name="needs"
              value={formData.needs}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="arrosage, désherbage, tondre…"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#E3107D] hover:bg-[#c30c6a] disabled:opacity-60 text-white px-6 py-2 rounded-full mt-4"
          >
            {submitting ? 'Adding…' : 'Add my garden'}
          </button>
        </div>
      </form>
    </div>
  );
}
