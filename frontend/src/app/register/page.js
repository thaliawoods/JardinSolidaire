'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };
const BTN_PRIMARY = { display: 'inline-block', width: '100%', padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em', opacity: 1 };

function checkPassword(pw) {
  const s = String(pw || '');
  return {
    ok:
      s.length >= 8 &&
      !/\s/.test(s) &&
      /[a-z]/.test(s) &&
      /[A-Z]/.test(s) &&
      /[0-9]/.test(s),
    rules: {
      minLength: s.length >= 8,
      noSpaces: !/\s/.test(s),
      lower: /[a-z]/.test(s),
      upper: /[A-Z]/.test(s),
      number: /[0-9]/.test(s),
    },
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pwd = useMemo(() => checkPassword(password), [password]);
  const canSubmit = email.trim() && pwd.ok && !submitting;

  async function submit(e) {
    e.preventDefault();
    setErr('');

    if (!pwd.ok) {
      setErr('password_too_weak');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || `HTTP_${res.status}`);
        return;
      }

      if (data?.message === 'verification_email_sent') {
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
        return;
      }

      router.push('/login');
    } catch {
      setErr('network_error');
    } finally {
      setSubmitting(false);
    }
  }

  const errMsg =
    err === 'email_taken' ? 'Cet email est déjà utilisé.' :
    err === 'email_and_password_required' ? 'Email et mot de passe requis.' :
    err === 'password_too_weak' ? 'Mot de passe trop faible.' :
    err === 'server_misconfigured' ? 'Serveur mal configuré.' :
    err === 'server_error' ? 'Erreur serveur.' :
    err === 'network_error' ? 'Erreur réseau. Réessaie.' :
    err ? 'Création de compte impossible.' : '';

  const rules = [
    { key: 'minLength', label: '8 caractères minimum' },
    { key: 'upper',     label: '1 majuscule' },
    { key: 'lower',     label: '1 minuscule' },
    { key: 'number',    label: '1 chiffre' },
    { key: 'noSpaces',  label: "pas d'espace" },
  ];

  return (
    <div style={{ height: 'calc(100vh - 56px)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', marginBottom: '1.25rem' }}>
          Compte
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: '0 0 0.5rem' }}>
          Créer un compte
        </h1>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>
          Rejoins JardinSolidaire en quelques secondes.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>
            <label style={LABEL} htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
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
            <label style={LABEL} htmlFor="reg-password">Mot de passe</label>
            <input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={INPUT}
              required
              autoComplete="new-password"
            />
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {rules.map(({ key, label }) => (
                <span key={key} style={{ fontSize: '0.75rem', color: pwd.rules[key] ? 'var(--green)' : 'var(--muted)' }}>
                  {pwd.rules[key] ? '✓' : '—'} {label}
                </span>
              ))}
            </div>
          </div>

          {errMsg && (
            <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626' }}>
              {errMsg}
            </div>
          )}

          <button
            type="submit"
            style={{ ...BTN_PRIMARY, opacity: !canSubmit ? 0.7 : 1, cursor: !canSubmit ? 'default' : 'pointer' }}
            disabled={!canSubmit}
            title={!canSubmit ? 'Remplis tous les champs pour continuer' : undefined}
          >
            {submitting ? 'Création…' : 'Créer mon compte'}
          </button>

        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
          En créant un compte, tu acceptes nos règles de bon usage.
        </p>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>
            Se connecter →
          </Link>
        </p>

        <p style={{ marginTop: '0.75rem' }}>
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
