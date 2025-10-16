'use client';
import useSession from '@/hooks/useSession';

export default function MonEspace() {
  const { me, loading, logout } = useSession();

  if (loading) return <main className="pt-24 p-4">Chargement…</main>;
  if (!me) return <main className="pt-24 p-4">Veuillez vous connecter.</main>;

  return (
    <main className="pt-24 max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Mon espace</h1>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Mes infos</h2>
        <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
{JSON.stringify(me, null, 2)}
        </pre>
      </section>

      <div className="flex gap-3">
        <a href="/ajouter-jardinier" className="bg-emerald-600 text-white px-4 py-2 rounded">Créer/Modifier profil Jardinier</a>
        <a href="/ajouter-proprietaire" className="bg-emerald-600 text-white px-4 py-2 rounded">Créer/Modifier profil Propriétaire</a>
      </div>

      <button onClick={logout} className="text-red-600 underline">Se déconnecter</button>
    </main>
  );
}
