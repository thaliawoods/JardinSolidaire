'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';
import { getAnyToken } from '@/lib/api';
import { getFavGardeners, addFavGardener, removeFavGardener } from '@/lib/favorites';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const BRAND_GREEN = '#16a34a';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* -------- media helpers -------- */
function resolveMedia(u) {
  if (!u) return null;
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

function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#111111"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* pick best avatar source consistently */
function pickAvatar(raw) {
  return (
    raw?.avatarUrl ??
    raw?.photo_profil ??
    raw?.avatar ??
    raw?.user?.avatarUrl ??
    raw?.user?.photo_profil ??
    raw?.user?.avatar ??
    null
  );
}

function normalizeSkills(maybeSkills) {
  if (!maybeSkills) return [];
  if (Array.isArray(maybeSkills)) return maybeSkills.map((s) => String(s).trim()).filter(Boolean);
  return String(maybeSkills)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function GardenerClient({ id: idProp }) {
  const pathname = usePathname();

  // ✅ fallback ultime : /gardeners/33 -> "33"
  const idFromPath = (pathname || '').split('/').filter(Boolean).pop();
  const id = idProp ?? idFromPath;

  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarV, setAvatarV] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    if (id) setIsFav(getFavGardeners().some((g) => String(g.id) === String(id)));
  }, [id, isAuthed]);

  console.log('API_BASE runtime:', API_BASE);
  console.log('pathname:', pathname);
  console.log('ID prop:', idProp);
  console.log('ID from path:', idFromPath);
  console.log('ID used:', id);
  console.log('Fetching:', `${API_BASE}/api/gardeners/${id}`);

  // reload on cross-tab updates
  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === 'gardenerUpdated' || e?.key === 'userUpdated') {
        setAvatarV(Date.now());
        load();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    if (!id || !API_BASE) return; // ✅ évite /undefined + évite base vide
    try {
      setLoading(true);
      setError('');

      let res = await fetch(`${API_BASE}/api/gardeners/${id}`, { cache: 'no-store' });
      if (!res.ok) res = await fetch(`${API_BASE}/api/jardiniers/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setGardener({
        firstName: data.firstName || data.prenom || '',
        lastName: data.lastName || data.nom || '',
        avatarUrl: resolveMedia(pickAvatar(data)),
        isOnline: !!data.isOnline,
        location: data.location || data.localisation || '—',
        skills: normalizeSkills(data.skills ?? data.competences),
        yearsExperience: data.yearsExperience ?? data.experienceAnnees ?? null,
        intro: data.intro || data.presentation || data.description || '—',
      });
    } catch (e) {
      console.error('Gardener fetch failed:', e);
      setError('Impossible de charger le profil jardinier·e.');
      setGardener(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const avatarSrc = useMemo(() => {
    if (!gardener) return null;
    const base = gardener.avatarUrl || greenPlaceholder(gardener.firstName, gardener.lastName);
    return gardener.avatarUrl ? `${base}${base.includes('?') ? '&' : '?'}v=${avatarV}` : base;
  }, [gardener, avatarV]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

        {/* Back link */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/gardeners"
            style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            ← Retour aux jardinier·es
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
        )}

        {/* Error */}
        {!!error && !loading && (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{error}</p>
        )}

        {gardener && (
          <>
            {/* Avatar + name + skills */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 32 }}>
              <div style={{ flexShrink: 0, width: 80, height: 80, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt={`${gardener.firstName} ${gardener.lastName}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.src = greenPlaceholder(gardener.firstName, gardener.lastName);
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
                    {gardener.firstName} {gardener.lastName}
                  </h1>
                  {isAuthed && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isFav) {
                          removeFavGardener(String(id));
                          setIsFav(false);
                        } else {
                          addFavGardener({ id, firstName: gardener.firstName, lastName: gardener.lastName, avatarUrl: gardener.avatarUrl });
                          setIsFav(true);
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: 0, color: isFav ? '#ec4899' : 'var(--border)', lineHeight: 1, flexShrink: 0 }}
                      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      ♥
                    </button>
                  )}
                </div>

                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(gardener.skills || []).slice(0, 10).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        padding: '2px 8px',
                        lineHeight: 1.6,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                  {(gardener.skills || []).length === 0 && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Compétences à venir</span>
                  )}
                </div>
              </div>
            </div>

            {/* Meta */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <div style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--muted)', marginRight: 6 }}>Localisation :</span>
                <span style={{ color: 'var(--foreground)' }}>{gardener.location}</span>
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--muted)', marginRight: 6 }}>Expérience :</span>
                <span style={{ color: 'var(--foreground)' }}>
                  {gardener.yearsExperience != null ? `${gardener.yearsExperience} an(s)` : '—'}
                </span>
              </div>
            </div>

            {/* Présentation */}
            <section style={{ marginBottom: 40 }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 10, margin: '0 0 10px 0' }}>
                Présentation
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0 }}>
                {gardener.intro || '—'}
              </p>
            </section>

            {/* Availability */}
            <section>
              <AvailabilityCalendar mode="gardener" ownerId={id} token={getAnyToken()} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
