'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { uploadImage } from '@/lib/uploads';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const MAX_MB = 5;
const MAX_FILES = 8;

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };

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

  const [mine, setMine] = useState(null);
  const [loadingMine, setLoadingMine] = useState(true);

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    area: '',
    needs: '',
    photos: [],
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
    const left = Math.max(0, MAX_FILES - form.photos.length);
    const batch = files.slice(0, left);
    if (files.length > left) {
      setMsg(`Tu peux ajouter au maximum ${MAX_FILES} photos (il te reste ${left}).`);
    }
    const filtered = batch.filter((f) => {
      if (/\.heic$/i.test(f.name)) { setErr('HEIC non supporté ici : convertis en JPG/PNG/WebP avant upload.'); return false; }
      if (!/^image\//.test(f.type)) { setErr('Choisis uniquement des images (JPG/PNG/WebP).'); return false; }
      if (f.size > MAX_MB * 1024 * 1024) { setErr(`"${f.name}" est trop lourde (max ${MAX_MB} Mo).`); return false; }
      return true;
    });
    if (!filtered.length) { e.target.value = ''; return; }
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of filtered) {
        const { path } = await uploadImage(file);
        uploaded.push(path);
      }
      setForm((p) => ({ ...p, photos: [...p.photos, ...uploaded] }));
      setMsg((prev) => prev || 'Photo(s) ajoutée(s).');
    } catch (error) {
      console.error(error);
      setErr("Échec d'upload d'une ou plusieurs images.");
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
    if (!form.title.trim() || !form.address.trim()) { setErr('Titre et adresse sont requis.'); return; }
    try {
      setBusy(true);
      await apiFetch('/api/gardens', {
        method: 'POST',
        body: {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          address: form.address.trim(),
          needs: form.needs.trim() || undefined,
          area: form.area ? Number(form.area) : undefined,
          photos: form.photos,
        },
      });
      try { localStorage.setItem('gardensChanged', '1'); setTimeout(() => localStorage.removeItem('gardensChanged'), 400); } catch {}
      router.push('/my-gardens?tab=drafts');
    } catch (e2) {
      console.error(e2);
      if (e2?.status === 409 && e2?.details?.error === 'owner_already_has_garden') {
        setErr("Le serveur a refusé la création (409). Votre configuration limite à un seul jardin.");
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
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', margin: '0 0 0.75rem' }}>
              Propriétaire
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
              Ajouter un jardin
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0.5rem 0 0' }}>
              Crée ton annonce en brouillon, puis publie-la depuis &quot;Mes jardins&quot;.
            </p>
          </div>
          <Link href="/my-gardens?tab=all" style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap', flexShrink: 0 }}>
            ← Mes jardins
          </Link>
        </div>

        {!loadingMine && mine && mine.length > 0 && (
          <div style={{ border: '1px solid var(--border)', padding: '1rem 1.25rem', margin: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>Info</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: '0.25rem 0 0', fontWeight: 500 }}>
                Vous avez déjà {mine.length} jardin{mine.length > 1 ? 's' : ''}
                {' '}· {countPublished} publié{countPublished > 1 ? 's' : ''}.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Propriétaire</span>
          </div>
        )}

        {err && (
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626', margin: '1rem 0' }}>
            {err}
          </div>
        )}
        {msg && !err && (
          <div style={{ borderLeft: '2px solid var(--green)', paddingLeft: '0.75rem', fontSize: '0.875rem', color: 'var(--green)', margin: '1rem 0' }}>
            {msg}
          </div>
        )}

        {!loadingMine && (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>

            <div style={{ border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label style={LABEL}>Titre de l&apos;annonce <span style={{ color: '#dc2626' }}>*</span></label>
                <input name="title" value={form.title} onChange={onChange} style={INPUT} placeholder="Ex. Mon beau jardin" required />
              </div>

              <div>
                <label style={LABEL}>Adresse <span style={{ color: '#dc2626' }}>*</span></label>
                <input name="address" value={form.address} onChange={onChange} style={INPUT} placeholder="Ex. 12 rue des Plantes, Paris" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={LABEL}>Surface (m²) <span style={{ color: 'var(--muted)', fontWeight: 400 }}>optionnel</span></label>
                  <input name="area" value={form.area} onChange={onChange} inputMode="numeric" style={INPUT} placeholder="Ex. 50" />
                </div>
                <div>
                  <label style={LABEL}>Besoins <span style={{ color: 'var(--muted)', fontWeight: 400 }}>optionnel</span></label>
                  <input name="needs" value={form.needs} onChange={onChange} style={INPUT} placeholder="arrosage, désherbage…" />
                </div>
              </div>

              <div>
                <label style={LABEL}>Description <span style={{ color: 'var(--muted)', fontWeight: 400 }}>optionnel</span></label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={5}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Ambiance, accès, matériel disponible, contraintes…"
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ ...LABEL, marginBottom: 0 }}>Photos</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{photoCount}/{MAX_FILES} · {photoLeft} restante{photoLeft !== 1 ? 's' : ''}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'inline-block', padding: '0.5rem 1rem', border: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--foreground)', cursor: 'pointer', background: '#fff' }}>
                    + Ajouter des photos
                    <input type="file" accept="image/*" multiple onChange={onAddFiles} style={{ display: 'none' }} />
                  </label>
                  {uploading && <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Téléversement…</span>}
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>JPG/PNG/WebP · {MAX_MB} Mo max</span>
                </div>

                {form.photos.length > 0 && (
                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {form.photos.map((p, i) => (
                      <div key={`${p}-${i}`} style={{ position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={resolveMedia(p)} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block', border: '1px solid var(--border)' }} />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          style={{ position: 'absolute', top: 4, right: 4, padding: '2px 8px', background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {form.photos.length === 0 && (
                  <div style={{ marginTop: '0.75rem', border: '1px dashed var(--border)', padding: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                    Ajoute 1 à 3 photos pour rendre ton annonce plus attractive (optionnel).
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={busy}
                  style={{ padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', opacity: busy ? 0.6 : 1 }}
                >
                  {busy ? 'Ajout…' : 'Créer le brouillon'}
                </button>
                <Link href="/my-gardens?tab=all" style={{ padding: '0.65rem 1.5rem', background: '#fff', color: 'var(--foreground)', border: '1px solid var(--border)', fontSize: '0.875rem', textDecoration: 'none' }}>
                  Annuler
                </Link>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  Tu pourras publier ensuite depuis &quot;Mes jardins&quot;.
                </span>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', margin: '0 0 0.5rem' }}>Conseil</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0 }}>
                Plus ton annonce est précise (accès, matériel, besoins, photos), plus tu as de chances d&apos;avoir des demandes de réservation.
              </p>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
