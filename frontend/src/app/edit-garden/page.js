'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function EditGardenPage() {
  const router = useRouter();
  const search = useSearchParams();
  const id = search.get('id');

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    needs: '',
    kind: '',
    area: '',
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const g = await apiFetch(`/api/gardens/${id}`);
        setForm({
          title: g.title || '',
          description: g.description || '',
          address: g.address || '',
          needs: g.needs || '',
          kind: g.kind || '',
          area: g.area || '',
        });
      } catch (e) {
        setMsg("Impossible de charger le jardin.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');
    try {
      setSaving(true);
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        needs: form.needs.trim(),
        kind: form.kind.trim(),
        area: form.area ? Number(form.area) : undefined,
      };
      if (id) {
        await apiFetch(`/api/gardens/${id}`, { method: 'PATCH', body });
      } else {
        await apiFetch('/api/gardens', { method: 'POST', body });
      }
      router.push('/my-gardens?tab=all');
    } catch (e) {
      setMsg(e?.message || 'Erreur.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
        {id ? 'Modifier mon jardin' : 'Ajouter mon jardin'}
      </h1>

      {msg && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-6 bg-white text-gray-500">Chargement…</div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 bg-white rounded-2xl p-6 border">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de l’annonce</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              required
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
              <input
                name="area"
                type="number"
                value={form.area}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                name="kind"
                value={form.kind}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Besoins du jardin</label>
            <input
              name="needs"
              value={form.needs}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              placeholder="arrosage, désherbage…"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : id ? 'Enregistrer' : 'Ajouter'}
            </button>

            <Link
              href="/my-gardens?tab=all"
              className="rounded-full px-6 py-2 border border-gray-300 hover:bg-gray-50"
            >
              Retour à mes jardins
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
