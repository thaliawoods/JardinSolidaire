'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { persistAuth } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]           = useState('');
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

      // ⭐ persist token and set first-time flag (Dashboard uses it)
      persistAuth({ token: data.token });
      localStorage.setItem('user', JSON.stringify(data.user || {}));

      router.push('/dashboard');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold text-green-800 text-center">Create your account</h1>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
          autoComplete="new-password"
        />

        {err && (
          <p className="text-sm text-red-600">
            {err === 'email_taken' ? 'This email is already registered.' :
             err === 'email_and_password_required' ? 'Email and password are required.' :
             err === 'server_error' ? 'Server error.' : err}
          </p>
        )}

        <button className="w-full bg-[#e3107d] text-white rounded px-4 py-2 disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
