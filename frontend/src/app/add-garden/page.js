'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { uploadImage } from '@/lib/uploads';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND    = '#16a34a';
const MAX_MB   = 5;
const MAX_FILES = 8;

function resolveMedia(u) {
  if (!u) return '';
  const s = String(u).trim();
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (s.startsWith('/uploads/')) return `${API_BASE}${s}`;
  if (s.startsWith('/')) return s;
  return `${API_BASE}/uploads/${s.replace(/^\.?\/*/, '')}`;
}

export default function AddGardenPage() {
  const router = useRouter();

  // existing gardens (info banner only)
  const [mine, setMine] = useState(null);
  const [loadingMine, setLoadingMine] = useState(true);

  // form
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    area: '',
    needs: '',
    photos: [], // array of "/uploads/xxx.jpg"
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState('');
  const [uploading, setUploading] = useState(false);

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

  async function onAddFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // guards
    const left = Math.max(0, MAX_FILES - form.photos.length);
    const batch = files.slice(0, left);
    if (files.length > left) {
      setMsg(`Tu peux ajouter au maximum ${MAX_FILES} photos (il te reste ${left}).`);
    }

    const filtered = batch.filter((f) => {
      if (/\.heic$/i.test(f.name)) {
        setMsg('HEIC non supporté ici : convertis en JPG/PNG/WebP avant upload.');
        return false;
      }
      if (!/^image\//.test(f.type)) {
        setMsg('Choisis uniquement des images (JPG/PNG/WebP).');
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setMsg(`“${f.name}” est trop lourde (max ${MAX_MB} Mo).`);
        return false;
      }
      return true;
    });

    if (!filtered.length) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of filtered) {
        const { path } = await uploadImage(file); // => "/uploads/xxx.ext"
        uploaded.push(path);
      }
      setForm((p) => ({ ...p, photos: [...p.photos, ...uploaded] }));
      if (!msg) setMsg('Photo(s) ajoutée(s) ✔');
    } catch (err) {
      console.error(err);
      setMsg("Échec d’upload d’une ou plusieurs images.");
    } finally {
      setUploading(false);
      // reset input to allow re-selecting the same file
      e.target.value = '';
    }
  }

  function removePhoto(idx) {
    setForm((p) => ({ ...p, photos: p.photos.filter((_, i) => i !== idx) }));
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
        title:       form.title.trim(),
        description: form.description.trim() || undefined,
        address:     form.address.trim(),
        needs:       form.needs.trim() || undefined,
        area:        form.area ? Number(form.area) : undefined,
        photos:      form.photos, // array of "/uploads/.."
      };

      await apiFetch('/api/gardens', { method: 'POST', body: payload });

      try {
        localStorage.setItem('gardensChanged', '1');
        setTimeout(() => localStorage.removeItem('gardensChanged'), 400);
      } catch {}

      router.push('/my-gardens?tab=drafts');
    } catch (err) {
      if (err?.status === 409 && err?.details?.error === 'owner_already_has_garden') {
        setMsg("Le serveur a refusé la création (409). Votre configuration limite à un seul jardin.");
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

      {/* info banner */}
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
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
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

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Photos (max {MAX_FILES})</label>

          <div className="mt-2 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onAddFiles}
              className="text-sm"
            />
            {uploading && <span className="text-xs text-gray-600">Téléversement…</span>}
          </div>

          {form.photos.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.photos.map((p, i) => (
                <div key={`${p}-${i}`} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveMedia(p)}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 px-2 py-1 text-xs rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100"
                    title="Retirer"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}
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
