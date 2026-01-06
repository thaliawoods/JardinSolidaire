'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckEmailClient() {
  const sp = useSearchParams();
  const email = sp.get('email');

  return (
    <main className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-green-700">Vérifie ta boîte mail 📩</h1>

        <p className="mt-3 text-sm text-gray-700">
          On t’a envoyé un lien de confirmation{email ? ` à ${email}` : ''}.
          Clique dessus pour activer ton compte.
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Pense à vérifier tes spams / promotions si tu ne le vois pas.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: '#EC4899' }}
          >
            Se connecter
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition"
          >
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
