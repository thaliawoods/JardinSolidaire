'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setInvalid(false);

    if (!isValidEmail(email)) {
      setInvalid(true);
      setMsg('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/mdp/verifier-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        localStorage.setItem('reset_email', email);  // unified key
        window.location.href = '/reset-password';
        return;
      }

      setInvalid(true);
      setMsg("We don't recognize this email. Create an account to join JardinSolidaire.");
    } catch (err) {
      console.error('Network error:', err);
      setMsg('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', color: '#021904', marginBottom: 20, fontSize: 28 }}>
          Forgot your password?
        </h2>
        <p style={{ textAlign: 'center', color: '#4e784f', fontSize: 18, marginBottom: 30 }}>
          No worries 🌱<br />
          Enter your email and we’ll guide you to create a new one.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            style={{ padding: 12, borderRadius: 10, border: '1px solid #ddd' }}
            required
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: 14,
              backgroundColor: '#6ec173',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 18,
              marginTop: 20,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Sending…' : 'Reset password'}
          </button>

          {msg && (
            <p style={{ color: invalid ? '#e3107d' : '#021904', fontSize: 16, marginTop: 20, textAlign: 'center' }}>
              {msg}
            </p>
          )}

          {invalid && (
            <p style={{ textAlign: 'center', marginTop: 10 }}>
              <Link href="/register" className="text-[#6ec173] underline">
                Create an account
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
