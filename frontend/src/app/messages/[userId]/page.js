'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getThread, sendMessage, markAllRead } from '@/lib/messages';

export default function ThreadPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const bottomRef = useRef(null);

  async function load() {
    try {
      setErr('');
      const r = await getThread(userId);
      setMessages(r?.messages || []);
      // mark my inbox as read (safe)
      await markAllRead();
    } catch (e) {
      setErr(e.message || 'failed');
    }
  }

  useEffect(() => {
    load();
    // simple polling to keep fresh
    const t = setInterval(load, 5000);
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
      await load();
    } catch (e) {
      setErr(e.message || 'send_failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <button onClick={() => router.back()} className="text-sm underline">
        ← retour
      </button>

      <h1 className="text-2xl font-semibold">Conversation</h1>
      {err && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700">{err}</div>}

      <div className="rounded-xl border bg-white p-4 h-[60vh] overflow-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-3 py-2 ${
              m.to?.id === Number(userId)
                ? 'self-end ml-auto bg-green-100 border border-green-200'
                : 'bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="text-xs text-gray-500 mb-0.5">
              {m.from?.firstName} {m.from?.lastName} • {new Date(m.sentAt).toLocaleString()}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSend} className="flex items-center gap-3">
        <input
          className="flex-1 rounded-full border px-3 py-2"
          placeholder="Écrire un message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          disabled={busy || !text.trim()}
          className="rounded-full px-4 py-2 bg-pink-500 text-white disabled:opacity-60"
        >
          Envoyer
        </button>
      </form>
    </main>
  );
}
