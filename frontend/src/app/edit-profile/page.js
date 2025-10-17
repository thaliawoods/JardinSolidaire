'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',      // read-only in this form
    phone: '',
    address: '',
    bio: '',
    avatarUrl: '',
  });

  // Prefill from /api/me
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me');
        const u = me?.user || {};
        setForm({
          firstName: u.firstName || '',
          lastName:  u.lastName || '',
          email:     u.email || '',
          phone:     u.phone || '',
          address:   u.address || '',
          bio:       u.bio || '',
          avatarUrl: u.avatarUrl || '',
        });
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
    try {
      setSubmitting(true);
      await apiFetch('/api/me/profile', {
        method: 'POST',
        body: {
          firstName: form.firstName.trim(),
          lastName:  form.lastName.trim(),
          phone:     form.phone.trim(),
          address:   form.address.trim(),
          bio:       form.bio.trim(),
          avatarUrl: form.avatarUrl.trim(),
        },
      });
      router.push('/profile');
    } catch (e) {
      console.error('Update profile failed:', e);
      alert(`Couldn't save your account info. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Edit my account</h1>

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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="mt-1 w-full border rounded px-3 py-2 text-gray-400 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="e.g. 0674096643"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="Street, city…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="https://…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              placeholder="A few words about you…"
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
