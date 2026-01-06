'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const token = sp.get('token');
  const email = sp.get('email');

  return (
    <main className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-green-700">Vérification email ✅</h1>

        <p className="mt-3 text-sm text-gray-700">
          {token
            ? "On vérifie ton lien de confirmation…"
            : "Lien invalide : il manque le token."}
          {email ? ` (${email})` : ''}
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: '#EC4899' }}
          >
            Se connecter
          </Link>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition"
          >
            Accueil
          </button>
        </div>
      </div>
    </main>
  );
}
