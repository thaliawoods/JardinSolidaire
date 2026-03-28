'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getThread, sendMessage, markThreadRead } from '@/lib/messages';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const BTN_PRIMARY = { padding: '0.6rem 1.25rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em' };
const BTN_SECONDARY = { padding: '0.6rem 1.25rem', background: 'none', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', letterSpacing: '0.01em' };

function normalizePerson(raw, fallbackUserId) {
  if (!raw) return null;
  const base = raw.user || raw.owner || raw.gardener || raw.utilisateur || raw;
  const firstName = base.firstName ?? base.prenom ?? '';
  const lastName = base.lastName ?? base.nom ?? '';
  const uid = base.userId ?? base.user_id ?? base.id ?? fallbackUserId;
  return {
    id: String(base.id ?? ''),
    userId: String(uid ?? fallbackUserId ?? ''),
    firstName: String(firstName || ''),
    lastName: String(lastName || ''),
  };
}

async function fetchOtherByUserId(userId) {
  const tries = [
    `${API_BASE}/api/users/${userId}`,
    `${API_BASE}/api/owners/${userId}`,
    `${API_BASE}/api/gardeners/${userId}`,
    `${API_BASE}/api/jardiniers/${userId}`,
    `${API_BASE}/api/proprietaires/${userId}`,
  ];
  for (const url of tries) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      const p = normalizePerson(data, userId);
      if (p?.firstName || p?.lastName) return p;
    } catch {}
  }
  return null;
}

export default function ThreadPage() {
  const params = useParams();
  const userId = params?.userId;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [otherProfile, setOtherProfile] = useState(null);
  const [loadingOther, setLoadingOther] = useState(true);

  const bottomRef = useRef(null);

  const inferredOther = useMemo(() => {
    const uid = Number(userId);
    const m = (messages || []).find(Boolean);
    if (!m || !uid) return { id: uid || 0, firstName: '—', lastName: '' };
    const u =
      (m.from?.id === uid ? m.from : null) ||
      (m.to?.id === uid ? m.to : null) ||
      { id: uid, firstName: '—', lastName: '' };
    return u;
  }, [messages, userId]);

  const other = useMemo(() => {
    if (otherProfile?.firstName || otherProfile?.lastName) return otherProfile;
    return inferredOther;
  }, [otherProfile, inferredOther]);

  async function load({ silent = false } = {}) {
    try {
      if (!silent) { setLoading(true); setErr(''); }
      const r = await getThread(userId);
      const list = r?.messages || [];
      setMessages(Array.isArray(list) ? list : []);
      await markThreadRead(userId);
      try { localStorage.setItem('messagesChanged', String(Date.now())); } catch {}
    } catch (e) {
      setErr(e?.message || 'failed');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) return;
    load();
    const t = setInterval(() => load({ silent: true }), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      setLoadingOther(true);
      const p = await fetchOtherByUserId(userId);
      if (!alive) return;
      setOtherProfile(p);
      setLoadingOther(false);
    })();
    return () => { alive = false; };
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function onSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setBusy(true);
      await sendMessage({ toUserId: Number(userId), content: text.trim() });
      setText('');
      await load({ silent: true });
    } catch (e) {
      setErr(e?.message || 'send_failed');
    } finally {
      setBusy(false);
    }
  }

  const otherName = loadingOther ? '…' : (`${other.firstName} ${other.lastName}`.trim() || '—');

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: 56 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 2rem' }}>

        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)', marginBottom: '0.3rem' }}>Messagerie</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--foreground)', margin: 0 }}>
              {otherName}
            </h1>
          </div>
          <button onClick={() => router.back()} style={BTN_SECONDARY}>
            ← Retour
          </button>
        </div>

        {err && (
          <p style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '1rem', borderLeft: '2px solid #c0392b', paddingLeft: '0.75rem' }}>{err}</p>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Chargement…</p>
        ) : (
          <>
            <div style={{ border: '1px solid var(--border)', height: '60vh', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {messages.length === 0 && (
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', margin: 'auto' }}>Aucun message pour l&apos;instant.</p>
              )}
              {messages.map((m) => {
                const isMine = m.to?.id === Number(userId);
                return (
                  <div
                    key={m.id}
                    style={{
                      maxWidth: '80%',
                      alignSelf: isMine ? 'flex-end' : 'flex-start',
                      borderLeft: isMine ? 'none' : '2px solid var(--green)',
                      borderRight: isMine ? '2px solid var(--border)' : 'none',
                      paddingLeft: isMine ? '0.75rem' : '0.75rem',
                      paddingRight: isMine ? '0.75rem' : '0',
                      paddingTop: '0.375rem',
                      paddingBottom: '0.375rem',
                    }}
                  >
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: '0 0 0.2rem' }}>
                      {m.from?.firstName} {m.from?.lastName} · {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0, whiteSpace: 'pre-line' }}>{m.content}</p>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={onSend} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                style={{ ...INPUT, flex: 1 }}
                placeholder="Écrire un message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="submit"
                disabled={busy || !text.trim()}
                style={{ ...BTN_PRIMARY, opacity: (busy || !text.trim()) ? 0.5 : 1, cursor: (busy || !text.trim()) ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {busy ? 'Envoi…' : 'Envoyer →'}
              </button>
            </form>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Les messages de cette conversation sont marqués comme lus automatiquement à l&apos;ouverture.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
