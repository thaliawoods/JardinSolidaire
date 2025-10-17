'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || 'login_failed');
        setSubmitting(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError('network_error');
      setSubmitting(false);
    }
  }

  const errorMsg =
    error === 'email_and_password_required' ? 'Email and password are required.' :
    error === 'invalid_credentials'        ? 'Incorrect email or password.' :
    error === 'server_misconfigured'       ? 'Server configuration error.' :
    error === 'network_error'              ? 'Network error. Please try again.' :
    error ? 'Login failed.' : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-green-800 text-center">Connexion</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
          autoComplete="current-password"
        />

        <div className="text-right -mt-2">
          <Link href="/forgot-password" className="text-sm text-[#e3107d] hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <button
          className="w-full bg-[#e3107d] text-white rounded px-4 py-2 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Connexion en cours…' : 'Se connecter'}
        </button>

        <div className="text-center text-sm">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-[#e3107d]">
            Créer un compte
          </Link>
        </div>
      </form>
    </div>
  );
}
