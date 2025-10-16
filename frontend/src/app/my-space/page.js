'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';
import Link from 'next/link';

export default function MySpacePage() {
  const router = useRouter();
  const { me, loading, error, isAuthenticated, logout, reload } = useSession();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/connexion');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse h-24 bg-gray-100 rounded-2xl" />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-800 mb-4">My space</h1>

      {!!error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          Error: {error}
        </div>
      )}

      <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
        <p className="text-sm text-gray-700">
          Signed in as <strong>{me?.prenom} {me?.nom}</strong> – {me?.email}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/profile"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            View my profile
          </Link>

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Sign out
          </button>

          <button
            onClick={reload}
            className="px-4 py-2 rounded bg-white border hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>
    </main>
  );
}
