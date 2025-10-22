'use client';
import { useAuth } from '@/lib/useAuth';

export default function SessionBadge() {
  const { user: me, loading, logout } = useAuth();

  if (loading) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-gray-700 text-white px-3 py-2 rounded"
        aria-live="polite"
      >
        Checking session…
      </div>
    );
  }

  if (!me) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded">
        Not signed in
      </div>
    );
  }

  const displayName = me.firstName?.trim() || me.prenom?.trim() || me.email;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded flex items-center gap-3">
      Signed in: {displayName}
      <button
        type="button"
        onClick={logout}
        className="underline hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/60 rounded"
      >
        Sign out
      </button>
    </div>
  );
}
