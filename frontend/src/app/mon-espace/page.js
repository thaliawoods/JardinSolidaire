'use client';

import useSession from '@/hooks/useSession';

export default function MonEspace() {
  const { me, loading, error, isAuthenticated, logout, reload } = useSession();

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse h-24 bg-gray-100 rounded-2xl" />
      </main>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/connexion';
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Mon espace</h1>

      {!!error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          Erreur : {error}
        </div>
      )}

      <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
        <p className="text-sm text-gray-700">
          Connecté en tant que <strong>{me?.prenom} {me?.nom}</strong> – {me?.email}
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="/profile"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Voir mon profil
          </a>
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Déconnexion
          </button>
          <button
            onClick={reload}
            className="px-4 py-2 rounded bg-white border hover:bg-gray-50"
          >
            Recharger
          </button>
        </div>
      </div>
    </main>
  );
}
