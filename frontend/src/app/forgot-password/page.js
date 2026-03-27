'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const BTN_PRIMARY = { display: 'inline-block', width: '100%', padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em', opacity: 1 };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setInvalid(false);

    if (!isValidEmail(email)) {
      setInvalid(true);
      setMsg('Adresse email invalide.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/mdp/verifier-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        localStorage.setItem('reset_email', email);  // unified key
        window.location.href = '/reset-password';
        return;
      }

      setInvalid(true);
      setMsg('Adresse email non trouvée.');
    } catch (err) {
      console.error('Network error:', err);
      setMsg('Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: 56 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '4rem 2rem' }}>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', marginBottom: '1.25rem' }}>
          Compte
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: '0 0 0.5rem' }}>
          Mot de passe oublié ?
        </h1>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>
          Saisis ton adresse email et nous t'enverrons un lien pour en créer un nouveau.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Adresse email"
              onChange={(e) => setEmail(e.target.value)}
              style={INPUT}
              required
              autoComplete="email"
            />
          </div>

          {msg && (
            <p style={{ fontSize: '0.875rem', color: invalid ? '#dc2626' : 'var(--foreground)', margin: 0 }}>
              {msg}
              {invalid && (
                <>
                  {' '}
                  <Link href="/register" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>
                    Créer un compte →
                  </Link>
                </>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ ...BTN_PRIMARY, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Envoi en cours…' : 'Réinitialiser'}
          </button>

        </form>

        <p style={{ marginTop: '2rem' }}>
          <Link
            href="/"
            style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}
            aria-label="Retour à l'accueil"
          >
            ← Retour à l'accueil
          </Link>
        </p>

      </div>
    </div>
  );
}
