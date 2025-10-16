'use client';
import { useState } from 'react';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'login_failed');

      // ✅ Save token, go home (or /mon-espace)
      localStorage.setItem('token', data.token);
      window.location.href = '/mon-espace';
    } catch (e) {
      setError('Identifiants invalides');
    }
  }

  return (
    <main className="pt-24 max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
      {!!error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Mot de passe" type="password"
               value={mot_de_passe} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Connexion</button>
      </form>
    </main>
  );
}
