'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function EditOwnerPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const [meName, setMeName] = useState({ firstName: '', lastName: '' });

  const [form, setForm] = useState({
    district: '',
    availability: '',
    area: '',
    kind: '',
    intro: '',
    description: '',
  });

  // Prefill with existing owner + identity from user
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const me = await apiFetch('/api/me');
        const user = me?.user || me || {};
        const owner = user?.proprietaire || user?.owner || null;

        setMeName({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
        });

        if (owner) {
          setForm({
            district: owner.district || owner.quartier || '',
            availability: owner.availability || owner.disponibilite || '',
            area: owner.area == null ? (owner.surface == null ? '' : String(owner.surface)) : String(owner.area),
            kind: owner.kind || owner.type || '',
            intro: owner.intro || owner.presentation || '',
            description: owner.description || owner.details || '',
          });
        }
      } catch (e) {
        setErr(e?.message || 'server_error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fullName = useMemo(() => {
    const fn = (meName.firstName || '').trim();
    const ln = (meName.lastName || '').trim();
    return [fn, ln].filter(Boolean).join(' ') || '—';
  }, [meName]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const areaInt =
      form.area === '' || form.area == null ? null : Number.parseInt(form.area, 10);

    // ✅ payload compat (UI + alias backend possibles)
    const payload = {
      // identité → on prend celle du compte
      firstName: (meName.firstName || '').trim(),
      lastName: (meName.lastName || '').trim(),

      // UI fields
      district: (form.district || '').trim(),
      availability: (form.availability || '').trim(),
      area: Number.isFinite(areaInt) ? areaInt : null,
      kind: (form.kind || '').trim(),
      intro: (form.intro || '').trim(),
      description: (form.description || '').trim(),

      // aliases backend (au cas où)
      quartier: (form.district || '').trim(),
      disponibilite: (form.availability || '').trim(),
      surface: Number.isFinite(areaInt) ? areaInt : null,
      type: (form.kind || '').trim(),
      presentation: (form.intro || '').trim(),
      details: (form.description || '').trim(),
    };

    // Petit garde-fou
    if (!payload.firstName || !payload.lastName) {
      alert("Ton compte n'a pas de prénom/nom. Va sur Dashboard > Mon profil.");
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch('/api/me/owner', { method: 'POST', body: payload });

      localStorage.setItem('ownerUpdated', String(Date.now()));
      window.location.href = '/dashboard';
    } catch (e) {
      console.error('Update owner failed:', e);
      const details = e?.details ? `\n${JSON.stringify(e.details, null, 2)}` : '';
      alert(`Impossible d'enregistrer. ${e?.message || ''}${details}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Profil Propriétaire
            </h1>
            <p className="text-gray-600 mt-1">
              Mets à jour ton profil propriétaire (sans ressaisir ton identité).
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            Error: {err}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Identity card */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Identité (depuis le compte)</div>
                  <div className="text-gray-900 font-semibold">{fullName}</div>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-800 ring-1 ring-green-200">
                  Propriétaire
                </span>
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Quartier">
                  <input
                    name="district"
                    value={form.district}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Ex : Belleville"
                  />
                </Field>

                <Field label="Disponibilité">
                  <input
                    name="availability"
                    value={form.availability}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Ex : soirs + weekends"
                  />
                </Field>

                <Field label="Surface (m²)">
                  <input
                    name="area"
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Ex : 50"
                  />
                </Field>

                <Field label="Type de jardin">
                  <input
                    name="kind"
                    value={form.kind}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="cour intérieure, potager…"
                  />
                </Field>

                <Field label="Introduction" full>
                  <input
                    name="intro"
                    value={form.intro}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="En 1 phrase : qui tu es / ton jardin…"
                  />
                </Field>

                <Field label="Description" full>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Accès, outils, attentes, règles…"
                  />
                </Field>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60"
                >
                  {submitting ? 'Enregistrement…' : 'Enregistrer'}
                </button>

                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                >
                  Annuler
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div className={full ? 'sm:col-span-2 space-y-2' : 'space-y-2'}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-100 rounded-2xl" />
      <div className="h-72 bg-gray-100 rounded-2xl" />
    </div>
  );
}
