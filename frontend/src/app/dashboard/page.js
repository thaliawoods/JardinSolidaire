'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [role, setRole] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    (async () => {
      if (!token) { window.location.href = '/login'; return; }
      const res = await fetch(`${API_BASE}/api/me`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const data = await res.json().catch(()=>null);
      if (res.ok && data?.user) { setMe(data.user); setRole(data.user.role || null); }
    })();
  }, [token]);

  async function setActiveRole(r) {
    if (!token) return;
    const res = await fetch(`${API_BASE}/api/me/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: r })
    });
    if (res.ok) {
      const upd = await res.json();
      setRole(upd.role || null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-green-800 mb-4">Mon tableau de bord</h1>
      <p className="mb-6">Bonjour {me?.email}</p>

      <div className="flex gap-3 mb-8">
        <button className={`px-4 py-2 rounded ${role === 'OWNER' ? 'bg-green-700 text-white' : 'bg-gray-200'}`} onClick={() => setActiveRole('OWNER')}>Je suis propriétaire</button>
        <button className={`px-4 py-2 rounded ${role === 'GARDENER' ? 'bg-green-700 text-white' : 'bg-gray-200'}`} onClick={() => setActiveRole('GARDENER')}>Je suis jardinier</button>
      </div>

      {role === 'OWNER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/add-garden" className="block p-4 rounded-lg border">Ajouter mon jardin</a>
          <a href="/edit-garden" className="block p-4 rounded-lg border">Modifier mon jardin</a>
        </div>
      )}

      {role === 'GARDENER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/add-gardener" className="block p-4 rounded-lg border">Créer mon profil jardinier</a>
          <a href="/edit-gardener" className="block p-4 rounded-lg border">Modifier mon profil jardinier</a>
        </div>
      )}

      {!role && <p className="text-gray-600">Choisissez une interface pour continuer.</p>}
    </div>
  );
}
