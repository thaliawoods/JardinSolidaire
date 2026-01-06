'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

import ConfirmModal from '@/components/ui/ConfirmModal';
import { useConfirm } from '@/hooks/useConfirm';

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

export default function EditGardenPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [initialLoaded, setInitialLoaded] = useState(false);
  const [publishedAt, setPublishedAt] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    needs: '',
    area: '',
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { confirm, confirmState, closeConfirm } = useConfirm();

  useEffect(() => {
    if (!id) return;

    (async () => {
      setMsg('');
      setErrorMsg('');
      try {
        const g = await apiFetch(`/api/gardens/${id}`);
        setForm({
          title: g.title || '',
          description: g.description || '',
          address: g.address || '',
          needs: g.needs || '',
          area: g.area ?? '',
        });
        setPublishedAt(g.publishedAt || null);
        setInitialLoaded(true);
      } catch (e) {
        console.error(e);
        setErrorMsg(e?.message || "Impossible de charger ce jardin.");
      }
    })();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErrorMsg('');

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        address: form.address.trim(),
        needs: form.needs.trim() || undefined,
        area: form.area === '' ? null : Number(form.area),
      };

      await apiFetch(`/api/gardens/${id}`, { method: 'PUT', body: payload });
      setMsg('Modifications enregistrées ✔');
      router.push('/my-gardens?tab=all');
    } catch (e2) {
      console.error(e2);
      setErrorMsg(e2?.message || 'Échec de la mise à jour.');
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    try {
      setSaving(true);
      setErrorMsg('');
      await apiFetch(`/api/gardens/${id}`, { method: 'DELETE' });
      router.push('/my-gardens?tab=all');
    } catch (e) {
      console.error(e);
      setErrorMsg("Impossible de supprimer le jardin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        danger={confirmState.danger}
        busy={saving}
        onClose={closeConfirm}
        onConfirm={async () => {
          const fn = confirmState.onConfirm;
          closeConfirm();
          if (typeof fn === 'function') await fn();
        }}
      />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Modifier mon jardin</h1>
            <Pill ok={!!publishedAt} />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Mets à jour ton annonce, puis enregistre.
          </div>
        </div>

        <Link
          href="/my-gardens?tab=all"
          className="shrink-0 rounded-full px-4 py-2 border bg-white hover:bg-gray-50 text-gray-800"
          style={{ borderColor: 'rgba(22,163,74,0.28)' }}
        >
          Retour
        </Link>
      </div>

      {msg && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {msg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMsg}
        </div>
      )}

      {!initialLoaded ? (
        <div className="rounded-2xl border bg-white p-6 text-gray-500">Chargement…</div>
      ) : (
        <form onSubmit={onSave} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de l’annonce</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              placeholder="Ex. Mon beau jardin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900"
              placeholder="Parlez un peu de votre jardin…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
              placeholder="Ex. 12 rue des Plantes, Paris"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
              <input
                name="area"
                value={form.area}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                placeholder="Ex. 50"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Besoins du jardin</label>
              <input
                name="needs"
                value={form.needs}
                onChange={onChange}
                className="mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900"
                placeholder="Ex. arrosage, désherbage…"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full px-6 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>

            <button
              type="button"
              onClick={() =>
                confirm({
                  title: 'Supprimer ce jardin ?',
                  description: "Cette action est définitive.\nTout sera supprimé pour ce jardin.",
                  confirmText: 'Supprimer',
                  danger: true,
                  onConfirm: () => doDelete(),
                })
              }
              disabled={saving}
              className="rounded-full px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-60 font-semibold"
            >
              Supprimer
            </button>

            <Link
              href={`/garden/${id}`}
              className="rounded-full px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
            >
              Voir la page
            </Link>

            <span className="text-xs text-gray-500">
              (Publier/retirer se fait depuis “Mes jardins”.)
            </span>
          </div>

          <div
            className="h-1 w-full rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))' }}
          />
        </form>
      )}
    </main>
  );
}
