'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ContactPage() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk]   = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setOk(''); setErr('');
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

      setOk('Your message has been sent. Thank you! ✅');
      setName(''); setEmail(''); setSubject(''); setMessage('');
      setSubmitting(false);
    } catch {
      setErr('network_error');
      setSubmitting(false);
    }
  }

  const errText =
    err === 'validation_error' ? 'Please fill in all fields correctly.' :
    err === 'server_error'     ? 'Server error. Please try again.' :
    err === 'network_error'    ? 'Network error. Please try again.' :
    err || '';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Contact</h1>

        {!!errText && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {errText}
          </div>
        )}
        {!!ok && (
          <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
            {ok}
          </div>
        )}

        <section
          className="rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: 'rgba(22,163,74,0.08)',  
            border: '1px solid rgba(22,163,74,0.15)',  
          }}
        >
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sujet</label>
              <input
                className="w-full h-11 rounded-xl px-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="À propos d'un jardin ou d'un jardinier…"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={6}
                className="w-full rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dites-nous en plus…"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full px-5 py-2 font-semibold text-white shadow-sm transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
            >
              {submitting ? 'Envoi…' : 'Envoyer le message'}
            </button>
          </form>
        </section>

        <p className="mt-6 text-sm text-gray-600">
          Vous préférez par email ? Écrivez à{' '}
          <a href="mailto:hello@jardinsolidaire.test" className="text-pink-500 hover:text-pink-600 underline">
            hello@jardinsolidaire.test
          </a>
        </p>
      </main>
    </div>
  );
}
