'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { persistAuth } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BRAND_PINK = '#E3107D';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
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

      persistAuth({ token: data.token });
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      router.push('/dashboard');
    } catch {
      setErr('network_error');
    } finally {
      setSubmitting(false);
    }
  }

  const errMsg =
    err === 'email_taken' ? 'Cet email est déjà utilisé.' :
    err === 'email_and_password_required' ? 'Email et mot de passe requis.' :
    err === 'server_error' ? 'Erreur serveur.' :
    err === 'network_error' ? 'Erreur réseau. Réessaie.' :
    err ? 'Création de compte impossible.' : '';

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-700">Créer un compte</h1>
          <p className="mt-2 text-sm text-gray-600">
            Rejoins JardinSolidaire en quelques secondes.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Mot de passe">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700"
                required
                autoComplete="new-password"
              />
            </Field>

            <div className="flex items-center justify-end -mt-1">
              <Link href="/login" className="text-sm text-[#e3107d] hover:underline">
                Déjà un compte ?
              </Link>
            </div>

            {errMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errMsg}
              </div>
            )}

            <button
              className="w-full rounded-full px-5 py-3 text-white shadow-sm transition disabled:opacity-60 hover:opacity-95"
              style={{ backgroundColor: BRAND_PINK }}
              disabled={submitting}
            >
              {submitting ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-700">
            En créant un compte, tu acceptes nos règles de bon usage.
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition text-sm"
              aria-label="Retour à l’accueil"
            >
              <span aria-hidden>←</span> Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-800 mb-2">{label}</span>
      {children}
    </label>
  );
}
