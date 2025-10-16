'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSession from '@/hooks/useSession';

export default function MySpacePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSession();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?next=/my-space');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-gray-600">
        Vérification de la session…
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Mon espace</h1>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
          <h2 className="font-semibold mb-2">Profil</h2>
          <p className="text-sm text-gray-700">
            Connecté en tant que <strong>{user?.prenom || user?.email}</strong>
          </p>
          <Link href="/profile" className="inline-block mt-3 text-[#e3107d]">
            Modifier mon profil
          </Link>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
          <h2 className="font-semibold mb-2">Messagerie</h2>
          <p className="text-sm text-gray-700">Consultez vos messages.</p>
          <Link href="/messages" className="inline-block mt-3 text-[#e3107d]">
            Ouvrir la messagerie
          </Link>
        </div>
      </section>
    </main>
  );
}
