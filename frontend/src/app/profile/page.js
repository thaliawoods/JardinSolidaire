'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const LOCAL_DIRS = ['/assets/', '/images/', '/img/', '/icons/'];
const BRAND_GREEN = '#16a34a'; 

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
function greenAvatar(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#22C55E"/><stop offset="100%" stop-color="#16A34A"/>
  </linearGradient></defs>
  <rect width="256" height="256" rx="24" ry="24" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#FFFFFF">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true); setErr('');
      const r = await apiFetch('/api/me');
      setMe(r.user || r);
    } catch (e) {
      setErr(e?.error || e?.message || 'server_error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function togglePublish(kind, next) {
    try {
      setBusy(true);
      if (kind === 'gardener') {
        await apiFetch('/api/me/gardener/publish', { method: 'POST', body: { published: !!next } });
      } else {
        await apiFetch('/api/me/owner/publish', { method: 'POST', body: { published: !!next } });
      }
      await load();
    } catch (e) {
      setErr(e?.error || e?.message || 'server_error');
    } finally {
      setBusy(false);
    }
  }

  const userAvatar = useMemo(() => me ? resolveMedia(me.avatarUrl || me.photo_profil || me.avatar) : null, [me]);
  const gardenerAvatar = useMemo(() => me?.gardener ? resolveMedia(me.gardener.avatarUrl || me.gardener.photo_profil || me.gardener.avatar) : null, [me]);
  const ownerAvatar = useMemo(() => me?.owner ? resolveMedia(me.owner.avatarUrl || me.owner.photo_profil || me.owner.avatar) : null, [me]);

  const userFallback     = useMemo(() => greenAvatar(me?.firstName, me?.lastName), [me?.firstName, me?.lastName]);
  const gardenerFallback = useMemo(() => greenAvatar(me?.gardener?.firstName, me?.gardener?.lastName), [me?.gardener?.firstName, me?.gardener?.lastName]);
  const ownerFallback    = useMemo(() => greenAvatar(me?.owner?.firstName, me?.owner?.lastName), [me?.owner?.firstName, me?.owner?.lastName]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">Mon profil</h1>

      {loading && <Skeleton />}

      {!!err && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Error: {err}
        </div>
      )}

      {me && !loading && (
        <div className="space-y-8">
          <SoftCard>
            <SectionHeader
              title="Informations du compte"
              avatarSrc={userAvatar || userFallback}
              onAvatarErrorSrc={userFallback}
            >
              <Link
                href="/edit-profile"
                className="px-3 py-1.5 rounded-full text-sm bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                style={{ color: BRAND_GREEN }}
              >
                Modifier
              </Link>
            </SectionHeader>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <Field label="Nom">{me.lastName || '—'}</Field>
              <Field label="Prénom">{me.firstName || '—'}</Field>
              <Field label="Email">{me.email || '—'}</Field>
              <Field label="Rôle">{me.role || '—'}</Field>
              <Field label="Téléphone">{me.phone || '—'}</Field>
              <Field label="Adresse">{me.address || '—'}</Field>
              <Field label="Note">{me.averageRating ?? '—'}</Field>
              <Field label="Bio" full>{me.bio || '—'}</Field>
            </div>
          </SoftCard>

          <SoftCard>
            <SectionHeader
              title="Profil de jardinier"
              avatarSrc={gardenerAvatar || gardenerFallback}
              onAvatarErrorSrc={gardenerFallback}
              rightEl={me.gardener?.published ? <Badge color="green">Publié</Badge> : <Badge color="gray">Non publié</Badge>}
            />

            {!me.gardener && (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">Pas de profil de jardinier encore.</p>
                <Link
                  href="/add-gardener"
                  className="px-4 py-2 rounded-full bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                  style={{ color: BRAND_GREEN }}
                >
                  Créer mon profil
                </Link>
              </div>
            )}

            {me.gardener && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Full name">{me.gardener.firstName} {me.gardener.lastName}</Field>
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

          <SoftCard>
            <SectionHeader
              title="Profil de propriétaire"
              avatarSrc={ownerAvatar || ownerFallback}
              onAvatarErrorSrc={ownerFallback}
              rightEl={me.owner?.published ? <Badge color="green">Publié</Badge> : <Badge color="gray">Non publié</Badge>}
            />

            {!me.owner && (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">Pas de profil de propriétaire encore.</p>
                <Link
                  href="/create-owner"
                  className="px-4 py-2 rounded-full bg-white/80 border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] shadow-sm transition"
                  style={{ color: BRAND_GREEN }}
                >
                  Créer mon profil
                </Link>
              </div>
            )}

            {me.owner && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Full name">{me.owner.firstName} {me.owner.lastName}</Field>
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
        </div>
      )}
    </main>
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

function SectionHeader({ title, avatarSrc, onAvatarErrorSrc, rightEl, children }) {
  return (
    <div className="flex items-start gap-5 mb-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarSrc}
        alt=""
        className="w-16 h-16 rounded-full object-cover shadow"
        style={{ border: '4px solid rgba(22,163,74,0.35)' }}
        onError={(e) => { e.currentTarget.src = onAvatarErrorSrc; }}
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

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <p className="font-medium">{label}</p>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}

function Badge({ color = 'gray', children }) {
  const palette = color === 'green'
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
  return <span className={`text-xs px-2 py-1 rounded-full border ${palette}`}>{children}</span>;
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
