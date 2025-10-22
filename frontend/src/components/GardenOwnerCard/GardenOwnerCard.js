import { useRouter } from 'next/router';
import { apiFetch } from '@/lib/api';

export default function GardenOwnerCard({ garden, onChanged }) {
  const router = useRouter();

  const onEdit = () => {
    router.push(`/garden/${garden.id}/edit`);
  };

  const onRetire = async () => {
    // Unpublish if published; if already draft, you could also DELETE instead.
    const path = garden.publishedAt ? `/gardens/${garden.id}/unpublish` : `/gardens/${garden.id}`;
    try {
      if (garden.publishedAt) {
        await apiFetch(path, { method: 'POST' });
      } else {
        // optional: hard delete a draft
        await apiFetch(path, { method: 'DELETE' });
      }
      onChanged?.(); // parent should re-fetch the list
    } catch (e) {
      alert(e?.message || 'Échec de la mise à jour.');
    }
  };

  const onView = () => router.push(`/garden/${garden.id}`);

  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-gray-900 font-medium">{garden.title}</div>
      <div className="mt-1 text-xs text-gray-600">Adresse : {garden.address || '—'}</div>
      <div className="mt-3 flex gap-2">
        <button onClick={onEdit} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Modifier</button>
        <button onClick={onRetire} className="px-3 py-1 rounded bg-pink-500 text-white hover:opacity-90">
          {garden.publishedAt ? 'Retirer' : 'Supprimer'}
        </button>
        <button onClick={onView} className="px-3 py-1 rounded bg-white border hover:bg-gray-50">Voir</button>
      </div>
    </div>
  );
}
