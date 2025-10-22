'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const BRAND = '#16a34a';

export default function AddGardenPage() {
  const router = useRouter();

  // existing gardens (for a small info note; we DO NOT block the form anymore)
  const [mine, setMine] = useState(null);
  const [loadingMine, setLoadingMine] = useState(true);

  // form
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    area: '',
    needs: '',
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoadingMine(true);
        const rows = await apiFetch('/api/gardens', { query: { mine: 1 } });
        setMine(Array.isArray(rows) ? rows : []);
      } catch {
        setMine([]);
      } finally {
        setLoadingMine(false);
      }
    })();
  }, []);

  const countPublished = useMemo(
    () => (mine || []).filter((g) => !!g.publishedAt).length,
    [mine]
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (!form.title.trim() || !form.address.trim()) {
      setMsg('Titre et adresse sont requis.');
      return;
    }

    try {
      setBusy(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        address: form.address.trim(),
        needs: form.needs.trim() || undefined,
      };
      const created = await apiFetch('/api/gardens', { method: 'POST', body: payload });

      // tell other tabs to refresh lists
      try {
        localStorage.setItem('gardensChanged', '1');
        setTimeout(() => localStorage.removeItem('gardensChanged'), 500);
      } catch {}

      // go see it in "Brouillons"
      router.push('/my-gardens?tab=drafts');
    } catch (err) {
      if (err?.status === 409 && err?.details?.error === 'owner_already_has_garden') {
        // legacy backend case; keep a friendly message
        setMsg("Le serveur a refusé la création (409). Votre configuration actuelle limite à un seul jardin.");
      } else if (err?.details?.error) {
        setMsg(`Erreur: ${err.details.error}`);
      } else {
        setMsg("Impossible d'ajouter le jardin. Réessayez.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Ajouter mon jardin</h1>

      {/* small info banner — we NEVER block the form */}
      {!loadingMine && mine && (
        <div
          className="mb-6 rounded-lg border px-4 py-3 text-sm"
          style={{ backgroundColor: 'rgba(22,163,74,0.06)', borderColor: 'rgba(22,163,74,0.22)' }}
        >
          Vous avez déjà <strong>{mine.length}</strong> jardin{mine.length > 1 ? 's' : ''} (dont{' '}
          <strong>{countPublished}</strong> publié{countPublished > 1 ? 's' : ''}). Vous pouvez en ajouter un autre ci-dessous.
          <Link href="/my-gardens" className="ml-2 underline" style={{ color: BRAND }}>
            Retour à mes jardins
          </Link>
        </div>
      )}

      {msg && (
        <div className="mb-6 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre de l’annonce</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
            placeholder="Ex. Mon beau jardin"
            required
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
            placeholder="Parlez un peu de votre jardin…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
            placeholder="Ex. 12 rue des Plantes, Paris"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
            <input
              name="area"
              value={form.area}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              placeholder="Ex. 50"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Besoins du jardin</label>
            <input
              name="needs"
              value={form.needs}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              placeholder="Ex. arrosage, désherbage…"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
          >
            {busy ? 'Ajout…' : 'Ajouter'}
          </button>

          <Link
            href="/my-gardens"
            className="rounded-full px-4 py-2 border bg-white hover:bg-gray-50 text-gray-800"
            style={{ borderColor: 'rgba(22,163,74,0.28)' }}
          >
            Annuler
          </Link>
        </div>
      </form>
    </main>
  );
}
