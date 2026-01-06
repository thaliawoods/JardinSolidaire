'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { uploadImage } from '@/lib/uploads';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND = '#16a34a';
const MAX_MB = 5;
const MAX_FILES = 8;

function resolveMedia(u) {
  if (!u) return '';
  const s = String(u).trim();
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (s.startsWith('/uploads/')) return `${API_BASE}${s}`;
  if (s.startsWith('/')) return s;
  return `${API_BASE}/uploads/${s.replace(/^\.?\/*/, '')}`;
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-100 rounded-2xl" />
      <div className="h-96 bg-gray-100 rounded-2xl" />
    </div>
  );
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
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
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

  const photoCount = form.photos.length;
  const photoLeft = Math.max(0, MAX_FILES - photoCount);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onAddFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setMsg('');
    setErr('');

    // guards
    const left = Math.max(0, MAX_FILES - form.photos.length);
    const batch = files.slice(0, left);
    if (files.length > left) {
      setMsg(`Tu peux ajouter au maximum ${MAX_FILES} photos (il te reste ${left}).`);
    }

    const filtered = batch.filter((f) => {
      if (/\.heic$/i.test(f.name)) {
        setErr('HEIC non supporté ici : convertis en JPG/PNG/WebP avant upload.');
        return false;
      }
      if (!/^image\//.test(f.type)) {
        setErr('Choisis uniquement des images (JPG/PNG/WebP).');
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setErr(`“${f.name}” est trop lourde (max ${MAX_MB} Mo).`);
        return false;
      }
      return true;
    });

    if (!filtered.length) {
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of filtered) {
        const { path } = await uploadImage(file); // => "/uploads/xxx.ext"
        uploaded.push(path);
      }
      setForm((p) => ({ ...p, photos: [...p.photos, ...uploaded] }));
      setMsg((prev) => prev || 'Photo(s) ajoutée(s) ✔');
    } catch (error) {
      console.error(error);
      setErr("Échec d’upload d’une ou plusieurs images.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removePhoto(idx) {
    setForm((p) => ({ ...p, photos: p.photos.filter((_, i) => i !== idx) }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (!form.title.trim() || !form.address.trim()) {
      setErr('Titre et adresse sont requis.');
      return;
    }

    try {
      setBusy(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        address: form.address.trim(),
        needs: form.needs.trim() || undefined,
        area: form.area ? Number(form.area) : undefined,
        photos: form.photos,
      };

      await apiFetch('/api/gardens', { method: 'POST', body: payload });

      try {
        localStorage.setItem('gardensChanged', '1');
        setTimeout(() => localStorage.removeItem('gardensChanged'), 400);
      } catch {}

      router.push('/my-gardens?tab=drafts');
    } catch (e2) {
      console.error(e2);
      if (e2?.status === 409 && e2?.details?.error === 'owner_already_has_garden') {
        setErr(
          "Le serveur a refusé la création (409). Votre configuration limite à un seul jardin."
        );
      } else if (e2?.details?.error) {
        setErr(`Erreur: ${e2.details.error}`);
      } else {
        setErr("Impossible d'ajouter le jardin. Réessayez.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Ajouter un jardin
            </h1>
            <p className="text-gray-600 mt-1">
              Crée ton annonce en brouillon, puis publie-la depuis “Mes jardins”.
            </p>
          </div>

          <Link
            href="/my-gardens?tab=all"
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            ← Mes jardins
          </Link>
        </div>

        {/* Banner “déjà des jardins” */}
        {!loadingMine && mine && (
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500">Info</div>
                <div className="text-gray-900 font-semibold">
                  Vous avez déjà {mine.length} jardin{mine.length > 1 ? 's' : ''}.
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Dont {countPublished} publié{countPublished > 1 ? 's' : ''}. Vous pouvez en ajouter un autre.
                </div>
              </div>

              <span
                className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-800 ring-1 ring-green-200"
                style={{ color: BRAND }}
              >
                Propriétaire
              </span>
            </div>

            <div
              className="mt-4 h-1 w-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
              }}
            />
          </div>
        )}

        {loadingMine ? <Skeleton /> : null}

        {/* Messages */}
        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}
        {msg && !err && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 mb-6">
            {msg}
          </div>
        )}

        {/* Form */}
        {!loadingMine && (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Titre de l’annonce (obligatoire)">
                  <input
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Ex. Mon beau jardin"
                    required
                  />
                </Field>

                <Field label="Adresse (obligatoire)">
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Ex. 12 rue des Plantes, Paris"
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Surface (m²)" hint="optionnel">
                    <input
                      name="area"
                      value={form.area}
                      onChange={onChange}
                      inputMode="numeric"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                      placeholder="Ex. 50"
                    />
                  </Field>

                  <Field label="Besoins du jardin" hint="optionnel">
                    <input
                      name="needs"
                      value={form.needs}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                      placeholder="Ex. arrosage, désherbage…"
                    />
                  </Field>
                </div>

                <Field label="Description" hint="optionnel">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                    placeholder="Décris ton jardin : ambiance, accès, matériel disponible, contraintes…"
                  />
                </Field>

                {/* Photos */}
                <div className="pt-2">
                  <div className="flex items-end justify-between gap-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Photos
                    </label>
                    <span className="text-xs text-gray-500">
                      {photoCount}/{MAX_FILES} · il te reste {photoLeft}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm cursor-pointer">
                      <span>+ Ajouter des photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onAddFiles}
                        className="hidden"
                      />
                    </label>

                    {uploading && (
                      <span className="text-xs text-gray-600">Téléversement…</span>
                    )}

                    <span className="text-xs text-gray-500">
                      JPG/PNG/WebP · {MAX_MB} Mo max
                    </span>
                  </div>

                  {form.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {form.photos.map((p, i) => (
                        <div key={`${p}-${i}`} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveMedia(p)}
                            alt=""
                            className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                          />

                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-2 right-2 px-3 py-1 text-xs rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition"
                            title="Retirer"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {form.photos.length === 0 && (
                    <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-600">
                      Ajoute 1 à 3 photos pour rendre ton annonce plus attractive (optionnel).
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60"
                >
                  {busy ? 'Ajout…' : 'Créer le brouillon'}
                </button>

                <Link
                  href="/my-gardens?tab=all"
                  className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                >
                  Annuler
                </Link>

                <span className="text-xs text-gray-500">
                  Tu pourras publier ensuite depuis “Mes jardins”.
                </span>
              </div>

              <div
                className="mt-5 h-1 w-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
                }}
              />
            </div>

            {/* mini card “conseil” */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="text-sm font-semibold text-gray-900">Conseil</div>
              <div className="text-sm text-gray-600 mt-1">
                Plus ton annonce est précise (accès, matériel, besoins, photos), plus tu as de chances
                d’avoir des demandes de réservation.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
