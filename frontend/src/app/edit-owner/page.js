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
    area: '',
    kind: '',
    intro: '',
    description: '',
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me');
        const o = me?.user?.proprietaire || me?.user?.owner;
        if (o) {
          setForm({
            firstName: o.firstName || '',
            lastName: o.lastName || '',
            district: o.district || '',
            availability: o.availability || '',
            area: o.area == null ? '' : String(o.area),
            kind: o.kind || '',
            intro: o.intro || '',
            description: o.description || '',
          });
        }
      } catch (e) {
        setErr(e?.message || 'server_error');
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
      lastName: form.lastName.trim(),
      district: form.district.trim(),
      availability: form.availability.trim(),
      area: Number.isFinite(areaInt) ? areaInt : null,
      kind: form.kind.trim(),
      intro: form.intro.trim(),
      description: form.description.trim(),
    };

    try {
      setSubmitting(true);
      await apiFetch('/api/me/owner', { method: 'POST', body: payload });
      router.push('/profile');
    } catch (e) {
      console.error('Update owner failed:', e);
      alert(`Couldn't save your changes. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Modifier mon profil propriétaire
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
          <section
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  required
                  className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Jane"
                />
              </Field>
              <Field label="Nom">
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  required
                  className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Doe"
                />
              </Field>
            </div>

            <Field label="Quartier">
              <input
                name="district"
                value={form.district}
                onChange={onChange}
                className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="e.g., Belleville"
              />
            </Field>

            <Field label="Disponibilité">
              <input
                name="availability"
                value={form.availability}
                onChange={onChange}
                className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="e.g., evenings and weekends"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Surface (m²)">
                <input
                  name="area"
                  type="number"
                  min="0"
                  value={form.area}
                  onChange={onChange}
                  className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Ex. 50"
                />
              </Field>
              <Field label="Type de jardin">
                <input
                  name="kind"
                  value={form.kind}
                  onChange={onChange}
                  className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="cour intérieure, potager…"
                />
              </Field>
            </div>

            <Field label="Introduction">
              <input
                name="intro"
                value={form.intro}
                onChange={onChange}
                className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="A quick intro…"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                className="w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                placeholder="Tell gardeners about your space, expectations, access, tools, etc."
              />
            </Field>
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
              href="/profile"
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

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
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
