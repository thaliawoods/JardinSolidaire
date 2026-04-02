'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { persistAuth } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };
const BTN_PRIMARY = { display: 'inline-block', width: '100%', padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em', opacity: 1 };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'login_failed');
        return;
      }

      persistAuth({ token: data.token });
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      router.push('/dashboard');
    } catch {
      setError('network_error');
    } finally {
      setSubmitting(false);
    }
  }

  const errorMsg =
    error === 'email_and_password_required' ? 'Email et mot de passe requis.' :
    error === 'invalid_credentials' ? 'Email ou mot de passe incorrect.' :
    error === 'email_not_verified' ? 'Vérifie ta boîte mail et clique sur le lien de confirmation avant de te connecter.' :
    error === 'server_misconfigured' ? 'Erreur de configuration serveur.' :
    error === 'network_error' ? 'Erreur réseau. Réessaie.' :
    error ? 'Connexion impossible.' : '';

  return (
    <div style={{ height: 'calc(100vh - 56px)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', marginBottom: '1.25rem' }}>
          Compte
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: '0 0 0.5rem' }}>
          Connexion
        </h1>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>
          Accède à ton tableau de bord JardinSolidaire.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>
            <label style={LABEL} htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={INPUT}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label style={LABEL} htmlFor="login-password">Mot de passe</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={INPUT}
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <Link
              href="/forgot-password"
              style={{ fontSize: '0.8125rem', color: 'var(--muted)', textDecoration: 'underline' }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {errorMsg && (
            <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            style={{ ...BTN_PRIMARY, opacity: submitting ? 0.6 : 1 }}
            disabled={submitting}
          >
            {submitting ? 'Connexion en cours…' : 'Se connecter'}
          </button>

        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>
            Créer un compte →
          </Link>
        </p>

        <p style={{ marginTop: '1rem' }}>
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
