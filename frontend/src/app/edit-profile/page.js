'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/uploads';
const UPLOAD_FIELD = process.env.NEXT_PUBLIC_UPLOAD_FIELD || 'file';

const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

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
function greenAvatar(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#22C55E"/><stop offset="100%" stop-color="#16A34A"/>
  </linearGradient></defs>
  <rect width="256" height="256" rx="24" ry="24" fill="url(#g)"/>
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
          lastName:  u.lastName || '',
          email:     u.email || '',
          phone:     u.phone || '',
          address:   u.address || '',
          bio:       u.bio || '',
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

  const avatarSrc = useMemo(() => resolveMedia(form.avatarUrl), [form.avatarUrl]);
  const avatarFallback = useMemo(
    () => greenAvatar(form.firstName, form.lastName),
    [form.firstName, form.lastName]
  );

  function removeAvatar() {
    setForm((p) => ({ ...p, avatarUrl: '' }));
  }

  async function postForm(urlPath, fd) {
    const res = await fetch(`${API_BASE}${urlPath}`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    });
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
        const FALLBACKS = [
          '/api/me/avatar',
          '/api/upload/avatar',
          '/api/avatar',
          '/api/users/me/avatar',
          '/upload/avatar',
        ];
        let url = '';
        for (const p of FALLBACKS) {
          try {
            url = await postForm(p, fallbackFd);
            break;
          } catch (e) {
            console.warn('fallback failed:', p, e?.message);
          }
        }
        if (!url) throw err;
        if (url && !/^https?:|^data:|^\//.test(url)) url = `/uploads/${url}`;
        setForm((prev) => ({ ...prev, avatarUrl: url }));
      } catch (finalErr) {
        alert(`Échec de l’upload de l’avatar.\n${finalErr?.message || 'Failed to fetch'}`);
        console.error('[avatar upload failed]', finalErr);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">Modifier mon profil</h1>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Error: {err}
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto space-y-6">
          <section
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
          >
            <h2 className="text-lg font-semibold text-emerald-900 mb-4">Photo de profil</h2>

            <div className="flex items-start gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc || avatarFallback}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover shadow"
                style={{ border: '4px solid rgba(22,163,74,0.35)' }}
                onError={(e) => { e.currentTarget.src = avatarFallback; }}
              />

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition cursor-pointer">
                    {uploading ? 'Upload…' : 'Télécharger'}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>

                  {avatarSrc && (
                    <a
                      href={avatarSrc}
                      download
                      className="px-4 py-2 rounded-full bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition"
                    >
                      Télécharger l’avatar
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="px-4 py-2 rounded-full bg-white/80 border border-red-300 text-red-700 hover:bg-red-50 transition"
                  >
                    Retirer
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={onChange}
                    className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                    placeholder="https://… ou /uploads/mon-avatar.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Collez une URL directe, ou utilisez “Télécharger” pour choisir un fichier (le lien sera rempli).
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
          >
            <h2 className="text-lg font-semibold text-emerald-900 mb-4">Informations du compte</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Jane"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Doe"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  value={form.email}
                  disabled
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-200 bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="e.g. 0674096643"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Rue, ville…"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  rows={4}
                  className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                  placeholder="Quelques mots sur vous…"
                />
              </div>
            </div>
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
