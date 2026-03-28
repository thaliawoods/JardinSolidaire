'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAnyToken } from '@/lib/api';
import { getFavGardens, addFavGarden, removeFavGarden } from '@/lib/favorites';

const AvailabilityCalendar = dynamic(
  () => import('@/components/availability/AvailabilityCalendar'),
  { ssr: false }
);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" fill="#111111"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeGarden(payload) {
  if (!payload) return null;

  const photosRaw = payload.photos ?? [];
  const photos = (Array.isArray(photosRaw)
    ? photosRaw
    : typeof photosRaw === 'string'
      ? [photosRaw]
      : []
  ).map(resolveMedia);

  const ownerRaw = payload.owner ?? null;
  const owner =
    ownerRaw &&
    {
      id: String(ownerRaw.id ?? ownerRaw.id_utilisateur ?? ''),
      firstName: ownerRaw.firstName ?? ownerRaw.prenom ?? '',
      lastName: ownerRaw.lastName ?? ownerRaw.nom ?? '',
      avatarUrl: resolveMedia(ownerRaw.avatarUrl ?? ownerRaw.photo_profil ?? ''),
      address: ownerRaw.address ?? ownerRaw.adresse ?? null,
      intro: ownerRaw.bio ?? ownerRaw.presentation ?? null,
      ownerId:
        ownerRaw.ownerId ??
        ownerRaw.id_owner ??
        ownerRaw.idProprietaire ??
        ownerRaw.id_proprietaire ??
        null,
    };

  return {
    id: String(payload.id ?? payload.id_jardin ?? ''),
    title: payload.title ?? payload.titre ?? '',
    description: payload.description ?? '',
    address: payload.address ?? payload.adresse ?? '',
    kind: payload.kind ?? payload.type ?? '',
    needs: payload.needs ?? payload.besoins ?? '',
    photos,
    owner: owner || null,
    demoOwnerId:
      payload.ownerProfileId ??
      payload.ownerDemoId ??
      payload.proprietaireDemoId ??
      null,
    ownerUserId:
      payload.ownerUserId ??
      payload.id_proprietaire ??
      payload.id_ownerUser ??
      null,
  };
}

export default function GardenDetailPage({ params }) {
  const { id } = use(params) || {};
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const sync = () => setIsAuthed(!!getAnyToken());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    if (id) setIsFav(getFavGardens().some((g) => String(g.id) === String(id)));
  }, [id, isAuthed]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');

        let res = await fetch(`${API_BASE}/api/gardens/${id}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (alive) setGarden(normalizeGarden(data));
      } catch {
        if (alive) {
          setError('Impossible de charger ce jardin.');
          setGarden(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const owner = garden?.owner;

  const ownerAvatar = useMemo(() => {
    if (!owner) return null;
    return owner.avatarUrl || greenAvatar(owner.firstName, owner.lastName);
  }, [owner]);

  const ownerProfileIdRaw =
    garden?.demoOwnerId ??
    owner?.ownerId ??
    owner?.id ??
    garden?.ownerUserId ??
    null;

  const ownerHref = ownerProfileIdRaw ? `/owners/${ownerProfileIdRaw}` : null;

  const ownerUserIdForChat = useMemo(() => {
    const raw =
      garden?.ownerUserId ?? // best if you have it on garden
      (typeof owner?.id !== 'undefined' ? owner.id : null) ?? // often user id
      owner?.ownerId ?? // fallback
      null;

    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [garden?.ownerUserId, owner?.id, owner?.ownerId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
      </div>
    );
  }

  if (error || !garden) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error || 'Erreur inconnue'}
          </p>
          <Link
            href="/gardens"
            style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            ← Retour aux jardins
          </Link>
        </div>
      </div>
    );
  }

  const hero = garden.photos?.[0] || '';

  const metaParts = [garden.address, garden.kind, garden.needs].filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)' }}>
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div>
          <Link
            href="/gardens"
            aria-label="Retour aux jardins"
            style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'none' }}
          >
            ← Retour aux jardins
          </Link>
        </div>

        <div style={{ position: 'relative' }}>
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero}
              alt={garden.title || 'Photo de jardin'}
              style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '320px', background: '#f5f5f5' }} />
          )}
          {isAuthed && (
            <button
              type="button"
              onClick={() => {
                if (isFav) {
                  removeFavGarden(String(id));
                  setIsFav(false);
                } else {
                  addFavGarden({ id, title: garden.title, address: garden.address, kind: garden.kind, photos: garden.photos });
                  setIsFav(true);
                }
              }}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, color: isFav ? '#ec4899' : '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)', padding: 0 }}
              aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              ♥
            </button>
          )}

          <div style={{ paddingTop: '1.25rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
              {garden.title}
            </h1>

            {metaParts.length > 0 && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                {metaParts.join(' · ')}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
            Écris au propriétaire pour poser une question ou proposer un créneau.
          </p>

          {ownerUserIdForChat ? (
            <Link
              href={`/messages/${ownerUserIdForChat}`}
              style={{
                fontSize: '0.875rem',
                color: 'var(--foreground)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Contacter →
            </Link>
          ) : (
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)', cursor: 'not-allowed' }}>
              Contacter →
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '1.5rem', alignItems: 'start' }}>

          <section style={{ border: '1px solid var(--border)', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.875rem' }}>
              À propos du jardin
            </p>

            {garden.description ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.65, margin: 0 }}>
                {garden.description}
              </p>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Aucune description.</p>
            )}

            {(garden.kind || garden.needs || garden.address) && (
              <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 2 }}>
                {!!garden.kind && (
                  <div>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>Type</span>
                    {' '}{garden.kind}
                  </div>
                )}
                {!!garden.needs && (
                  <div>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>Besoins</span>
                    {' '}{garden.needs}
                  </div>
                )}
                {!!garden.address && (
                  <div>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem', color: 'var(--green)' }}>Adresse</span>
                    {' '}{garden.address}
                  </div>
                )}
              </div>
            )}
          </section>

          <aside style={{ border: '1px solid var(--border)', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.875rem' }}>
              Propriétaire
            </p>

            {!owner ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Pas de propriétaire lié.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '48px', height: '48px', flexShrink: 0, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ownerAvatar}
                      alt={`${owner.firstName} ${owner.lastName}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.currentTarget.src = greenAvatar(owner.firstName, owner.lastName);
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--foreground)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {owner.firstName} {owner.lastName}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {owner.address || 'Adresse non renseignée'}
                    </div>
                  </div>
                </div>

                {ownerHref ? (
                  <Link
                    href={ownerHref}
                    style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                  >
                    Voir le profil →
                  </Link>
                ) : (
                  <span style={{ fontSize: '0.875rem', color: 'var(--muted)', cursor: 'not-allowed' }}>
                    Voir le profil →
                  </span>
                )}
              </div>
            )}
          </aside>
        </div>

        <div>
          <AvailabilityCalendar
            mode="garden"
            intent="book"
            gardenId={garden.id}
            token={getAnyToken()}
          />
        </div>

      </main>
    </div>
  );
}
