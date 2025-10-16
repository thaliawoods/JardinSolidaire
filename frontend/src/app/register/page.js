'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [ok,        setOk]        = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setOk(false);

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'signup_failed');
        setSubmitting(false);
        return;
      }

      setOk(true);
      setTimeout(() => (window.location.href = '/login'), 800);
    } catch (err) {
      console.error(err);
      setError('network_error');
      setSubmitting(false);
    }
  }

  const errorMsg =
    error === 'email_already_used'      ? 'This email is already in use.' :
    error === 'all_fields_required'     ? 'Please fill in all fields.' :
    error === 'server_error'            ? 'Server error. Please try again.' :
    error === 'network_error'           ? 'Network error. Please try again.' :
    error ? 'Sign up failed.' : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-green-800 text-center">Create your account</h1>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="First name"
          value={firstName}
          onChange={(e)=>setFirstName(e.target.value)}
          required
          autoComplete="given-name"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Last name"
          value={lastName}
          onChange={(e)=>setLastName(e.target.value)}
          required
          autoComplete="family-name"
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        {ok && <p className="text-sm text-green-700">Account created, redirecting…</p>}

        <button
          className="w-full bg-[#e3107d] text-white rounded px-4 py-2 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Creating…' : 'Create account'}
        </button>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#e3107d]">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
