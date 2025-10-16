'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 👇 IMPORTANT: match backend field name
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'login_failed');
        return;
      }

      // Save session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Optional: fetch /api/me to hydrate full profile state
      // const meRes = await fetch(`${API_BASE}/api/me`, {
      //   headers: { Authorization: `Bearer ${data.token}` },
      // });
      // const me = await meRes.json();
      // localStorage.setItem('me', JSON.stringify(me.user));

      // Go home (or dashboard)
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError('network_error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-green-800 text-center">Connexion à JardinSolidaire</h1>

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {error && (
          <p className="text-sm text-red-600">
            {error === 'email_and_password_required' && 'Email et mot de passe requis.'}
            {error === 'invalid_credentials' && 'Identifiants incorrects.'}
            {error !== 'email_and_password_required' && error !== 'invalid_credentials' && 'Erreur de connexion.'}
          </p>
        )}

        <button className="w-full bg-[#e3107d] text-white rounded px-4 py-2">
          Se connecter
        </button>

        <div className="text-center text-sm">
          Pas encore de compte ? <Link href="/inscription" className="text-[#e3107d]">Inscrivez-vous</Link>
        </div>
      </form>
    </div>
  );
}
