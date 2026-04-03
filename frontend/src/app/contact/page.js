'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid var(--border)',
  background: '#fff',
  color: 'var(--foreground)',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--muted)',
  marginBottom: '0.375rem',
};

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setOk('');
    setErr('');

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || `server_error (${res.status})`);
        setSubmitting(false);
        return;
      }
      setOk('Message envoyé. Merci !');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitting(false);
    } catch {
      setErr('network_error');
      setSubmitting(false);
    }
  }

  const errText =
    err === 'validation_error'
      ? 'Veuillez remplir tous les champs correctement.'
      : err === 'server_error'
      ? 'Erreur serveur. Veuillez réessayer.'
      : err === 'network_error'
      ? 'Erreur réseau. Veuillez réessayer.'
      : err || '';

  return (
    <div style={{ background: '#fff', color: 'var(--foreground)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: '2rem',
            color: 'var(--foreground)',
            marginBottom: '1.5rem',
          }}
        >
          Contact
        </h1>

        {!!errText && (
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
            {errText}
          </p>
        )}
        {!!ok && (
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
            {ok}
          </p>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={onSubmit}>
          <div>
            <label style={labelStyle}>Nom</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Sujet</label>
            <input
              style={inputStyle}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="À propos d'un jardin ou d'un·e jardinier·e…"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              rows={6}
              style={{ ...inputStyle, resize: 'vertical' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dites-nous en plus…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.25rem',
              cursor: submitting ? 'default' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Envoi…' : 'Envoyer le message'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          Vous préférez par email ? Écrivez à{' '}
          <a
            href="mailto:contact@jardinsolidaire.fr"
            style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            contact@jardinsolidaire.fr
          </a>
        </p>
      </div>
    </div>
  );
}
