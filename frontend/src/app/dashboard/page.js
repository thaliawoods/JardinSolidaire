'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { clearAuth } from '@/lib/auth';
import { uploadImage } from '@/lib/uploads';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

export const dynamic = 'force-dynamic';

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
    <rect width="256" height="256" fill="#2d6a4f"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function broadcastRoleChange(role) {
  try {
    window.dispatchEvent(new CustomEvent('role:changed', { detail: role }));
    window.postMessage({ type: 'role:changed', role }, '*');
    sessionStorage.setItem('role', role);
    localStorage.setItem('role', role);
  } catch {}
}

function normalizeProfile(p) {
  if (!p || typeof p !== 'object') return null;
  return p;
}

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

export default function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success'); // 'success' | 'error'
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
      gardener: normalizeProfile(gardenerRaw),
      owner: normalizeProfile(ownerRaw),
    };
  }

  function flash(message, type = 'success') {
    setMsg(message);
    setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  }

  const loadMe = useCallback(async () => {
    let r;
    try {
      r = await apiFetch('/api/me');
    } catch (e) {
      if (e?.status === 401) {
        router.replace('/login');
        return;
      }
      throw e;
    }
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

  async function setActiveRole(next) {
    try {
      await apiFetch('/api/me/role', { method: 'PUT', body: { role: next } });
      setRole(next);
      broadcastRoleChange(next);
      await loadMe();
      flash(`Mode : ${next === 'OWNER' ? 'Propriétaire' : 'Jardinier·e'} activé`);
    } catch {
      flash("Impossible de changer d'interface.", 'error');
    }
  }

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
      flash("Ton fichier est au format HEIC (iPhone). Convertis-le en JPG/PNG/WebP avant l'upload.", 'error');
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

      flash('Avatar mis à jour ✔');
    } catch (e2) {
      console.error(e2);
      flash("Échec de l'upload. Utilise JPG/PNG/WebP et vérifie /api/uploads.", 'error');
    } finally {
      setUploading(false);
    }
  }

  async function saveUser(e) {
    e.preventDefault();

    const fn = (form.firstName || '').trim();
    const ln = (form.lastName || '').trim();
    const phone = (form.phone || '').trim();

    if (!fn || !ln) {
      flash('Prénom et nom sont requis.', 'error');
      return;
    }
    if (!isValidPhone(phone)) {
      flash("Téléphone invalide. Utilise uniquement chiffres, espaces, +, (), - et au moins 6 chiffres.", 'error');
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
      flash('Profil enregistré ✔');

      setTimeout(() => {
        roleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } finally {
      setSavingUser(false);
    }
  }

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

  const s = {
    page: {
      minHeight: '100vh',
      background: '#fff',
      padding: '3rem 1.5rem',
    },
    inner: {
      maxWidth: '860px',
      margin: '0 auto',
    },
    topRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '2rem',
    },
    h1: {
      fontFamily: 'var(--font-display)',
      fontSize: '2rem',
      fontWeight: 400,
      color: 'var(--foreground)',
      margin: 0,
    },
    topActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    flatBtn: {
      padding: '0.5rem 1rem',
      border: '1px solid var(--border)',
      background: '#fff',
      color: 'var(--foreground)',
      fontSize: '0.875rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      lineHeight: 1.5,
    },
    primaryBtn: {
      padding: '0.5rem 1.25rem',
      border: '1px solid var(--foreground)',
      background: 'var(--foreground)',
      color: '#fff',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'inline-block',
      lineHeight: 1.5,
    },
    primaryBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    flash: (type) => ({
      marginBottom: '1.5rem',
      border: '1px solid var(--border)',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      whiteSpace: 'pre-wrap',
      color: type === 'error' ? 'var(--foreground)' : 'var(--green)',
      background: '#fff',
    }),
    skeleton: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    skeletonBlock: (h) => ({
      height: h,
      background: '#f3f4f6',
      border: '1px solid var(--border)',
    }),
    modeRow: {
      textAlign: 'center',
      marginBottom: '2.5rem',
    },
    modeLabel: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--muted)',
      marginBottom: '0.5rem',
    },
    modeBtns: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.9375rem',
    },
    modeBtn: (active) => ({
      background: 'none',
      border: 'none',
      padding: '0.25rem 0.125rem',
      cursor: 'pointer',
      color: 'var(--foreground)',
      fontSize: '0.9375rem',
      fontFamily: 'inherit',
      textDecoration: active ? 'underline' : 'none',
      textUnderlineOffset: '3px',
    }),
    modeSep: {
      color: 'var(--muted)',
      padding: '0 0.375rem',
      userSelect: 'none',
    },
    section: {
      border: '1px solid var(--border)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      background: '#fff',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      marginBottom: '1.25rem',
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.1rem',
      fontWeight: 400,
      color: 'var(--foreground)',
      margin: 0,
    },
    badgeRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    badge: {
      display: 'inline-block',
      border: '1px solid var(--border)',
      padding: '0.125rem 0.5rem',
      fontSize: '0.6875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: 'var(--muted)',
      background: '#fff',
    },
    profileTop: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    avatar: {
      width: '4rem',
      height: '4rem',
      objectFit: 'cover',
      border: '1px solid var(--border)',
      flexShrink: 0,
      display: 'block',
    },
    avatarSm: {
      width: '3rem',
      height: '3rem',
      objectFit: 'cover',
      border: '1px solid var(--border)',
      display: 'block',
      flexShrink: 0,
    },
    profileBody: {
      flex: 1,
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.75rem',
      marginTop: '1rem',
    },
    infoCell: {
      border: '1px solid var(--border)',
      padding: '0.625rem 0.875rem',
      background: '#fff',
    },
    infoCellFull: {
      gridColumn: '1 / -1',
      border: '1px solid var(--border)',
      padding: '0.625rem 0.875rem',
      background: '#fff',
    },
    infoLabel: {
      fontSize: '0.6875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: 'var(--muted)',
      marginBottom: '0.25rem',
    },
    infoValue: {
      fontSize: '0.875rem',
      color: 'var(--foreground)',
      wordBreak: 'break-word',
    },
    noProfile: {
      border: '1px solid var(--border)',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      background: '#fff',
    },
    noProfileText: {
      fontSize: '0.875rem',
      color: 'var(--muted)',
    },
    actionRow: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.75rem',
      marginTop: '1.25rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid var(--border)',
    },
    skillTag: {
      display: 'inline-block',
      border: '1px solid var(--border)',
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
      color: 'var(--foreground)',
      background: '#fff',
    },
    skillWrap: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.375rem',
      marginTop: '0.375rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginTop: '1rem',
    },
    formColSpan2: {
      gridColumn: '1 / -1',
    },
    fieldLabel: {
      display: 'block',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: 'var(--muted)',
      marginBottom: '0.375rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid var(--border)',
      background: '#fff',
      color: 'var(--foreground)',
      fontSize: '0.875rem',
      outline: 'none',
      boxSizing: 'border-box',
    },
    inputDisabled: {
      background: '#fafafa',
      color: 'var(--muted)',
    },
    textarea: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid var(--border)',
      background: '#fff',
      color: 'var(--foreground)',
      fontSize: '0.875rem',
      outline: 'none',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    },
    hint: {
      fontSize: '0.75rem',
      color: 'var(--muted)',
      marginTop: '0.25rem',
    },
    avatarUploadRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    noIdentityNote: {
      border: '1px solid var(--border)',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      color: 'var(--muted)',
      background: '#fff',
      marginTop: '0.5rem',
    },
    mutedNote: {
      fontSize: '0.75rem',
      color: 'var(--muted)',
    },
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* Top bar */}
        <div style={s.topRow}>
          <h1 style={s.h1}>Mon tableau de bord</h1>
        </div>

        {/* Flash message */}
        {msg && (
          <div style={s.flash(msgType)}>
            {msg}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div style={s.skeleton}>
            <div style={s.skeletonBlock('5rem')} />
            <div style={s.skeletonBlock('10rem')} />
            <div style={s.skeletonBlock('10rem')} />
          </div>
        )}

        {!loading && me && (
          <>
            {/* Mode selector */}
            <div style={s.modeRow} ref={roleSectionRef}>
              <div style={s.modeLabel}>Choisis ton mode</div>
              <div style={s.modeBtns}>
                <button
                  style={s.modeBtn(role === 'OWNER')}
                  onClick={() => setActiveRole('OWNER')}
                >
                  Propriétaire
                </button>
                <span style={s.modeSep} aria-hidden>/</span>
                <button
                  style={s.modeBtn(role === 'GARDENER')}
                  onClick={() => setActiveRole('GARDENER')}
                >
                  Jardinier·e
                </button>
              </div>
            </div>

            {/* USER PROFILE */}
            <div style={s.section}>
              <div style={s.profileTop}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc || userFallback}
                  alt=""
                  style={s.avatar}
                  onError={(e) => { e.currentTarget.src = userFallback; }}
                />
                <div style={s.profileBody}>
                  <div style={s.sectionHeader}>
                    <h2 style={s.h2}>Mon profil (compte)</h2>
                    {!showUserForm && (
                      <button
                        style={s.flatBtn}
                        onClick={() => setShowUserForm(true)}
                      >
                        Modifier
                      </button>
                    )}
                  </div>

                  {!showUserForm ? (
                    <>
                      <div style={s.infoGrid}>
                        <div style={s.infoCell}>
                          <div style={s.infoLabel}>Nom</div>
                          <div style={s.infoValue}>{me?.lastName || '—'}</div>
                        </div>
                        <div style={s.infoCell}>
                          <div style={s.infoLabel}>Prénom</div>
                          <div style={s.infoValue}>{me?.firstName || '—'}</div>
                        </div>
                        <div style={s.infoCell}>
                          <div style={s.infoLabel}>Email</div>
                          <div style={s.infoValue}>{me?.email || '—'}</div>
                        </div>
                        <div style={s.infoCell}>
                          <div style={s.infoLabel}>Téléphone</div>
                          <div style={s.infoValue}>{me?.phone || '—'}</div>
                        </div>
                        <div style={s.infoCell}>
                          <div style={s.infoLabel}>Adresse</div>
                          <div style={s.infoValue}>{me?.address || '—'}</div>
                        </div>
                        <div style={s.infoCellFull}>
                          <div style={s.infoLabel}>Bio</div>
                          <div style={{ ...s.infoValue, whiteSpace: 'pre-wrap' }}>{me?.bio || '—'}</div>
                        </div>
                      </div>

                      {!hasIdentity && (
                        <div style={s.noIdentityNote}>
                          Ajoute ton <strong>prénom</strong> et ton <strong>nom</strong> une seule fois ici : ensuite
                          on les réutilise automatiquement pour Propriétaire / Jardinier·e.
                        </div>
                      )}
                    </>
                  ) : (
                    <form onSubmit={saveUser} style={s.formGrid}>
                      <label style={{ display: 'block' }}>
                        <span style={s.fieldLabel}>Prénom</span>
                        <input
                          style={s.input}
                          name="firstName"
                          value={form.firstName}
                          onChange={onUserChange}
                          required
                        />
                      </label>

                      <label style={{ display: 'block' }}>
                        <span style={s.fieldLabel}>Nom</span>
                        <input
                          style={s.input}
                          name="lastName"
                          value={form.lastName}
                          onChange={onUserChange}
                          required
                        />
                      </label>

                      <label style={{ display: 'block' }}>
                        <span style={s.fieldLabel}>Email</span>
                        <input
                          style={{ ...s.input, ...s.inputDisabled }}
                          name="email"
                          value={form.email}
                          disabled
                        />
                      </label>

                      <label style={{ display: 'block' }}>
                        <span style={s.fieldLabel}>Téléphone (optionnel)</span>
                        <input
                          style={s.input}
                          name="phone"
                          value={form.phone}
                          onChange={onUserChange}
                          placeholder="06 12 34 56 78"
                          inputMode="tel"
                        />
                        <div style={s.hint}>Chiffres + espaces + + ( ) -</div>
                      </label>

                      <label style={{ display: 'block' }}>
                        <span style={s.fieldLabel}>Adresse (optionnel)</span>
                        <input
                          style={s.input}
                          name="address"
                          value={form.address}
                          onChange={onUserChange}
                          placeholder="Paris…"
                        />
                      </label>

                      <div style={s.formColSpan2}>
                        <label style={{ display: 'block' }}>
                          <span style={s.fieldLabel}>Bio (optionnel)</span>
                          <textarea
                            style={s.textarea}
                            name="bio"
                            value={form.bio}
                            onChange={onUserChange}
                            rows={4}
                            placeholder="Quelques lignes sur toi…"
                          />
                          <div style={s.hint}>{String(form.bio || '').length}/400</div>
                        </label>
                      </div>

                      <div style={s.formColSpan2}>
                        <label style={{ display: 'block' }}>
                          <span style={s.fieldLabel}>Avatar</span>
                          <div style={s.avatarUploadRow}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveMedia(form.avatarUrl) || greenAvatar(form.firstName, form.lastName)}
                              alt=""
                              style={s.avatarSm}
                              onError={(e) => { e.currentTarget.src = greenAvatar(form.firstName, form.lastName); }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={onAvatarFile}
                              style={{ fontSize: '0.875rem' }}
                            />
                          </div>
                          <input
                            style={{ ...s.input, marginTop: '0.75rem' }}
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={onUserChange}
                            placeholder="https://… ou /uploads/mon-avatar.jpg"
                          />
                          {uploading && <div style={s.hint}>Téléversement…</div>}
                        </label>
                      </div>

                      <div style={{ ...s.formColSpan2, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <button
                          type="submit"
                          disabled={savingUser}
                          style={{ ...s.primaryBtn, ...(savingUser ? s.primaryBtnDisabled : {}) }}
                        >
                          {savingUser ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                        <button
                          type="button"
                          style={s.flatBtn}
                          onClick={() => {
                            setShowUserForm(false);
                            setMsg('');
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* GARDENER CARD */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.h2}>Profil Jardinier·e</h2>
                <div style={s.badgeRow}>
                  {me?.gardener ? (
                    me.gardener.published
                      ? <span style={s.badge}>Publié</span>
                      : <span style={s.badge}>Non publié</span>
                  ) : (
                    <span style={s.badge}>Non créé</span>
                  )}
                </div>
              </div>

              {me?.gardener ? (
                <div style={s.infoGrid}>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Identité</div>
                    <div style={s.infoValue}>{`${me.firstName || ''} ${me.lastName || ''}`.trim() || '—'}</div>
                  </div>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Adresse</div>
                    <div style={s.infoValue}>{me.gardener.location || '—'}</div>
                  </div>
                  <div style={s.infoCellFull}>
                    <div style={s.infoLabel}>Compétences</div>
                    {(me.gardener.skills || []).length ? (
                      <div style={s.skillWrap}>
                        {me.gardener.skills.slice(0, 10).map((sk) => (
                          <span key={sk} style={s.skillTag}>{sk}</span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ ...s.infoValue, marginTop: '0.25rem' }}>—</div>
                    )}
                  </div>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Expérience</div>
                    <div style={s.infoValue}>{me.gardener.yearsExperience ?? '—'}</div>
                  </div>
                  <div style={s.infoCellFull}>
                    <div style={s.infoLabel}>Intro</div>
                    <div style={{ ...s.infoValue, whiteSpace: 'pre-wrap' }}>{me.gardener.intro || '—'}</div>
                  </div>
                </div>
              ) : (
                <div style={s.noProfile}>
                  <span style={s.noProfileText}>Pas de profil jardinier·e encore.</span>
                  <Link href="/edit-gardener" style={s.flatBtn}>
                    Créer mon profil jardinier·e
                  </Link>
                </div>
              )}

              <div style={s.actionRow}>
                <Link href="/edit-gardener" style={s.flatBtn}>
                  {me?.gardener ? 'Modifier' : 'Créer'}
                </Link>

                {me?.gardener && (
                  <button
                    type="button"
                    disabled={busy || !hasIdentity}
                    style={{ ...s.primaryBtn, ...(busy || !hasIdentity ? s.primaryBtnDisabled : {}) }}
                    onClick={() => togglePublish('gardener', !me.gardener.published)}
                    title={!hasIdentity ? "Ajoute prénom/nom dans le profil compte d'abord" : ''}
                  >
                    {me.gardener.published ? 'Retirer' : 'Publier'}
                  </button>
                )}

                {!hasIdentity && (
                  <span style={s.mutedNote}>(publier nécessite prénom/nom côté compte)</span>
                )}
              </div>
            </div>

            {/* OWNER CARD */}
            <div style={{ ...s.section, marginBottom: 0 }}>
              <div style={s.sectionHeader}>
                <h2 style={s.h2}>Profil Propriétaire</h2>
                <div style={s.badgeRow}>
                  {me?.owner ? (
                    me.owner.published
                      ? <span style={s.badge}>Publié</span>
                      : <span style={s.badge}>Non publié</span>
                  ) : (
                    <span style={s.badge}>Non créé</span>
                  )}
                </div>
              </div>

              {me?.owner ? (
                <div style={s.infoGrid}>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Identité</div>
                    <div style={s.infoValue}>{`${me.firstName || ''} ${me.lastName || ''}`.trim() || '—'}</div>
                  </div>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Quartier</div>
                    <div style={s.infoValue}>{me.owner.district || '—'}</div>
                  </div>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Disponibilité</div>
                    <div style={s.infoValue}>{me.owner.availability || '—'}</div>
                  </div>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Surface</div>
                    <div style={s.infoValue}>{me.owner.area ? `${me.owner.area} m²` : '—'}</div>
                  </div>
                  <div style={s.infoCell}>
                    <div style={s.infoLabel}>Type de jardin</div>
                    <div style={s.infoValue}>{me.owner.kind || '—'}</div>
                  </div>
                  <div style={s.infoCellFull}>
                    <div style={s.infoLabel}>Intro</div>
                    <div style={{ ...s.infoValue, whiteSpace: 'pre-wrap' }}>{me.owner.intro || '—'}</div>
                  </div>
                  <div style={s.infoCellFull}>
                    <div style={s.infoLabel}>Description</div>
                    <div style={{ ...s.infoValue, whiteSpace: 'pre-wrap' }}>{me.owner.description || '—'}</div>
                  </div>
                </div>
              ) : (
                <div style={s.noProfile}>
                  <span style={s.noProfileText}>Pas de profil propriétaire encore.</span>
                  <Link href="/edit-owner" style={s.flatBtn}>
                    Créer mon profil propriétaire
                  </Link>
                </div>
              )}

              <div style={s.actionRow}>
                <Link href="/edit-owner" style={s.flatBtn}>
                  {me?.owner ? 'Modifier' : 'Créer'}
                </Link>

                {me?.owner && (
                  <button
                    type="button"
                    disabled={busy || !hasIdentity}
                    style={{ ...s.primaryBtn, ...(busy || !hasIdentity ? s.primaryBtnDisabled : {}) }}
                    onClick={() => togglePublish('owner', !me.owner.published)}
                    title={!hasIdentity ? "Ajoute prénom/nom dans le profil compte d'abord" : ''}
                  >
                    {me.owner.published ? 'Retirer' : 'Publier'}
                  </button>
                )}

                {!hasIdentity && (
                  <span style={s.mutedNote}>(publier nécessite prénom/nom côté compte)</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
