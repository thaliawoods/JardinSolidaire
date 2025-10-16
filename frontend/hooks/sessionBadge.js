'use client';
import useSession from '@/hooks/useSession';

export default function SessionBadge() {
  const { me, loading, logout } = useSession();

  if (loading) return (
    <div className="fixed bottom-4 right-4 bg-gray-700 text-white px-3 py-2 rounded">
      Vérification…
    </div>
  );

  if (!me) return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded">
      Non connecté
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded">
      Connecté : {me.prenom || me.email}
      <button className="ml-3 underline" onClick={logout}>Se déconnecter</button>
    </div>
  );
}
