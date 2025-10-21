'use client';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
        setMsg('Votre mot de passe a été mis à jour. Vous pouvez vous connecter.');
      } else {
        setMsg(
          data?.error === 'password_must_be_different' ? "Choisissez un mot de passe différent de l’ancien."
          : data?.error === 'user_not_found' ? "Utilisateur introuvable."
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
    <div className="min-h-screen flex items-center justify-center bg-white pt-24">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-green-800 text-center">Nouveau mot de passe</h1>
        <input value={email} readOnly className="w-full border rounded px-3 py-2 bg-gray-50" />
        <input type="password" placeholder="Nouveau mot de passe" value={pwd}
               onChange={(e)=>setPwd(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Confirmer le mot de passe" value={pwd2}
               onChange={(e)=>setPwd2(e.target.value)} className="w-full border rounded px-3 py-2" />
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button disabled={submitting}
                className="w-full bg-[#e3107d] text-white rounded px-4 py-2 disabled:opacity-60">
          {submitting ? 'Mise à jour…' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}
