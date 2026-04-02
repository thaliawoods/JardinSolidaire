'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { listConversations, listInbox, markAllRead } from '@/lib/messages';

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const withId = sp.get('with');
    if (withId && String(withId).trim() !== '') {
      router.replace(`/messages/${withId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [convos, setConvos] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [marking, setMarking] = useState(false);

  async function reload() {
    try {
      setLoading(true);
      setErr('');
      const [c, i] = await Promise.all([listConversations(), listInbox({ unreadOnly: true })]);
      setConvos(c?.conversations || []);
      setInbox(i?.messages || []);
    } catch (e) {
      setErr(e?.message || 'failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const unreadTotal = useMemo(() => {
    const convUnread = (convos || []).reduce((sum, c) => sum + Number(c?.unread || 0), 0);
    const inboxUnread = Array.isArray(inbox) ? inbox.length : 0;
    return convUnread + inboxUnread;
  }, [convos, inbox]);

  const flatBtn = {
    background: '#fff',
    border: '1px solid var(--border)',
    fontSize: '0.8125rem',
    color: 'var(--foreground)',
    cursor: 'pointer',
    padding: '0.4rem 0.875rem',
    fontFamily: 'inherit',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
            Messagerie
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
            Retrouvez vos conversations et vos messages non lus.
            {unreadTotal > 0 && (
              <span style={{ marginLeft: '0.5rem', color: 'var(--foreground)' }}>
                {unreadTotal} non lu{unreadTotal > 1 ? 's' : ''}.
              </span>
            )}
          </p>
        </div>

        {err && (
          <div style={{ border: '1px solid var(--border)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: '1.5rem' }}>
            {err}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[80, 160, 120].map((h, i) => (
              <div key={i} style={{ height: h, background: '#f5f5f5', border: '1px solid var(--border)' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <section style={{ border: '1px solid var(--border)', padding: '1.5rem', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--foreground)', margin: 0 }}>Non lus</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Messages reçus qui n&apos;ont pas encore été ouverts.</p>
                </div>
                <button
                  type="button"
                  disabled={marking || inbox.length === 0}
                  onClick={async () => {
                    try {
                      setMarking(true);
                      await markAllRead();
                      const i = await listInbox({ unreadOnly: true });
                      setInbox(i?.messages || []);
                      try { localStorage.setItem('messagesChanged', String(Date.now())); } catch {}
                    } finally { setMarking(false); }
                  }}
                  style={{ ...flatBtn, opacity: (marking || inbox.length === 0) ? 0.5 : 1, cursor: inbox.length === 0 ? 'not-allowed' : 'pointer' }}
                >
                  {marking ? '…' : 'Tout marquer comme lu'}
                </button>
              </div>

              {inbox.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  Aucun message non lu.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {inbox.map((m) => (
                    <div key={m.id} style={{ border: '1px solid var(--border)', padding: '1rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                          De{' '}
                          <Link href={`/messages/${m.from?.id}`} style={{ color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                            {m.from?.firstName} {m.from?.lastName}
                          </Link>
                          <span style={{ marginLeft: '0.5rem' }}>· {new Date(m.sentAt).toLocaleString()}</span>
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--foreground)', whiteSpace: 'pre-line' }}>{m.content}</div>
                      </div>
                      <Link href={`/messages/${m.from?.id}`} style={flatBtn}>Ouvrir →</Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={{ border: '1px solid var(--border)', padding: '1.5rem', background: '#fff' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--foreground)', margin: 0 }}>Conversations</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Toutes vos discussions en cours.</p>
              </div>

              {convos.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  Aucune conversation. Dès que vous envoyez ou recevez un message, elle apparaîtra ici.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {convos.map((c) => {
                    const other = c.user || {};
                    const last = c.lastMessage || null;
                    const isFromOther = last?.from?.id === other.id;
                    const previewPrefix = isFromOther ? `${other.firstName || '—'}: ` : 'Vous : ';
                    const preview = last?.content || '';

                    return (
                      <div key={other.id} style={{ border: '1px solid var(--border)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.9375rem', color: 'var(--foreground)' }}>
                            {other.firstName} {other.lastName}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '40ch' }}>
                            {previewPrefix}{preview}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                          {Number(c.unread || 0) > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--foreground)', border: '1px solid var(--border)', padding: '0.1rem 0.5rem' }}>
                              {c.unread} non lu{c.unread > 1 ? 's' : ''}
                            </span>
                          )}
                          <Link href={`/messages/${other.id}`} style={flatBtn}>Ouvrir →</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
