'use client';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (password !== confirm) {
      setMessage("🚫 The two passwords don't match. Please try again.");
      return;
    }
    if (!isValid) {
      setMessage('🔐 Your password must meet the requirements below.');
      return;
    }
    if (!email) {
      setMessage('No email found for this reset. Please start from the Forgot Password page.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/modifier_mdp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nouveauMotDePasse: password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        setMessage(data?.error || data?.message || 'An error occurred. Please try again later.');
        return;
      }

      setMessage('🎉 Your password has been updated. Redirecting to login…');
      localStorage.removeItem('email');
      setTimeout(() => {
        window.location.href = '/connexion'; 
      }, 900);
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const styles = {
    container: { maxWidth: '500px', margin: '0 auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { textAlign: 'center', color: '#021904', marginBottom: '20px', fontSize: '28px' },
    intro: { textAlign: 'center', color: '#4e784f', fontSize: '18px', marginBottom: '30px', lineHeight: 1.5 },
    passwordWrapper: { position: 'relative', marginBottom: '20px' },
    passwordInput: { width: '100%', padding: '14px', paddingRight: '50px', border: '2px solid #6ec173', borderRadius: '10px', fontSize: '18px', color: '#021904' },
    toggleButton: { position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6ec173', fontSize: '14px' },
    button: { padding: '14px', backgroundColor: '#6ec173', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', marginTop: '10px' },
    hint: (ok) => ({ color: ok ? '#4e784f' : '#e3107d', fontSize: '14px', marginBottom: '5px' }),
    msg: (ok) => ({ color: ok ? '#4e784f' : '#e3107d', textAlign: 'center', marginTop: '15px' }),
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '100px' }}>
        <div style={styles.container}>
          <h2 style={styles.title}>Reset your password</h2>
          <p style={styles.intro}>
            🌱 Keep your account safe with a strong password.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.passwordWrapper}>
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
                autoComplete="new-password"
                style={styles.passwordInput}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} style={styles.toggleButton}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            <div style={styles.passwordWrapper}>
              <input
                type={showPw ? 'text' : 'password'}
                name="confirmPassword"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
                style={styles.passwordInput}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} style={styles.toggleButton}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            <p style={styles.hint(hasMinLength)}>✔️ At least 8 characters</p>
            <p style={styles.hint(hasUppercase)}>✔️ One uppercase letter</p>
            <p style={styles.hint(hasNumber)}>✔️ One number</p>
            <p style={styles.hint(hasSpecialChar)}>✔️ One special character</p>

            <button type="submit" disabled={submitting} style={{ ...styles.button, opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Saving…' : 'Save new password'}
            </button>

            {message && (
              <p style={styles.msg(message.startsWith('🎉'))}>{message}</p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
