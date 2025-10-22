import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '@/lib/api';

export default function EditGarden() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({ title: '', description: '', address: '', needs: '', area: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    apiFetch(`/gardens/${id}`).then((g) => {
      setForm({
        title: g.title || '',
        description: g.description || '',
        address: g.address || '',
        needs: g.needs || '',
        area: g.area ?? '',
      });
    }).catch((e) => setMsg(e?.message || 'Erreur'));
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const payload = { ...form, area: form.area === '' ? null : Number(form.area) };
      await apiFetch(`/gardens/${id}`, { method: 'PUT', body: payload });
      setMsg('Modifications enregistrées.');
      // back to detail or my-gardens
      router.push('/my-gardens?tab=all');
    } catch (e) {
      setMsg(e?.message || 'Échec de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Modifier le jardin</h1>
      {msg ? <div className="mb-3 text-sm">{msg}</div> : null}
      <form onSubmit={save} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Titre" value={form.title}
               onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full border rounded p-2" placeholder="Description" rows={4}
               value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="Adresse" value={form.address}
               onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <input className="w-full border rounded p-2" placeholder="Besoins" value={form.needs}
               onChange={(e) => setForm({ ...form, needs: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="Surface (m²)" type="number"
               value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
          {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
