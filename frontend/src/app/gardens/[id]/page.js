// /Users/thaliawoods/Documents/Ada/JardinSolidaire/JardinSolidaire/frontend/src/app/gardens/[id]/page.js
// ✅ OPTION 2 “PARFAITE” + swap boutons :
// - bouton HERO "Réserver ce jardin" -> "Contacter" -> ouvre /messages/[ownerUserId]
// - bouton card "Contacter" -> "Voir le profil"
// - enlève le petit "Voir le profil →" dans la mini-card du propriétaire

'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAnyToken } from '@/lib/api';

const AvailabilityCalendar = dynamic(
  () => import('@/components/availability/AvailabilityCalendar'),
  { ssr: false }
);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND_GREEN = '#16a34a';
const BRAND_PINK = '#E3107D';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];

/* ---------- media helpers ---------- */
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
    <rect width="256" height="256" rx="24" fill="${BRAND_GREEN}"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ---------- normalizer ---------- */
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
    // ✅ IMPORTANT: si ton API expose ownerUserId sur le jardin
    ownerUserId:
      payload.ownerUserId ??
      payload.id_proprietaire ??
      payload.id_ownerUser ??
      null,
  };
}

/* ---------- UI atoms ---------- */
function Card({ title, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-black/5 bg-white p-6 shadow-sm ${className}`}
    >
      {title ? (
        <h2 className="text-base font-semibold text-green-900">{title}</h2>
      ) : null}
      <div className={title ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

function HeroChip({ children, tone = 'mint' }) {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap backdrop-blur-md shadow-sm';
  const style =
    tone === 'mint'
      ? {
          backgroundColor: 'rgba(236,253,245,0.90)',
          border: '1px solid rgba(22,163,74,0.28)',
          color: '#166534',
        }
      : tone === 'gray'
        ? {
            backgroundColor: 'rgba(255,255,255,0.86)',
            border: '1px solid rgba(17,24,39,0.12)',
            color: '#111827',
          }
        : {
            backgroundColor: 'rgba(255,240,248,0.90)',
            border: '1px solid rgba(227,16,125,0.22)',
            color: '#a10b59',
          };

  return (
    <span className={base} style={style}>
      {children}
    </span>
  );
}

function Chip({ children, tone = 'mint' }) {
  const styles =
    tone === 'mint'
      ? {
          backgroundColor: 'rgba(22,163,74,0.06)',
          border: '1px solid rgba(22,163,74,0.22)',
          color: '#166534',
        }
      : tone === 'gray'
        ? {
            backgroundColor: 'rgba(17,24,39,0.04)',
            border: '1px solid rgba(17,24,39,0.10)',
            color: '#374151',
          }
        : {
            backgroundColor: 'rgba(227,16,125,0.06)',
            border: '1px solid rgba(227,16,125,0.20)',
            color: '#a10b59',
          };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={styles}
    >
      {children}
    </span>
  );
}

export default function GardenDetailPage({ params }) {
  const { id } = use(params) || {};
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // ✅ owner profile link
  const ownerProfileIdRaw =
    garden?.demoOwnerId ??
    owner?.ownerId ??
    owner?.id ??
    garden?.ownerUserId ??
    null;

  const ownerHref = ownerProfileIdRaw ? `/owners/${ownerProfileIdRaw}` : null;

  // ✅ userId for chat thread (messages are by USER id)
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
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-10 w-56 bg-gray-100 rounded-full" />
          <div className="h-72 bg-gray-100 rounded-3xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !garden) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error || 'Erreur inconnue'}
          </div>
          <p className="text-gray-600">
            Retour aux{' '}
            <Link href="/gardens" className="underline text-green-700">
              jardins
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const hero = garden.photos?.[0] || '';

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        {/* Retour */}
        <div className="mb-4">
          <Link
            href="/gardens"
            aria-label="Retour aux jardins"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-[#16a34a] border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
          >
            <span aria-hidden>←</span> Retour aux jardins
          </Link>
        </div>

        {/* HERO */}
        <div className="rounded-3xl overflow-hidden border border-black/5 shadow-sm">
          <div className="relative">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero}
                alt={garden.title || 'Photo de jardin'}
                className="w-full h-56 md:h-72 lg:h-80 object-cover"
              />
            ) : (
              <div className="w-full h-56 md:h-72 lg:h-80 bg-gray-100" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-white drop-shadow">
                {garden.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!!garden.address && (
                  <HeroChip tone="gray">
                    <span aria-hidden>📍</span>
                    <span className="max-w-[70vw] md:max-w-[520px] truncate">
                      {garden.address}
                    </span>
                  </HeroChip>
                )}
                {!!garden.kind && <HeroChip>{garden.kind}</HeroChip>}
                {!!garden.needs && <HeroChip>{garden.needs}</HeroChip>}
                <HeroChip tone="mint">{garden.photos?.length || 0} photos</HeroChip>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 md:px-6 py-4 bg-white">
            <p className="text-sm text-gray-600">
              Écris au propriétaire pour poser une question ou proposer un créneau.
            </p>

            <div className="flex items-center gap-3">
              {ownerUserIdForChat ? (
                <Link
                  href={`/messages/${ownerUserIdForChat}`}
                  className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition font-semibold"
                >
                  Contacter
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 rounded-full bg-pink-500 text-white opacity-60 cursor-not-allowed font-semibold"
                  title="Propriétaire introuvable"
                >
                  Contacter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8 space-y-6">
          {/* ✅ Rangée 1 : À propos + Propriétaire (alignés parfaitement) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch items-start">
            {/* left (2 colonnes) */}
            <div className="lg:col-span-2">
              <Card title="À propos du jardin" className="h-full">
                {garden.description ? (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {garden.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Aucune description.</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {!!garden.kind && <Chip>Type : {garden.kind}</Chip>}
                  {!!garden.needs && <Chip>Besoins : {garden.needs}</Chip>}
                  {!!garden.address && <Chip tone="gray">Adresse : {garden.address}</Chip>}
                </div>
              </Card>
            </div>

            {/* right (1 colonne) */}
            <aside>
              <Card title="Propriétaire" className="h-full">
                {!owner ? (
                  <p className="text-sm text-gray-600">Pas de propriétaire lié.</p>
                ) : (
                  <>
                    {ownerHref ? (
                      <Link
                        href={ownerHref}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition"
                        aria-label={`Voir le profil de ${owner.firstName} ${owner.lastName}`}
                      >
                        <div
                          className="h-12 w-12 rounded-full overflow-hidden shrink-0 bg-white"
                          style={{ border: '3px solid rgba(22,163,74,0.18)' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ownerAvatar}
                            alt={`${owner.firstName} ${owner.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = greenAvatar(owner.firstName, owner.lastName);
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {owner.firstName} {owner.lastName}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {owner.address || 'Adresse non renseignée'}
                          </div>
                          {/* ✅ supprimé : "Voir le profil →" */}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-gray-50 px-4 py-3">
                        <div
                          className="h-12 w-12 rounded-full overflow-hidden shrink-0 bg-white"
                          style={{ border: '3px solid rgba(22,163,74,0.18)' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ownerAvatar}
                            alt={`${owner.firstName} ${owner.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = greenAvatar(owner.firstName, owner.lastName);
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {owner.firstName} {owner.lastName}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {owner.address || 'Adresse non renseignée'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ✅ bouton rose devient "Voir le profil" */}
                    {ownerHref ? (
                      <Link
                        href={ownerHref}
                        className="mt-3 block w-full text-center rounded-full px-4 py-2.5 text-white font-medium hover:opacity-95 transition"
                        style={{ backgroundColor: BRAND_PINK }}
                      >
                        Voir le profil
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="mt-3 w-full rounded-full px-4 py-2.5 text-white font-medium opacity-60 cursor-not-allowed"
                        style={{ backgroundColor: BRAND_PINK }}
                      >
                        Voir le profil
                      </button>
                    )}
                  </>
                )}
              </Card>
            </aside>
          </div>

          {/* ✅ Rangée 2 : Calendrier FULL WIDTH (en dessous comme avant) */}
          <div className="mt-6">
            <AvailabilityCalendar
              mode="garden"
              intent="book"
              gardenId={garden.id}
              token={getAnyToken()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
