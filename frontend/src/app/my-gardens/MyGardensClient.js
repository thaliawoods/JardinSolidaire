'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

import ConfirmModal from '@/components/ui/ConfirmModal';
import { useConfirm } from '@/hooks/useConfirm';

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
      type="button"
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

function CardLine({ label, value }) {
  return (
    <div className="text-sm text-gray-600">
      <span className="text-gray-500">{label}</span>{' '}
      <span className="text-gray-800">{value || '—'}</span>
    </div>
  );
}

export default function MyGardensClient() {
  const router = useRouter();
  const search = useSearchParams();

  const initialTab =
    search.get('tab') === 'drafts'
      ? 'drafts'
      : search.get('tab') === 'all'
        ? 'all'
        : 'published';

  const [tab, setTab] = useState(initialTab);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { confirm, confirmState, closeConfirm } = useConfirm();

  function pushToast(t) {
    setToast(t);
    window.clearTimeout(window.__js_toast_timeout__);
    window.__js_toast_timeout__ = window.setTimeout(() => setToast(''), 2200);
  }

  function setTabAndUrl(t) {
    setTab(t);
    const q = t === 'published' ? 'published' : t === 'drafts' ? 'drafts' : 'all';
    router.replace(`/my-gardens?tab=${q}`);
  }

  async function load() {
    setLoading(true);
    setErrorMsg('');
    try {
      const query = { mine: 1 };
      if (tab === 'published') query.published = true;
      if (tab === 'drafts') query.published = false;

      const data = await apiFetch('/api/gardens', { query });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setRows([]);
      setErrorMsg("Impossible de charger vos jardins.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const stats = useMemo(() => {
    const published = rows.filter((r) => !!r.publishedAt).length;
    const drafts = rows.length - published;
    return { published, drafts, total: rows.length };
  }, [rows]);

  function onEdit(id) {
    router.push(`/garden/${id}/edit`);
  }

  async function safeUnpublish(id) {
    try {
      await apiFetch(`/api/gardens/${id}/unpublish`, { method: 'POST' });
      return;
    } catch (e) {
      if (e?.status !== 404) throw e;
    }
    await apiFetch(`/api/gardens/${id}`, { method: 'PUT', body: { publishedAt: null } });
  }

  async function safePublish(id) {
    try {
      await apiFetch(`/api/gardens/${id}/publish`, { method: 'POST' });
      return;
    } catch (e) {
      if (e?.status !== 404) throw e;
    }
    await apiFetch(`/api/gardens/${id}`, {
      method: 'PUT',
      body: { publishedAt: new Date().toISOString() },
    });
  }

  async function doUnpublish(id) {
    try {
      setBusyId(id);
      await safeUnpublish(id);
      pushToast('Annonce retirée.');
      await load();
    } catch (e) {
      console.error(e);
      setErrorMsg("Impossible de retirer l'annonce.");
    } finally {
      setBusyId(null);
    }
  }

  async function doPublish(id) {
    try {
      setBusyId(id);
      await safePublish(id);
      pushToast('Annonce publiée.');
      await load();
    } catch (e) {
      console.error(e);
      setErrorMsg("Impossible de publier l'annonce.");
    } finally {
      setBusyId(null);
    }
  }

  async function doDelete(id) {
    try {
      setBusyId(id);
      await apiFetch(`/api/gardens/${id}`, { method: 'DELETE' });
      pushToast('Jardin supprimé.');
      await load();
    } catch (e) {
      console.error(e);
      setErrorMsg("Impossible de supprimer le jardin.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Modal global */}
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        danger={confirmState.danger}
        busy={!!busyId}
        onClose={closeConfirm}
        onConfirm={async () => {
          const fn = confirmState.onConfirm;
          closeConfirm();
          if (typeof fn === 'function') await fn();
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Mes jardins</h1>
          <div className="text-sm text-gray-600 mt-1">
            {stats.total} au total · {stats.published} publié{stats.published > 1 ? 's' : ''} ·{' '}
            {stats.drafts} brouillon{stats.drafts > 1 ? 's' : ''}
          </div>
        </div>

        <Link
          href="/add-garden"
          className="shrink-0 px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold shadow-sm"
        >
          + Ajouter un jardin
        </Link>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <Tab active={tab === 'published'} onClick={() => setTabAndUrl('published')}>
          Publiés
        </Tab>
        <Tab active={tab === 'drafts'} onClick={() => setTabAndUrl('drafts')}>
          Brouillons
        </Tab>
        <Tab active={tab === 'all'} onClick={() => setTabAndUrl('all')}>
          Tous
        </Tab>
      </div>

      {loading && (
        <div className="rounded-2xl border p-6 bg-white text-gray-500">Chargement…</div>
      )}

      {!loading && rows.length === 0 && (
        <div className="rounded-2xl border p-10 bg-white text-center">
          <div className="text-gray-800 font-semibold">
            {tab === 'published'
              ? 'Aucun jardin publié pour le moment.'
              : tab === 'drafts'
                ? 'Aucun brouillon.'
                : 'Aucun jardin.'}
          </div>
          <div className="text-sm mt-2 text-gray-600">
            Crée un jardin, puis publie-le pour le rendre visible.
          </div>
          <div className="mt-4">
            <Link
              href="/add-garden"
              className="inline-flex px-5 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold"
            >
              + Ajouter un jardin
            </Link>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((g) => {
          const isBusy = busyId === g.id;
          const isPublished = !!g.publishedAt;

          return (
            <div
              key={g.id}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-gray-900 truncate">{g.title || 'Sans titre'}</div>
                    <Pill ok={isPublished} />
                  </div>
                  <div className="mt-2 space-y-1">
                    <CardLine label="Adresse :" value={g.address} />
                    <CardLine label="Besoins :" value={g.needs} />
                  </div>
                </div>

                <Link
                  href={`/garden/${g.id}`}
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  Voir
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onEdit(g.id)}
                  type="button"
                  className="px-3 py-1.5 rounded-full border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] font-medium disabled:opacity-60"
                  style={{ color: BRAND_GREEN }}
                  disabled={isBusy}
                >
                  Modifier
                </button>

                {isPublished ? (
                  <button
                    disabled={isBusy}
                    onClick={() =>
                      confirm({
                        title: 'Retirer cette annonce ?',
                        description:
                          "Elle ne sera plus visible par les jardiniers.\nTu pourras la republier plus tard.",
                        confirmText: 'Retirer',
                        danger: false,
                        onConfirm: () => doUnpublish(g.id),
                      })
                    }
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-60 font-semibold"
                  >
                    {isBusy ? '…' : 'Retirer'}
                  </button>
                ) : (
                  <button
                    disabled={isBusy}
                    onClick={() => doPublish(g.id)}
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-60 font-semibold"
                  >
                    {isBusy ? '…' : 'Publier'}
                  </button>
                )}

                <button
                  disabled={isBusy}
                  onClick={() =>
                    confirm({
                      title: 'Supprimer ce jardin ?',
                      description:
                        "Cette action est définitive.\nToutes les infos liées à ce jardin seront supprimées.",
                      confirmText: 'Supprimer',
                      danger: true,
                      onConfirm: () => doDelete(g.id),
                    })
                  }
                  type="button"
                  className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-60 font-semibold"
                >
                  {isBusy ? '…' : 'Supprimer'}
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Astuce : garde en brouillon tant que tu n’as pas ajouté toutes les infos.
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
