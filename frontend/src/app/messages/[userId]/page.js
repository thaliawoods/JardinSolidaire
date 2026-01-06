'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getThread, sendMessage, markThreadRead } from '@/lib/messages';

const BRAND_GREEN = '#16a34a';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-100 rounded-2xl" />
      <div className="h-[55vh] bg-gray-100 rounded-2xl" />
      <div className="h-12 bg-gray-100 rounded-2xl" />
    </div>
  );
}

export default function ThreadPage() {
  const { userId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');

  const bottomRef = useRef(null);

  const other = useMemo(() => {
    // try to infer other user from first message (fallback)
    const m = (messages || []).find(Boolean);
    if (!m) return { id: Number(userId), firstName: '—', lastName: '' };
    // other = message.from if it's not me? but we don't know me here
    // simplest: use the "other" that matches param when present in from/to.
    const uid = Number(userId);
    const u =
      (m.from?.id === uid ? m.from : null) ||
      (m.to?.id === uid ? m.to : null) ||
      { id: uid, firstName: '—', lastName: '' };
    return u;
  }, [messages, userId]);

  async function load({ silent = false } = {}) {
    try {
      if (!silent) {
        setLoading(true);
        setErr('');
      }
      const r = await getThread(userId);
      const list = r?.messages || [];
      setMessages(Array.isArray(list) ? list : []);

      // ✅ mark only this thread as read
      await markThreadRead(userId);

      try {
        localStorage.setItem('messagesChanged', String(Date.now()));
      } catch {}
    } catch (e) {
      setErr(e?.message || 'failed');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(() => load({ silent: true }), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">Conversation</h1>
            <p className="text-gray-600 mt-1">
              Avec{' '}
              <span className="font-semibold text-gray-900">
                {other.firstName} {other.lastName}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/messages"
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
              style={{ color: BRAND_GREEN }}
            >
              ← Messagerie
            </Link>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
            >
              ← Retour
            </button>
          </div>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <>
            {/* Messages card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="h-[60vh] overflow-auto pr-2 space-y-3">
                {(messages || []).map((m) => {
                  const isMine = m.to?.id === Number(userId); // you used this heuristic before
                  return (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                        isMine
                          ? 'ml-auto bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {m.from?.firstName} {m.from?.lastName} • {new Date(m.sentAt).toLocaleString()}
                      </div>
                      <div className="text-gray-900 whitespace-pre-line">{m.content}</div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Composer */}
            <form onSubmit={onSend} className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center gap-3">
                <input
                  className="flex-1 rounded-full border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="Écrire un message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  disabled={busy || !text.trim()}
                  className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition disabled:opacity-60"
                >
                  {busy ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Astuce : les messages de cette conversation sont marqués “lus” automatiquement quand tu l’ouvres.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
