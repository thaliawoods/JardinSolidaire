'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND_GREEN = '#16a34a';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* ---------------- utils ---------------- */
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

/** Tell the navbar (and other tabs) about role changes */
function broadcastRoleChange(role) {
  try {
    window.dispatchEvent(new CustomEvent('role:changed', { detail: role }));
    window.postMessage({ type: 'role:changed', role }, '*');
    sessionStorage.setItem('role', role);
    localStorage.setItem('role', role);
  } catch {}
}

/* ---------------- small UI helpers ---------------- */
function Badge({ color = 'gray', children }) {
  const palette =
    color === 'green'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  return <span className={`text-xs px-2 py-1 rounded-full border ${palette}`}>{children}</span>;
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <p className="font-medium">{label}</p>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}

function SectionHeader({ title, avatarSrc, fallback, rightEl, children }) {
  return (
    <div className="flex items-start gap-5 mb-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarSrc || fallback}
        alt=""
        className="w-16 h-16 rounded-full object-cover shadow"
        style={{ border: '4px solid rgba(22,163,74,0.35)' }}
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />
      <div className="flex-1 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900">{title}</h2>
        <div className="flex items-center gap-2">
          {rightEl}
          {children}
        </div>
      </div>
    </div>
  );
}

function SoftCard({ children }) {
  return (
    <section
      className="rounded-2xl p-6 shadow-sm"
      style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}
    >
      {children}
    </section>
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
          onError={(e) => {
            e.currentTarget.src = fallback;
          }}
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nom</span>
              <span className="font-medium text-gray-900">{me?.lastName || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Prénom</span>
              <span className="font-medium text-gray-900">{me?.firstName || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{me?.email || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Téléphone</span>
              <span className="font-medium text-gray-900">{me?.phone || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm sm:col-span-2">
              <span className="text-gray-600">Adresse</span>
              <span className="font-medium text-gray-900">{me?.address || '—'}</span>
            </div>
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

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
    </div>
  );
}

/* ---------------- helpers to qualify profiles ---------------- */

/**
 * Normalize gardener/owner references and decide if they contain meaningful data.
 * - For GARDENER: any of the listed fields can qualify the profile as “existing”.
 * - For OWNER: we **exclude** first/lastName from the signal because backends often
 *             prefill those from the base user; we require at least one owner-specific field.
 */
function normalizeProfile(p, kind) {
  if (!p || typeof p !== 'object') return null;

  if (kind === 'gardener') {
    const gardenerKeys = [
      'intro',
      'location',
      'yearsExperience',
      'skills',
      'rating',
      'avatarUrl',
      'photo_profil',
      'avatar',
    ];
    const meaningful =
      gardenerKeys.some((k) => {
        const v = p[k];
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== null && String(v).trim() !== '';
      }) ||
      // sometimes only names are set but that’s still OK for gardener bootstrap
      !!((p.firstName && p.firstName.trim()) || (p.lastName && p.lastName.trim()));

    return meaningful ? p : null;
  }

  // OWNER
  const ownerKeys = [
    'district',
    'availability',
    'area',
    'kind',
    'intro',
    'description',
    'rating',
    'avatarUrl',
    'photo_profil',
    'avatar',
  ];
  const meaningful = ownerKeys.some((k) => {
    const v = p[k];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && String(v).trim() !== '';
  });

  // NOTE: firstName/lastName intentionally ignored for owners.
  return meaningful ? p : null;
}

/* ---------------- page ---------------- */
export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  // first-time user form
  const [showUserForm, setShowUserForm] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatarUrl: '',
  });

  const roleSectionRef = useRef(null);

  /** Normalize API me => always have me.gardener / me.owner (or null) */
  function normalizeUser(u) {
    if (!u) return null;

    const gardenerRaw = u.gardener ?? u.jardinier ?? null;
    const ownerRaw = u.owner ?? u.proprietaire ?? null;

    return {
      ...u,
      gardener: normalizeProfile(gardenerRaw, 'gardener'),
      owner: normalizeProfile(ownerRaw, 'owner'),
    };
  }

  const loadMe = useCallback(async () => {
    const r = await apiFetch('/api/me');
    const uRaw = r?.user || r;
    const u = normalizeUser(uRaw);
    setMe(u || null);
    setRole(u?.role || sessionStorage.getItem('role') || localStorage.getItem('role') || null);

    setForm({
      firstName: u?.firstName || '',
      lastName: u?.lastName || '',
      email: u?.email || '',
      phone: u?.phone || '',
      address: u?.address || '',
      bio: u?.bio || '',
      avatarUrl: u?.avatarUrl || u?.photo_profil || u?.avatar || '',
    });

    const justReg = typeof window !== 'undefined' ? localStorage.getItem('justRegistered') : null;
    const hasAny =
      !!(u?.firstName || u?.lastName || u?.phone || u?.address || u?.bio || u?.avatarUrl);
    setShowUserForm(justReg === '1' && !hasAny);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadMe();
      } finally {
        setLoading(false);
      }
    })();

    const onVisibility = async () => {
      if (document.visibilityState === 'visible') {
        const g = localStorage.getItem('gardenerUpdated');
        const o = localStorage.getItem('ownerUpdated');
        if (g || o) {
          await loadMe();
          if (g) localStorage.removeItem('gardenerUpdated');
          if (o) localStorage.removeItem('ownerUpdated');
        }
      }
    };

    const onStorage = async (e) => {
      if (!e) return;
      if (e.key === 'gardenerUpdated' || e.key === 'ownerUpdated') {
        await loadMe();
      }
      if (e.key === 'role') {
        setRole(e.newValue || null);
      }
    };

    window.addEventListener('focus', onVisibility);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('focus', onVisibility);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadMe]);

  /* -------- role switching -------- */
  async function setActiveRole(next) {
    try {
      await apiFetch('/api/me/role', { method: 'PUT', body: { role: next } });
      setRole(next);
      broadcastRoleChange(next);
      setMsg(`Mode: ${next === 'OWNER' ? 'Propriétaire' : 'Jardinier'}`);
    } catch {
      setMsg("Impossible de changer d’interface.");
    }
  }

  /* -------- user form -------- */
  const onUserChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  async function saveUser(e) {
    e.preventDefault();
    setMsg('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setMsg('Prénom et nom sont requis.');
      return;
    }

    try {
      setSavingUser(true);
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

      localStorage.removeItem('justRegistered');

      await loadMe();
      setShowUserForm(false);

      setTimeout(() => {
        roleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } finally {
      setSavingUser(false);
    }
  }

  /* -------- publish toggles -------- */
  async function togglePublish(kind, next) {
    try {
      setBusy(true);
      if (kind === 'gardener') {
        await apiFetch('/api/me/gardener/publish', { method: 'POST', body: { published: !!next } });
      } else {
        await apiFetch('/api/me/owner/publish', { method: 'POST', body: { published: !!next } });
      }
      await loadMe();
    } finally {
      setBusy(false);
    }
  }

  /* -------- avatars -------- */
  const userFallback = useMemo(() => greenAvatar(me?.firstName, me?.lastName), [me?.firstName, me?.lastName]);
  const gardenerAvatar = useMemo(
    () => resolveMedia(me?.gardener?.avatarUrl || me?.gardener?.photo_profil || me?.gardener?.avatar),
    [me?.gardener]
  );
  const gardenerFallback = useMemo(
    () => greenAvatar(me?.gardener?.firstName, me?.gardener?.lastName),
    [me?.gardener?.firstName, me?.gardener?.lastName]
  );
  const ownerAvatar = useMemo(
    () => resolveMedia(me?.owner?.avatarUrl || me?.owner?.photo_profil || me?.owner?.avatar),
    [me?.owner]
  );
  const ownerFallback = useMemo(
    () => greenAvatar(me?.owner?.firstName, me?.owner?.lastName),
    [me?.owner?.firstName, me?.owner?.lastName]
  );

  /* ---------------- render ---------------- */
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Mon tableau de bord</h1>
      {msg && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {msg}
        </div>
      )}

      {loading && <Skeleton />}

      {!loading && me && (
        <>
          {/* Mode selector */}
          <div className="text-center my-6" ref={roleSectionRef}>
            <h3 className="text-emerald-900 font-semibold mb-3">Choisis ton mode</h3>
            <div className="inline-flex items-center bg-emerald-600/10 border border-emerald-600/20 rounded-full p-1">
              <button
                onClick={() => setActiveRole('OWNER')}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  role === 'OWNER' ? 'bg-pink-500 text-white' : 'hover:bg-white/60'
                }`}
              >
                Propriétaire
              </button>
              <button
                onClick={() => setActiveRole('GARDENER')}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  role === 'GARDENER' ? 'bg-pink-500 text-white' : 'hover:bg-white/60'
                }`}
              >
                Jardinier
              </button>
            </div>
          </div>

          {/* User profile (first-time form else compact card) */}
          {showUserForm ? (
            <section
              className="rounded-2xl p-6 border shadow-sm mb-8"
              style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.15)' }}
            >
              <h2 className="text-lg font-semibold text-emerald-900 mb-4">Créer mon profil</h2>

              <form onSubmit={saveUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onUserChange}
                    className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onUserChange}
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
                    onChange={onUserChange}
                    className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onUserChange}
                    className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={onUserChange}
                    rows={4}
                    className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={onUserChange}
                    className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                    placeholder="https://… ou /uploads/mon-avatar.jpg"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={savingUser}
                    className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
                  >
                    {savingUser ? 'Enregistrement…' : 'Enregistrer mon profil'}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <CompactProfileCard me={me} onEdit={() => setShowUserForm(true)} />
          )}

          {/* Gardener */}
          <SoftCard>
            <SectionHeader
              title="Profil du jardinier"
              avatarSrc={gardenerAvatar}
              fallback={gardenerFallback}
              rightEl={
                me?.gardener ? (
                  me.gardener.published ? <Badge color="green">Publié</Badge> : <Badge color="gray">Non publié</Badge>
                ) : null
              }
            >
              {me?.gardener && (
                <Link
                  href="/edit-gardener"
                  className="px-3 py-1.5 rounded-full text-sm bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                  style={{ color: BRAND_GREEN }}
                >
                  Modifier
                </Link>
              )}
            </SectionHeader>

            {!me?.gardener ? (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">Pas de profil de jardinier encore.</p>
                <Link
                  href="/edit-gardener"
                  className="px-4 py-2 rounded-full bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                  style={{ color: BRAND_GREEN }}
                >
                  Créer ton profil jardinier
                </Link>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Nom complet">
                    {me.gardener.firstName} {me.gardener.lastName}
                  </Field>
                  <Field label="Adresse">{me.gardener.location || '—'}</Field>
                  <Field label="Compétences" full>{(me.gardener.skills || []).join(', ') || '—'}</Field>
                  <Field label="Expérience (années)">{me.gardener.yearsExperience ?? '—'}</Field>
                  <Field label="Note">{me.gardener.rating ?? '—'}</Field>
                  <Field label="Introduction" full>{me.gardener.intro || '—'}</Field>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/edit-gardener"
                    className="px-4 py-2 rounded-full bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                    style={{ color: BRAND_GREEN }}
                  >
                    Modifier
                  </Link>

                  <button
                    disabled={busy}
                    onClick={() => togglePublish('gardener', !me.gardener.published)}
                    className="px-4 py-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-60 transition"
                  >
                    {me.gardener.published ? 'Retirer' : 'Publier'}
                  </button>
                </div>
              </>
            )}
          </SoftCard>

          {/* Owner */}
          <SoftCard>
            <SectionHeader
              title="Profil Propriétaire"
              avatarSrc={ownerAvatar}
              fallback={ownerFallback}
              rightEl={
                me?.owner ? (
                  me.owner.published ? <Badge color="green">Publié</Badge> : <Badge color="gray">Non publié</Badge>
                ) : null
              }
            >
              {me?.owner && (
                <Link
                  href="/edit-owner"
                  className="px-3 py-1.5 rounded-full text-sm bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                  style={{ color: BRAND_GREEN }}
                >
                  Modifier
                </Link>
              )}
            </SectionHeader>

            {!me?.owner ? (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">Pas de profil de propriétaire encore.</p>
                <Link
                  href="/edit-owner"
                  className="px-4 py-2 rounded-full bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                  style={{ color: BRAND_GREEN }}
                >
                  Créer ton profil propriétaire
                </Link>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Nom complet">
                    {me.owner.firstName} {me.owner.lastName}
                  </Field>
                  <Field label="Quartier">{me.owner.district || '—'}</Field>
                  <Field label="Disponibilité">{me.owner.availability || '—'}</Field>
                  <Field label="Surface">{me.owner.area ? `${me.owner.area} m²` : '—'}</Field>
                  <Field label="Type de jardin">{me.owner.kind || '—'}</Field>
                  <Field label="Introduction" full>{me.owner.intro || '—'}</Field>
                  <Field label="Description" full>{me.owner.description || '—'}</Field>
                  <Field label="Note">{me.owner.rating ?? '—'}</Field>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/edit-owner"
                    className="px-4 py-2 rounded-full bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                    style={{ color: BRAND_GREEN }}
                  >
                    Modifier
                  </Link>

                  <button
                    disabled={busy}
                    onClick={() => togglePublish('owner', !me.owner.published)}
                    className="px-4 py-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-60 transition"
                  >
                    {me.owner.published ? 'Retirer' : 'Publier'}
                  </button>
                </div>
              </>
            )}
          </SoftCard>
        </>
      )}
    </main>
  );
}
