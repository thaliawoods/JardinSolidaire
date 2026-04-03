'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/uploads';
const UPLOAD_FIELD = process.env.NEXT_PUBLIC_UPLOAD_FIELD || 'file';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const INPUT_DISABLED = { ...INPUT, background: '#f9f9f9', color: 'var(--muted)', cursor: 'not-allowed' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };

function resolveMedia(u) {
  if (!u) return '';
  const s = String(u).trim();
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (LOCAL_DIRS.some((p) => s.startsWith(p))) return s;
  if (s.startsWith('/uploads/')) return `${API_BASE}${s}`;
  if (s.startsWith('/')) return s;
  const clean = s.replace(/^\.?\/*/, '');
  if (clean.startsWith('uploads/')) return `${API_BASE}/${clean}`;
  if (LOCAL_DIRS.some((p) => clean.startsWith(p.slice(1)))) return `/${clean}`;
  return `${API_BASE}/uploads/${clean}`;
}

function initials(a = '', b = '') {
  const x = (a || '').trim()[0] || '';
  const y = (b || '').trim()[0] || '';
  return (`${x}${y}`.toUpperCase() || 'U');
}

function avatarPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#111111"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function pickFirstUrl(json) {
  if (!json || typeof json !== 'object') return '';
  if (typeof json.url === 'string') return json.url;
  if (typeof json.path === 'string') return json.path;
  if (Array.isArray(json.urls) && json.urls[0]) return json.urls[0];
  if (Array.isArray(json.paths) && json.paths[0]) return json.paths[0];
  if (Array.isArray(json.files) && json.files.length) {
    const f = json.files[0];
    if (typeof f === 'string') return f;
    if (typeof f?.url === 'string') return f.url;
    if (typeof f?.path === 'string') return f.path;
  }
  return '';
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) router.replace('/login?next=/edit-profile');
  }, [router]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatarUrl: '',
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const me = await apiFetch('/api/me');
        const u = me?.user || {};
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          phone: u.phone || '',
          address: u.address || '',
          bio: u.bio || '',
          avatarUrl: u.avatarUrl || u.photo_profil || u.avatar || '',
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
      alert('Prénom et nom sont requis.');
      return;
    }
    try {
      setSubmitting(true);
      await apiFetch('/api/me/profile', {
        method: 'POST',
        body: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          bio: form.bio.trim(),
          avatarUrl: form.avatarUrl.trim(),
        },
      });
      router.push('/profile');
    } catch (e) {
      console.error('Update profile failed:', e);
      alert(`Impossible d'enregistrer. ${e?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  const avatarSrc = useMemo(() => resolveMedia(form.avatarUrl), [form.avatarUrl]);
  const avatarFallback = useMemo(() => avatarPlaceholder(form.firstName, form.lastName), [form.firstName, form.lastName]);

  function removeAvatar() {
    setForm((p) => ({ ...p, avatarUrl: '' }));
  }

  async function postForm(urlPath, fd) {
    const res = await fetch(`${API_BASE}${urlPath}`, { method: 'POST', body: fd, credentials: 'include' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const error = new Error(`HTTP ${res.status} on ${urlPath}${text ? ` — ${text}` : ''}`);
      error.status = res.status;
      error.url = urlPath;
      throw error;
    }
    const json = await res.json().catch(() => ({}));
    const url = pickFirstUrl(json);
    if (!url) throw new Error(`No URL returned by ${urlPath}`);
    return url;
  }

  async function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append(UPLOAD_FIELD, file);
      let url = await postForm(UPLOAD_ENDPOINT, fd);
      if (url && !/^https?:|^data:|^\//.test(url)) url = `/uploads/${url}`;
      setForm((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err) {
      console.warn('[edit-profile] first upload attempt failed:', err);
      try {
        const fallbackFd = new FormData();
        fallbackFd.append('avatar', file);
        const FALLBACKS = ['/api/me/avatar', '/api/upload/avatar', '/api/avatar', '/api/users/me/avatar', '/upload/avatar'];
        let url = '';
        for (const p of FALLBACKS) {
          try { url = await postForm(p, fallbackFd); break; } catch (e) { console.warn('fallback failed:', p, e?.message); }
        }
        if (!url) throw err;
        if (url && !/^https?:|^data:|^\//.test(url)) url = `/uploads/${url}`;
        setForm((prev) => ({ ...prev, avatarUrl: url }));
      } catch (finalErr) {
        alert(`Échec de l'upload de l'avatar.\n${finalErr?.message || 'Failed to fetch'}`);
        console.error('[avatar upload failed]', finalErr);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', margin: '0 0 0.75rem' }}>
            Compte
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
            Modifier mon profil
          </h1>
        </div>

        {err && (
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626', margin: '1.5rem 0' }}>
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>

          <section>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', margin: '0 0 1rem' }}>
              Photo de profil
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc || avatarFallback}
                alt="Avatar"
                style={{ width: 80, height: 80, objectFit: 'cover', display: 'block', border: '1px solid var(--border)', flexShrink: 0 }}
                onError={(e) => { e.currentTarget.src = avatarFallback; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <label style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--foreground)', cursor: 'pointer', background: '#fff' }}>
                    {uploading ? 'Upload…' : 'Télécharger une photo'}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: 'none' }} />
                  </label>
                  <button
                    type="button"
                    onClick={removeAvatar}
                    style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--muted)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Retirer
                  </button>
                </div>
                <div>
                  <label style={LABEL}>URL de l&apos;avatar</label>
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={onChange}
                    style={INPUT}
                    placeholder="https://… ou /uploads/mon-avatar.jpg"
                  />
                  <p style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    Collez une URL directe, ou utilisez &quot;Télécharger&quot; pour choisir un fichier.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', margin: '0 0 1rem' }}>
              Informations du compte
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={LABEL}>Prénom <span style={{ color: '#dc2626' }}>*</span></label>
                <input name="firstName" value={form.firstName} onChange={onChange} style={INPUT} placeholder="Jane" required />
              </div>
              <div>
                <label style={LABEL}>Nom <span style={{ color: '#dc2626' }}>*</span></label>
                <input name="lastName" value={form.lastName} onChange={onChange} style={INPUT} placeholder="Doe" required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={LABEL}>Email</label>
                <input name="email" value={form.email} disabled style={INPUT_DISABLED} />
              </div>
              <div>
                <label style={LABEL}>Téléphone</label>
                <input name="phone" value={form.phone} onChange={onChange} style={INPUT} placeholder="0674096643" />
              </div>
              <div>
                <label style={LABEL}>Adresse</label>
                <input name="address" value={form.address} onChange={onChange} style={INPUT} placeholder="Rue, ville…" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={LABEL}>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  rows={4}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Quelques mots sur vous…"
                />
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
            <Link href="/profile" style={{ padding: '0.65rem 1.5rem', background: '#fff', color: 'var(--foreground)', border: '1px solid var(--border)', fontSize: '0.875rem', textDecoration: 'none' }}>
              Annuler
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
