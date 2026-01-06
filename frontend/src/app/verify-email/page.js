'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function VerifyEmailPage() {
  const sp = useSearchParams();
  const email = sp.get('email') || '';
  const token = sp.get('token') || '';

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => {
    return Boolean(email && token);
  }, [email, token]);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!canSubmit) {
        setStatus('error');
        setMessage("Lien invalide : email ou token manquant.");
        return;
      }

      setStatus('loading');
      setMessage('');

      try {
        const res = await fetch(`${API_BASE}/api/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // erreurs connues côté API
          const err = data?.error || 'server_error';

          const pretty =
            err === 'token_expired'
              ? "Ce lien a expiré. Demande un nouvel email de vérification."
              : err === 'invalid_token'
              ? "Ce lien est invalide. Vérifie que tu as utilisé le dernier email reçu."
              : err === 'user_not_found'
              ? "Aucun compte ne correspond à cet email."
              : err === 'email_and_token_required'
              ? "Lien invalide : informations manquantes."
              : err === 'no_verification_in_progress'
              ? "Aucune vérification en cours pour ce compte."
              : "Une erreur est survenue. Réessaie plus tard.";

          if (!cancelled) {
            setStatus('error');
            setMessage(pretty);
          }
          return;
        }

        // success
        const okMsg =
          data?.message === 'already_verified'
            ? "Ton email était déjà vérifié ✅"
            : "Email vérifié ✅ Ton compte est activé.";

        if (!cancelled) {
          setStatus('success');
          setMessage(okMsg);
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setMessage("Impossible de contacter le serveur. Vérifie ta connexion.");
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [email, token, canSubmit]);

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 16px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Vérification de l’email</h1>

      {status === 'loading' && (
        <p style={{ fontSize: 16, lineHeight: 1.5 }}>Vérification en cours…</p>
      )}

      {status === 'success' && (
        <>
          <p style={{ fontSize: 16, lineHeight: 1.5 }}>{message}</p>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Link
              href="/login"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'black',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Se connecter
            </Link>

            <Link
              href="/"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #ddd',
                textDecoration: 'none',
              }}
            >
              Retour à l’accueil
            </Link>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <p style={{ fontSize: 16, lineHeight: 1.5 }}>{message || "Lien invalide."}</p>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Link
              href="/login"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'black',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Aller à la connexion
            </Link>

            <Link
              href="/"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #ddd',
                textDecoration: 'none',
              }}
            >
              Retour à l’accueil
            </Link>
          </div>
        </>
      )}

      {status === 'idle' && (
        <p style={{ fontSize: 16, lineHeight: 1.5 }}>
          Préparation de la vérification…
        </p>
      )}

      <div style={{ marginTop: 28, fontSize: 13, color: '#666' }}>
        <p style={{ margin: 0 }}>
          Email : <span style={{ fontFamily: 'monospace' }}>{email || '—'}</span>
        </p>
      </div>
    </main>
  );
}
