// frontend/src/app/mdp_oublier/page.js  (you can also move to /forgot-password/page.js)
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

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
        localStorage.setItem('email', email);
        // keep the current French route until you rename the reset page
        window.location.href = '/modifier_mdp';
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
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '100px' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              color: '#021904',
              marginBottom: '20px',
              fontSize: '28px',
            }}
          >
            Forgot your password?
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#4e784f',
              fontSize: '18px',
              marginBottom: '30px',
            }}
          >
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
              style={{ padding: '12px', borderRadius: 10, border: '1px solid #ddd' }}
              required
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '14px',
                backgroundColor: '#6ec173',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '18px',
                marginTop: '20px',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Sending…' : 'Reset password'}
            </button>

            {msg && (
              <p
                style={{
                  color: invalid ? '#e3107d' : '#021904',
                  fontSize: '16px',
                  marginTop: '20px',
                  textAlign: 'center',
                }}
              >
                {msg}
              </p>
            )}

            {invalid && (
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                <Link href="/inscription" className="text-[#6ec173] underline">
                  Create an account
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
