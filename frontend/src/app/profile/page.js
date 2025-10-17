'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr('');
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
        await apiFetch('/api/me/gardener/publish', {
          method: 'POST',
          body: { published: !!next },
        });
      } else {
        await apiFetch('/api/me/owner/publish', {
          method: 'POST',
          body: { published: !!next },
        });
      }
      await load();
    } catch (e) {
      setErr(e?.error || e?.message || 'server_error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">My profile</h1>

      {loading && <Skeleton />}

      {!!err && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          Error: {err}
        </div>
      )}

      {me && !loading && (
        <div className="space-y-8">
          {/* Account info */}
          <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Account information</h2>
              <Link
                href="/edit-profile"
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                Edit
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <Field label="Last name">{me.lastName || '—'}</Field>
              <Field label="First name">{me.firstName || '—'}</Field>
              <Field label="Email">{me.email || '—'}</Field>
              <Field label="Role">{me.role || '—'}</Field>
              <Field label="Phone">{me.phone || '—'}</Field>
              <Field label="Address">{me.address || '—'}</Field>
              <Field label="Average rating">{me.averageRating ?? '—'}</Field>
              <Field label="Bio" full>{me.bio || '—'}</Field>
            </div>
          </section>

          {/* Gardener */}
          <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Gardener profile</h2>
              {me.gardener?.published ? (
                <Badge color="green">Published</Badge>
              ) : (
                <Badge color="gray">Unpublished</Badge>
              )}
            </div>

            {!me.gardener && (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">No gardener profile yet.</p>
                <Link
                  href="/add-gardener"
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Create my profile
                </Link>
              </div>
            )}

            {me.gardener && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Full name">
                    {me.gardener.firstName} {me.gardener.lastName}
                  </Field>
                  <Field label="Location">{me.gardener.location || '—'}</Field>
                  <Field label="Skills" full>
                    {(me.gardener.skills || []).join(', ') || '—'}
                  </Field>
                  <Field label="Experience (years)">
                    {me.gardener.yearsExperience ?? '—'}
                  </Field>
                  <Field label="Rating">{me.gardener.rating ?? '—'}</Field>
                  <Field label="Introduction" full>
                    {me.gardener.intro || '—'}
                  </Field>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/edit-gardener"
                    className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busy}
                    onClick={() => togglePublish('gardener', !me.gardener.published)}
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {me.gardener.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </>
            )}
          </section>

          {/* Owner (left as-is; wire later if needed) */}
          <section className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Owner profile</h2>
              {me.owner?.published ? (
                <Badge color="green">Published</Badge>
              ) : (
                <Badge color="gray">Unpublished</Badge>
              )}
            </div>

            {!me.owner && (
              <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-700">No owner profile yet.</p>
                <Link
                  href="/create-owner"
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Create my profile
                </Link>
              </div>
            )}

            {me.owner && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <Field label="Full name">
                    {me.owner.firstName} {me.owner.lastName}
                  </Field>
                  <Field label="Neighborhood">{me.owner.district || '—'}</Field>
                  <Field label="Availability">{me.owner.availability || '—'}</Field>
                  <Field label="Surface">
                    {me.owner.area ? `${me.owner.area} m²` : '—'}
                  </Field>
                  <Field label="Garden type">{me.owner.kind || '—'}</Field>
                  <Field label="Introduction" full>{me.owner.intro || '—'}</Field>
                  <Field label="Description" full>{me.owner.description || '—'}</Field>
                  <Field label="Rating">{me.owner.rating ?? '—'}</Field>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/edit-owner"
                    className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busy}
                    onClick={() => togglePublish('owner', !me.owner.published)}
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {me.owner.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
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
  const palette = {
    green: 'bg-green-100 text-green-800 border-green-200',
    gray:  'bg-gray-100 text-gray-800 border-gray-200',
  }[color];
  return (
    <span className={`text-xs px-2 py-1 rounded border ${palette}`}>{children}</span>
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
