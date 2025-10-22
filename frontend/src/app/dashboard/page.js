'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/uploads';
const UPLOAD_FIELD = process.env.NEXT_PUBLIC_UPLOAD_FIELD || 'file';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* ---------------- helpers ---------------- */
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
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

/* ---------------- small UI bits ---------------- */
function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{children || '—'}</span>
    </div>
  );
}

function CompactProfileCard({ me, onEdit }) {
  const avatarSrc = useMemo(
    () => resolveMedia(me?.avatarUrl || me?.photo_profil || me?.avatar),
    [me]
  );
  const fallback = useMemo(() => greenAvatar(me?.firstName, me?.lastName), [me?.firstName, me?.lastName]);

  return (
    <section
      className="rounded-2xl p-5 border shadow-sm mb-8"
      style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
    >
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc || fallback}
          alt=""
          className="w-14 h-14 rounded-full object-cover shadow"
          style={{ border: '3px solid rgba(22,163,74,0.35)' }}
          onError={(e) => { e.currentTarget.src = fallback; }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-emerald-900">Mon profil</h2>
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-full text-sm bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] transition text-green-700"
            >
              Modifier
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoRow label="Nom">{me?.lastName}</InfoRow>
            <InfoRow label="Prénom">{me?.firstName}</InfoRow>
            <InfoRow label="Email">{me?.email}</InfoRow>
            <InfoRow label="Téléphone">{me?.phone}</InfoRow>
            <InfoRow label="Adresse">{me?.address}</InfoRow>
            <div className="sm:col-span-2">
              <div className="text-sm text-gray-600 mb-0.5">Bio</div>
              <div className="text-sm text-gray-900">{me?.bio || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- page ---------------- */
export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // embedded edit-profile form
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatarUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  // controls whether the profile form is visible
  const [profileDone, setProfileDone] = useState(false);

  const roleSectionRef = useRef(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    (async () => {
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        setLoading(true);
        const r = await apiFetch('/api/me');
        const u = r?.user || {};
        setMe(u);
        setRole(u.role || null);
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          phone: u.phone || '',
          address: u.address || '',
          bio: u.bio || '',
          avatarUrl: u.avatarUrl || u.photo_profil || u.avatar || '',
        });

        // if user already has a minimal profile, show compact card immediately
        const alreadyHasBase = !!(u?.firstName || u?.lastName || u?.phone || u?.address || u?.bio);
        setProfileDone(alreadyHasBase);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function setActiveRole(r) {
    try {
      await apiFetch('/api/me/role', { method: 'PUT', body: { role: r } });
      setRole(r);
    } catch (e) {
      console.error('set role failed', e);
      setMsg("Impossible de changer d’interface.");
    }
  }

  /* -------- embedded edit-profile actions -------- */
  const avatarSrc = useMemo(() => resolveMedia(form.avatarUrl), [form.avatarUrl]);
  const avatarFallback = useMemo(
    () => greenAvatar(form.firstName, form.lastName),
    [form.firstName, form.lastName]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  async function handleSaveProfile(e) {
    e.preventDefault();
    setMsg('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setMsg('Prénom et nom sont requis.');
      return;
    }

    try {
      setSaving(true);
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

      // reflect locally, show compact card
      const updated = { ...(me || {}), ...form };
      setMe(updated);
      setMsg('Profil enregistré ✅');
      setProfileDone(true);

      // scroll to role section for continuity
      setTimeout(() => {
        roleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (e) {
      console.error('save profile failed', e);
      setMsg("Échec de l’enregistrement du profil.");
    } finally {
      setSaving(false);
    }
  }

  async function postForm(urlPath, fd) {
    const res = await fetch(`${API_BASE}${urlPath}`, { method: 'POST', body: fd, credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({}));
    const url = pickFirstUrl(json);
    if (!url) throw new Error('No URL from upload');
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
      setForm((p) => ({ ...p, avatarUrl: url }));
      setMsg('Avatar mis à jour.');
    } catch (err) {
      // fallbacks
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
          try { url = await postForm(p, fallbackFd); break; } catch {}
        }
        if (!url) throw err;
        if (url && !/^https?:|^data:|^\//.test(url)) url = `/uploads/${url}`;
        setForm((p) => ({ ...p, avatarUrl: url }));
        setMsg('Avatar mis à jour.');
      } catch (finalErr) {
        console.error('avatar upload failed', finalErr);
        setMsg("Échec de l’upload de l’avatar.");
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeAvatar() {
    setForm((p) => ({ ...p, avatarUrl: '' }));
  }

  /* ---------------- render ---------------- */
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Mon tableau de bord</h1>
      <p className="mb-6">Bonjour {me?.email}</p>

      {msg && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {msg}
        </div>
      )}

      {/* 1) Show either compact profile (done) OR edit form */}
      {profileDone ? (
        <CompactProfileCard me={me} onEdit={() => setProfileDone(false)} />
      ) : (
        <section
          className="rounded-2xl p-6 border shadow-sm mb-8"
          style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
        >
          <h2 className="text-lg font-semibold text-emerald-900 mb-4">
            {me?.firstName || me?.lastName ? 'Compléter mon profil' : 'Créer mon profil'}
          </h2>

          <div className="flex items-start gap-5 mb-5">
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
                  {uploading ? 'Upload…' : 'Télécharger un avatar'}
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
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
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
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={onChange}
                rows={4}
                className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
              <input
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                placeholder="https://… ou /uploads/mon-avatar.jpg"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer mon profil'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 2) Choisir interface */}
      <div className="mb-6" ref={roleSectionRef}>
        <h3 className="font-semibold text-emerald-900 mb-3">Choisir mon interface</h3>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded ${role === 'OWNER' ? 'bg-green-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveRole('OWNER')}
          >
            J&apos;ai un jardin
          </button>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            className={`px-4 py-2 rounded ${role === 'GARDENER' ? 'bg-green-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveRole('GARDENER')}
          >
            Je suis jardinier
          </button>
        </div>
      </div>

      {/* 3) Actions selon rôle (use Link for internal routes to fix ESLint) */}
      {role === 'OWNER' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/add-garden" className="block p-4 rounded-lg border hover:bg-gray-50 transition">
            Ajouter mon jardin
          </Link>
          <Link href="/" className="block p-4 rounded-lg border hover:bg-gray-50 transition">
            Continuer sans ajouter mon jardin pour l&apos;instant :)
          </Link>
        </section>
      )}

      {role === 'GARDENER' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/add-gardener" className="block p-4 rounded-lg border hover:bg-gray-50 transition">
            Ajouter mon profil jardinier
          </Link>
          <Link href="/" className="block p-4 rounded-lg border hover:bg-gray-50 transition">
            Continuer sans ajouter mon profil jardinier
          </Link>
        </section>
      )}

      {!role && !loading && (
        <p className="text-gray-600">Sélectionnez une interface pour afficher les actions.</p>
      )}
    </div>
  );
}
