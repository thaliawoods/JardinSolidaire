'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND_PINK = '#EC4899';

export default function VerifyEmailPage() {
  const sp = useSearchParams();
  const email = sp.get('email') || '';
  const token = sp.get('token') || '';

  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      if (!email || !token) {
        setStatus('error');
        setError('missing_params');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus('error');
          setError(data?.error || `HTTP_${res.status}`);
          return;
        }

        // ok
        setStatus('ok');
      } catch {
        setStatus('error');
        setError('network_error');
      }
    }

    run();
  }, [email, token]);

  const msg =
    error === 'missing_params' ? 'Lien invalide : paramètres manquants.' :
    error === 'invalid_token' ? 'Token invalide.' :
    error === 'token_expired' ? 'Lien expiré (token expiré).' :
    error === 'user_not_found' ? 'Compte introuvable.' :
    error === 'already_verified' ? 'Email déjà vérifié ✅ Tu peux te connecter.' :
    error === 'network_error' ? 'Erreur réseau. Réessaie.' :
    error ? 'Vérification impossible.' : '';

  return (
    <main className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-bold text-green-700">Vérification en cours…</h1>
            <p className="mt-3 text-sm text-gray-700">
              On confirme ton email, ne ferme pas cette page.
            </p>
          </>
        )}

        {status === 'ok' && (
          <>
            <h1 className="text-2xl font-bold text-green-700">Email vérifié ✅</h1>
            <p className="mt-3 text-sm text-gray-700">
              Ton compte est activé. Tu peux maintenant te connecter.
            </p>

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-white shadow-sm hover:opacity-95"
                style={{ backgroundColor: BRAND_PINK }}
              >
                Se connecter
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-green-700">Vérification échouée</h1>
            <p className="mt-3 text-sm text-red-700">{msg}</p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/login"
                className="inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-white shadow-sm hover:opacity-95"
                style={{ backgroundColor: BRAND_PINK }}
              >
                Se connecter
              </Link>

              <Link
                href="/register"
                className="inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition"
              >
                Réessayer
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
