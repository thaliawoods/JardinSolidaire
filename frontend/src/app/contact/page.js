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
    setOk('');
    setErr('');
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // If you want to pass auth: add Authorization from localStorage token
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || `server_error (${res.status})`);
        setSubmitting(false);
        return;
      }

      setOk('Your message has been sent. Thank you! ✅');
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
    err === 'validation_error' ? 'Please fill in all fields correctly.' :
    err === 'server_error'     ? 'Server error. Please try again.' :
    err === 'network_error'    ? 'Network error. Please try again.' :
    err || '';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Contact us</h1>

        {!!errText && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errText}
          </div>
        )}
        {!!ok && (
          <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
            {ok}
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="About a garden…"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#E3107D] text-white px-5 py-2 font-semibold disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Prefer email? Write to <a href="mailto:hello@jardinsolidaire.test" className="text-[#E3107D] underline">hello@jardinsolidaire.test</a>
        </p>
      </main>
    </div>
  );
}
