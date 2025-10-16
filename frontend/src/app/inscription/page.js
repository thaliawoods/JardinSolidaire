'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function InscriptionPage() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setOk(false);

    try {
      const res = await fetch(`${API_BASE}/api/inscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom,
          nom,
          email,
          mot_de_passe: motDePasse, // 👈 IMPORTANT
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'signup_failed');
        return;
      }

      setOk(true);
      // Redirect to login
      setTimeout(() => (window.location.href = '/connexion'), 800);
    } catch (err) {
      console.error(err);
      setError('network_error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-green-800 text-center">Inscription</h1>

        <input className="w-full border rounded px-3 py-2" placeholder="Prénom" value={prenom} onChange={(e)=>setPrenom(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Nom" value={nom} onChange={(e)=>setNom(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e)=>setMotDePasse(e.target.value)} />

        {error && (
          <p className="text-sm text-red-600">
            {error === 'email_already_used' ? 'Cet email est déjà utilisé.' : 'Erreur à l’inscription.'}
          </p>
        )}
        {ok && <p className="text-sm text-green-700">Compte créé, redirection…</p>}

        <button className="w-full bg-[#e3107d] text-white rounded px-4 py-2">Créer mon compte</button>

        <div className="text-center text-sm">
          Déjà inscrit ? <Link href="/connexion" className="text-[#e3107d]">Se connecter</Link>
        </div>
      </form>
    </div>
  );
}
