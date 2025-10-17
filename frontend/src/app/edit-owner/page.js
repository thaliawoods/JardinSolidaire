'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function EditOwnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    district: '',
    availability: '',
    area: '',        // string input -> parsed to int
    kind: '',
    intro: '',
    description: '',
  });

  // Prefill with current owner profile (if none, we still allow creating here)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me'); // { user: { owner: {...} } }
        const o = me?.user?.owner;
        if (o) {
          setForm({
            firstName: o.firstName || '',
            lastName:  o.lastName || '',
            district:  o.district || '',
            availability: o.availability || '',
            area: o.area == null ? '' : String(o.area),
            kind: o.kind || '',
            intro: o.intro || '',
            description: o.description || '',
          });
        }
      } catch (e) {
        setErr(e?.error || e?.message || 'server_error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      alert('First name and last name are required.');
      return;
    }

    const areaInt =
      form.area === '' || form.area == null ? null : Number.parseInt(form.area, 10);

    const payload = {
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
      district:  form.district.trim(),
      availability: form.availability.trim(),
      area: Number.isFinite(areaInt) ? areaInt : null,
      kind: form.kind.trim(),
      intro: form.intro.trim(),
      description: form.description.trim(),
    };

    try {
      setSubmitting(true);
      await apiFetch('/api/me/owner', {
        method: 'POST',
        body: payload,
      });
      router.push('/profile');
    } catch (e) {
      console.error('Update owner failed:', e);
      alert(`Couldn't save your owner profile. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Edit my owner profile
      </h1>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Error: {err}
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Neighborhood</label>
            <input
              name="district"
              value={form.district}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="e.g., Belleville"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <input
              name="availability"
              value={form.availability}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="e.g., evenings and weekends"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
              <input
                name="area"
                type="number"
                min="0"
                value={form.area}
                onChange={onChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Garden type</label>
              <input
                name="kind"
                value={form.kind}
                onChange={onChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                placeholder="e.g., cour intérieure, potager…"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Introduction</label>
            <input
              name="intro"
              value={form.intro}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="A quick intro…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="Tell gardeners about your space, expectations, access, tools, etc."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-2 rounded-full"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              href="/profile"
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
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
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-24 bg-gray-100 rounded" />
    </div>
  );
}
