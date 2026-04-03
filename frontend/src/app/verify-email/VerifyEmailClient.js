'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function VerifyEmailClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const email = sp.get('email') || '';
  const token = sp.get('token') || '';

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const canVerify = useMemo(() => Boolean(email && token), [email, token]);

  useEffect(() => {
    if (!canVerify) {
      setStatus('error');
      setMessage("Lien invalide : il manque l'email ou le token.");
      return;
    }

    let cancelled = false;

    async function verify() {
      setStatus('loading');
      setMessage('On vérifie ton lien de confirmation…');

      try {
        const res = await fetch(`${API_BASE}/api/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        });

        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok) {
          const err = data?.error || 'server_error';
          if (err === 'token_expired') {
            setStatus('error');
            setMessage("Ton lien a expiré. Réinscris-toi pour en recevoir un nouveau.");
            return;
          }
          if (err === 'invalid_token') {
            setStatus('error');
            setMessage("Lien invalide (token incorrect).");
            return;
          }
          if (err === 'user_not_found') {
            setStatus('error');
            setMessage("Utilisateur introuvable.");
            return;
          }
          setStatus('error');
          setMessage(`Erreur : ${err}`);
          return;
        }

        const msg = data?.message || 'email_verified';
        setStatus('success');
        setMessage(
          msg === 'already_verified'
            ? 'Email déjà vérifié ✅ Tu peux te connecter.'
            : 'Email vérifié ✅ Tu peux te connecter.'
        );
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setMessage('Erreur réseau lors de la vérification.');
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [canVerify, email, token]);

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-green-700">Vérification email ✅</h1>

        <p className="mt-3 text-sm text-gray-700">
          {message} {email ? `(${email})` : ''}
        </p>

        {status === 'loading' && (
          <div className="mt-4 text-sm text-gray-500">⏳ Patiente une seconde…</div>
        )}

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
    </div>
  );
}
