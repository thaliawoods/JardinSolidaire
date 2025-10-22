'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const BRAND_GREEN = '#16a34a';

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full border transition ${
        active
          ? 'bg-pink-500 text-white border-pink-500'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

function Pill({ ok }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border ${
        ok
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-gray-100 text-gray-700 border-gray-200'
      }`}
    >
      {ok ? 'Publié' : 'Brouillon'}
    </span>
  );
}

export default function MyGardensClient() {
  const router = useRouter();
  const search = useSearchParams();

  const initialTab =
    search.get('tab') === 'drafts' ? 'drafts' : search.get('tab') === 'all' ? 'all' : 'published';

  const [tab, setTab] = useState(initialTab);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState('');

  function setTabAndUrl(t) {
    setTab(t);
    const q = t === 'published' ? 'published' : t === 'drafts' ? 'drafts' : 'all';
    router.replace(`/my-gardens?tab=${q}`);
  }

  async function load() {
    setLoading(true);
    try {
      const query = { mine: 1 };
      if (tab === 'published') query.published = true;
      if (tab === 'drafts') query.published = false;
      const data = await apiFetch('/api/gardens', { query });
      setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function onEdit(id) {
    router.push(`/edit-garden?id=${id}`);
  }

  async function onUnpublish(id) {
    try {
      setBusyId(id);
      await apiFetch(`/api/gardens/${id}/unpublish`, { method: 'POST' });
      setToast('Annonce retirée.');
      await load();
    } catch {
      alert("Impossible de changer la publication.");
    } finally {
      setBusyId(null);
    }
  }

  async function onPublish(id) {
    try {
      setBusyId(id);
      await apiFetch(`/api/gardens/${id}/publish`, { method: 'POST' });
      setToast('Annonce publiée.');
      await load();
    } catch {
      alert("Impossible de changer la publication.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">Mes jardins</h1>

      {toast && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Tab active={tab === 'published'} onClick={() => setTabAndUrl('published')}>Publiés</Tab>
          <Tab active={tab === 'drafts'} onClick={() => setTabAndUrl('drafts')}>Brouillons</Tab>
          <Tab active={tab === 'all'} onClick={() => setTabAndUrl('all')}>Tous</Tab>
        </div>

        <Link
          href="/add-garden"
          className="px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm"
        >
          + Ajouter un jardin
        </Link>
      </div>

      {loading && <div className="rounded-xl border p-6 bg-white text-gray-500">Chargement…</div>}

      {!loading && rows.length === 0 && (
        <div className="rounded-xl border p-8 bg-white text-center text-gray-600">
          {tab === 'published' ? 'Aucun jardin publié pour le moment.'
            : tab === 'drafts' ? 'Aucun brouillon.' : 'Aucun jardin.'}
          <div className="text-sm mt-2">
            Utilisez le bouton “Ajouter un jardin” pour en créer un, puis publiez-le pour qu’il apparaisse ici.
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((g) => (
          <div key={g.id} className="rounded-xl border p-4 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{g.title}</div>
                <div className="text-sm text-gray-600">Adresse : {g.address || '—'}</div>
                <div className="text-sm text-gray-600">Besoins : {g.needs || '—'}</div>
              </div>
              <Pill ok={!!g.publishedAt} />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(g.id)}
                className="px-3 py-1.5 rounded-full border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)]"
                style={{ color: BRAND_GREEN }}
              >
                Modifier
              </button>

              {g.publishedAt ? (
                <button
                  disabled={busyId === g.id}
                  onClick={() => onUnpublish(g.id)}
                  className="px-3 py-1.5 rounded-full bg-pink-500 text-white disabled:opacity-60"
                >
                  {busyId === g.id ? '…' : 'Retirer'}
                </button>
              ) : (
                <button
                  disabled={busyId === g.id}
                  onClick={() => onPublish(g.id)}
                  className="px-3 py-1.5 rounded-full bg-pink-500 text-white disabled:opacity-60"
                >
                  {busyId === g.id ? '…' : 'Publier'}
                </button>
              )}

              <Link
                href={`/garden/${g.id}`}
                className="px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Voir
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
