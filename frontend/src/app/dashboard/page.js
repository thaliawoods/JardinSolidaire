'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { uploadImage } from '@/lib/uploads';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

export const dynamic = 'force-dynamic';

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

/** Tell navbar + other tabs about role changes */
function broadcastRoleChange(role) {
  try {
    window.dispatchEvent(new CustomEvent('role:changed', { detail: role }));
    window.postMessage({ type: 'role:changed', role }, '*');
    sessionStorage.setItem('role', role);
    localStorage.setItem('role', role);
  } catch {}
}

/* ---------------- small UI helpers (same vibe as gardens) ---------------- */
function Card({ children, className = '' }) {
  return (
    <section className={`rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 bg-white ${className}`}>
      <div className="p-6">{children}</div>
    </section>
  );
}

function SoftTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}

function Pill({ children }) {
  return (
    <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-800 ring-1 ring-green-200">
      {children}
    </span>
  );
}

function MutedPill({ children }) {
  return (
    <span className="rounded-full px-3 py-1 text-xs font-medium bg-gray-50 text-gray-700 ring-1 ring-gray-200">
      {children}
    </span>
  );
}

function TextBtn({ href, children }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition text-sm shadow-sm"
    >
      {children}
    </Link>
  );
}

function PrimaryBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60 ${
        props.className || ''
      }`}
    >
      {children}
    </button>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-full border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700 ${className}`}
    />
  );
}

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700 ${className}`}
    />
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
      {children}
    </label>
  );
}

function InfoGrid({ children }) {
  return <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-gray-900 break-words">{value || '—'}</div>
    </div>
  );
}

function InfoFull({ label, children }) {
  return (
    <div className="sm:col-span-2 rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-900">{children}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
    </div>
  );
}

/* ---------------- helpers to qualify profiles ---------------- */
function normalizeProfile(p, kind) {
  if (!p || typeof p !== 'object') return null;

  if (kind === 'gardener') {
    const gardenerKeys = [
      'intro',
      'location',
      'yearsExperience',
      'skills',
      // ❌ rating removed
      'avatarUrl',
      'photo_profil',
      'avatar',
      'published',
    ];
    const meaningful =
      gardenerKeys.some((k) => {
        const v = p[k];
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== null && String(v).trim() !== '';
      }) ||
      !!((p.firstName && p.firstName.trim()) || (p.lastName && p.lastName.trim()));
    return meaningful ? p : null;
  }

  const ownerKeys = [
    'district',
    'availability',
    'area',
    'kind',
    'intro',
    'description',
    // ❌ rating removed
    'avatarUrl',
    'photo_profil',
    'avatar',
    'published',
  ];
  const meaningful = ownerKeys.some((k) => {
    const v = p[k];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && String(v).trim() !== '';
  });
  return meaningful ? p : null;
}

/* ---------------- validators ---------------- */
function isValidPhone(phone) {
  if (!phone) return true; // optional
  const p = String(phone).trim();
  if (!p) return true;
  const digits = p.replace(/\D/g, '');
  if (digits.length < 6) return false;
  if (!/^[0-9+\s().-]+$/.test(p)) return false;
  return true;
}

function clampText(s, max) {
  const v = String(s || '');
  return v.length > max ? v.slice(0, max) : v;
}

/* ---------------- page ---------------- */
export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const [showUserForm, setShowUserForm] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    const hasAny = !!(u?.firstName || u?.lastName || u?.phone || u?.address || u?.bio || u?.avatarUrl);
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
        const u = localStorage.getItem('userUpdated');
        if (g || o || u) {
          await loadMe();
          if (g) localStorage.removeItem('gardenerUpdated');
          if (o) localStorage.removeItem('ownerUpdated');
          if (u) localStorage.removeItem('userUpdated');
        }
      }
    };

    const onStorage = async (e) => {
      if (!e) return;
      if (e.key === 'gardenerUpdated' || e.key === 'ownerUpdated' || e.key === 'userUpdated') {
        await loadMe();
      }
      if (e.key === 'role') setRole(e.newValue || null);
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
      setMsg(`Mode : ${next === 'OWNER' ? 'Propriétaire' : 'Jardinier'}`);
    } catch {
      setMsg("Impossible de changer d’interface.");
    }
  }

  /* -------- user form -------- */
  const onUserChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  function broadcastUserUpdated() {
    try {
      localStorage.setItem('userUpdated', String(Date.now()));
      setTimeout(() => localStorage.removeItem('userUpdated'), 500);
    } catch {}
  }

  async function propagateAvatar(path) {
    try {
      const meNow = await apiFetch('/api/me');
      const user = meNow?.user || meNow || {};
      const tasks = [];

      tasks.push(apiFetch('/api/me/profile', { method: 'POST', body: { avatarUrl: path } }));

      if (user?.gardener || user?.jardinier) {
        tasks.push(apiFetch('/api/me/gardener', { method: 'POST', body: { avatarUrl: path } }));
      }
      if (user?.owner || user?.proprietaire) {
        tasks.push(apiFetch('/api/me/owner', { method: 'POST', body: { avatarUrl: path } }));
      }

      await Promise.allSettled(tasks);

      broadcastUserUpdated();
      try {
        localStorage.setItem('gardenerUpdated', String(Date.now()));
        localStorage.setItem('ownerUpdated', String(Date.now()));
        setTimeout(() => {
          localStorage.removeItem('gardenerUpdated');
          localStorage.removeItem('ownerUpdated');
        }, 400);
      } catch {}
    } catch (e) {
      console.warn('propagateAvatar failed:', e);
    }
  }

  async function onAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (/\.heic$/i.test(file.name)) {
      setMsg("Ton fichier est au format HEIC (iPhone). Convertis-le en JPG/PNG/WebP avant l’upload.");
      return;
    }

    setUploading(true);
    setMsg('');
    try {
      const { path } = await uploadImage(file);

      setForm((p) => ({ ...p, avatarUrl: path }));

      await apiFetch('/api/me/profile', {
        method: 'POST',
        body: {
          firstName: (form.firstName || '').trim(),
          lastName: (form.lastName || '').trim(),
          phone: (form.phone || '').trim(),
          address: clampText(form.address, 140).trim(),
          bio: clampText(form.bio, 400).trim(),
          avatarUrl: path,
        },
      });

      await propagateAvatar(path);
      await loadMe();

      setMsg('Avatar mis à jour ✔');
    } catch (e2) {
      console.error(e2);
      setMsg("Échec de l’upload. Utilise JPG/PNG/WebP et vérifie /api/uploads.");
    } finally {
      setUploading(false);
    }
  }

  async function saveUser(e) {
    e.preventDefault();
    setMsg('');

    const fn = (form.firstName || '').trim();
    const ln = (form.lastName || '').trim();
    const phone = (form.phone || '').trim();

    if (!fn || !ln) {
      setMsg('Prénom et nom sont requis.');
      return;
    }
    if (!isValidPhone(phone)) {
      setMsg("Téléphone invalide. Utilise uniquement chiffres, espaces, +, (), - et au moins 6 chiffres.");
      return;
    }

    try {
      setSavingUser(true);

      await apiFetch('/api/me/profile', {
        method: 'POST',
        body: {
          firstName: fn,
          lastName: ln,
          phone,
          address: clampText(form.address, 140).trim(),
          bio: clampText(form.bio, 400).trim(),
          avatarUrl: (form.avatarUrl || '').trim(),
        },
      });

      localStorage.removeItem('justRegistered');

      if (form.avatarUrl) await propagateAvatar(form.avatarUrl);

      await loadMe();
      broadcastUserUpdated();

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

  const userFallback = useMemo(() => greenAvatar(me?.firstName, me?.lastName), [me?.firstName, me?.lastName]);
  const avatarSrc = useMemo(
    () => resolveMedia(me?.avatarUrl || me?.photo_profil || me?.avatar),
    [me?.avatarUrl, me?.photo_profil, me?.avatar]
  );

  const hasIdentity = useMemo(() => !!(me?.firstName?.trim() && me?.lastName?.trim()), [me?.firstName, me?.lastName]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700">Mon tableau de bord</h1>
          <TextBtn href="/">Accueil</TextBtn>
        </div>

        {msg && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 whitespace-pre-wrap">
            {msg}
          </div>
        )}

        {loading && <Skeleton />}

        {!loading && me && (
          <>
            {/* Mode selector (gardens-like pill) */}
            <div className="text-center mb-8" ref={roleSectionRef}>
              <div className="inline-flex flex-col items-center gap-3">
                <div className="text-sm font-semibold text-gray-800">Choisis ton mode</div>
                <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                  <button
                    onClick={() => setActiveRole('OWNER')}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      role === 'OWNER' ? 'bg-pink-500 text-white' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    Propriétaire
                  </button>
                  <button
                    onClick={() => setActiveRole('GARDENER')}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      role === 'GARDENER' ? 'bg-pink-500 text-white' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    Jardinier.e
                  </button>
                </div>
              </div>
            </div>

            {/* USER PROFILE */}
            <Card className="mb-8">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc || userFallback}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover shadow ring-1 ring-black/5"
                  onError={(e) => {
                    e.currentTarget.src = userFallback;
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <SoftTitle>Mon profil (compte)</SoftTitle>
                    {!showUserForm && (
                      <button
                        onClick={() => setShowUserForm(true)}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm"
                      >
                        Modifier
                      </button>
                    )}
                  </div>

                  {!showUserForm ? (
                    <InfoGrid>
                      <InfoRow label="Nom" value={me?.lastName} />
                      <InfoRow label="Prénom" value={me?.firstName} />
                      <InfoRow label="Email" value={me?.email} />
                      <InfoRow label="Téléphone" value={me?.phone} />
                      <InfoRow label="Adresse" value={me?.address} />
                      <InfoFull label="Bio">
                        <div className="whitespace-pre-wrap">{me?.bio || '—'}</div>
                      </InfoFull>

                      {!hasIdentity && (
                        <div className="sm:col-span-2">
                          <div className="mt-1 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                            Ajoute ton <b>prénom</b> et ton <b>nom</b> une seule fois ici : ensuite on les réutilise
                            automatiquement pour Propriétaire / Jardinier.e.
                          </div>
                        </div>
                      )}
                    </InfoGrid>
                  ) : (
                    <form onSubmit={saveUser} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Prénom">
                        <Input name="firstName" value={form.firstName} onChange={onUserChange} required />
                      </Field>
                      <Field label="Nom">
                        <Input name="lastName" value={form.lastName} onChange={onUserChange} required />
                      </Field>

                      <Field label="Email">
                        <Input name="email" value={form.email} disabled className="bg-gray-50 text-gray-500" />
                      </Field>

                      <Field label="Téléphone (optionnel)">
                        <Input
                          name="phone"
                          value={form.phone}
                          onChange={onUserChange}
                          placeholder="06 12 34 56 78"
                          inputMode="tel"
                        />
                        <div className="mt-1 text-xs text-gray-500">Chiffres + espaces + + ( ) -</div>
                      </Field>

                      <Field label="Adresse (optionnel)">
                        <Input name="address" value={form.address} onChange={onUserChange} placeholder="Paris…" />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Bio (optionnel)">
                          <Textarea
                            name="bio"
                            value={form.bio}
                            onChange={onUserChange}
                            rows={4}
                            placeholder="Quelques lignes sur toi…"
                          />
                          <div className="mt-1 text-xs text-gray-500">{String(form.bio || '').length}/400</div>
                        </Field>
                      </div>

                      <div className="sm:col-span-2">
                        <Field label="Avatar">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveMedia(form.avatarUrl) || greenAvatar(form.firstName, form.lastName)}
                              alt=""
                              className="w-12 h-12 rounded-full object-cover shadow ring-1 ring-black/5"
                              onError={(e) => {
                                e.currentTarget.src = greenAvatar(form.firstName, form.lastName);
                              }}
                            />
                            <input type="file" accept="image/*" onChange={onAvatarFile} className="text-sm" />
                          </div>

                          <Input
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={onUserChange}
                            className="mt-3"
                            placeholder="https://… ou /uploads/mon-avatar.jpg"
                          />
                          {uploading && <div className="text-xs text-gray-500 mt-2">Téléversement…</div>}
                        </Field>
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                        <PrimaryBtn type="submit" disabled={savingUser}>
                          {savingUser ? 'Enregistrement…' : 'Enregistrer'}
                        </PrimaryBtn>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserForm(false);
                            setMsg('');
                          }}
                          className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Card>

            {/* GARDENER CARD */}
            <Card className="mb-6">
              <div className="flex items-center justify-between gap-3">
                <SoftTitle>Profil Jardinier.e</SoftTitle>
                <div className="flex items-center gap-2">
                  {me?.gardener ? (
                    me.gardener.published ? <Pill>Publié</Pill> : <MutedPill>Non publié</MutedPill>
                  ) : (
                    <MutedPill>Non créé</MutedPill>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                {me?.gardener ? (
                  <InfoGrid>
                    <InfoRow label="Identité" value={`${me.firstName || ''} ${me.lastName || ''}`.trim()} />
                    <InfoRow label="Adresse" value={me.gardener.location} />

                    <InfoFull label="Compétences">
                      {(me.gardener.skills || []).length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {me.gardener.skills.slice(0, 10).map((s) => (
                            <span
                              key={s}
                              className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-800 ring-1 ring-green-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </InfoFull>

                    <InfoRow label="Expérience" value={me.gardener.yearsExperience ?? '—'} />

                    <InfoFull label="Intro">
                      <div className="whitespace-pre-wrap">{me.gardener.intro || '—'}</div>
                    </InfoFull>
                  </InfoGrid>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between gap-3">
                    <div className="text-gray-700">Pas de profil jardinier.e encore.</div>
                    <Link
                      href="/edit-gardener"
                      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm"
                    >
                      Créer mon profil jardinier.e
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/edit-gardener"
                  className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm"
                >
                  {me?.gardener ? 'Modifier' : 'Créer'}
                </Link>

                {me?.gardener && (
                  <PrimaryBtn
                    type="button"
                    disabled={busy || !hasIdentity}
                    onClick={() => togglePublish('gardener', !me.gardener.published)}
                    title={!hasIdentity ? 'Ajoute prénom/nom dans le profil compte d’abord' : ''}
                  >
                    {me.gardener.published ? 'Retirer' : 'Publier'}
                  </PrimaryBtn>
                )}

                {!hasIdentity && (
                  <span className="text-xs text-gray-500">(publier nécessite prénom/nom côté compte)</span>
                )}
              </div>
            </Card>

            {/* OWNER CARD */}
            <Card>
              <div className="flex items-center justify-between gap-3">
                <SoftTitle>Profil Propriétaire</SoftTitle>
                <div className="flex items-center gap-2">
                  {me?.owner ? (
                    me.owner.published ? <Pill>Publié</Pill> : <MutedPill>Non publié</MutedPill>
                  ) : (
                    <MutedPill>Non créé</MutedPill>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                {me?.owner ? (
                  <InfoGrid>
                    <InfoRow label="Identité" value={`${me.firstName || ''} ${me.lastName || ''}`.trim()} />
                    <InfoRow label="Quartier" value={me.owner.district} />
                    <InfoRow label="Disponibilité" value={me.owner.availability} />
                    <InfoRow label="Surface" value={me.owner.area ? `${me.owner.area} m²` : '—'} />
                    <InfoRow label="Type de jardin" value={me.owner.kind} />

                    <InfoFull label="Intro">
                      <div className="whitespace-pre-wrap">{me.owner.intro || '—'}</div>
                    </InfoFull>

                    <InfoFull label="Description">
                      <div className="whitespace-pre-wrap">{me.owner.description || '—'}</div>
                    </InfoFull>
                  </InfoGrid>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between gap-3">
                    <div className="text-gray-700">Pas de profil propriétaire encore.</div>
                    <Link
                      href="/edit-owner"
                      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm"
                    >
                      Créer mon profil propriétaire
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/edit-owner"
                  className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm"
                >
                  {me?.owner ? 'Modifier' : 'Créer'}
                </Link>

                {me?.owner && (
                  <PrimaryBtn
                    type="button"
                    disabled={busy || !hasIdentity}
                    onClick={() => togglePublish('owner', !me.owner.published)}
                    title={!hasIdentity ? 'Ajoute prénom/nom dans le profil compte d’abord' : ''}
                  >
                    {me.owner.published ? 'Retirer' : 'Publier'}
                  </PrimaryBtn>
                )}

                {!hasIdentity && (
                  <span className="text-xs text-gray-500">(publier nécessite prénom/nom côté compte)</span>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
