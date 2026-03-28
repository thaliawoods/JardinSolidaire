'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };
const BTN_PRIMARY = { display: 'block', width: '100%', padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em', textAlign: 'center' };

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const e = localStorage.getItem('reset_email') || '';
    setEmail(e);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!pwd || pwd !== pwd2) {
      setMsg('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        localStorage.removeItem('reset_email');
        setMsg('Mot de passe mis à jour. Tu peux te connecter.');
      } else {
        setMsg(
          data?.error === 'password_must_be_different' ? "Choisis un mot de passe différent de l'ancien."
          : data?.error === 'user_not_found' ? 'Utilisateur introuvable.'
          : "Une erreur s'est produite."
        );
      }
    } catch (err) {
      console.error(err);
      setMsg('Erreur réseau.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: 56 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '4rem 2rem' }}>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)', marginBottom: '0.75rem' }}>
          Compte
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--foreground)', marginBottom: '2rem', lineHeight: 1.1 }}>
          Nouveau mot de passe
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={LABEL}>Email</label>
            <input
              value={email}
              readOnly
              style={{ ...INPUT, color: 'var(--muted)', background: '#f9f9f9' }}
            />
          </div>

          <div>
            <label style={LABEL}>Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              style={INPUT}
              required
            />
          </div>

          <div>
            <label style={LABEL}>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
              style={INPUT}
              required
            />
          </div>

          {msg && (
            <p style={{ fontSize: '0.875rem', color: msg.includes('jour') ? 'var(--green)' : '#c0392b', borderLeft: '2px solid currentColor', paddingLeft: '0.75rem', margin: 0 }}>
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ ...BTN_PRIMARY, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Mise à jour…' : 'Mettre à jour'}
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <Link href="/login" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
