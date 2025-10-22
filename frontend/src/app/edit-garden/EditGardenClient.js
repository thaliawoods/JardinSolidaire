'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function EditGardenClient() {
  const router = useRouter();
  const search = useSearchParams();
  const id = search.get('id');

  const [form, setForm] = useState({ title: '', description: '', address: '', needs: '', area: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      try {
        const g = await apiFetch(`/api/gardens/${id}`);
        if (!alive) return;
        setForm({
          title: g?.title || '',
          description: g?.description || '',
          address: g?.address || '',
          needs: g?.needs || '',
          area: g?.area ?? '',
        });
      } catch (e) {
        if (!alive) return;
        setMsg(e?.message || 'Erreur');
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setMsg('');
    try {
      const payload = { ...form, area: form.area === '' ? null : Number(form.area) };
      await apiFetch(`/api/gardens/${id}`, { method: 'PUT', body: payload });
      setMsg('Modifications enregistrées.');
      router.push('/my-gardens?tab=all');
    } catch (e) {
      setMsg(e?.message || 'Échec de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">modifier le jardin</h1>
      {msg ? <div className="mb-3 text-sm">{msg}</div> : null}
      <form onSubmit={save} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="titre"
               value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full border rounded p-2" placeholder="description" rows={4}
               value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="adresse"
               value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <input className="w-full border rounded p-2" placeholder="besoins"
               value={form.needs} onChange={(e) => setForm({ ...form, needs: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="surface (m²)" type="number"
               value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <button disabled={loading || !id} className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
          {loading ? 'enregistrement…' : 'enregistrer'}
        </button>
      </form>
    </div>
  );
}
