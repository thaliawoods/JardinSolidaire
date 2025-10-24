'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listConversations, listInbox, markAllRead } from '@/lib/messages';

export default function MessagesPage() {
  const [convos, setConvos] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const [c, i] = await Promise.all([listConversations(), listInbox({ unreadOnly: true })]);
        setConvos(c?.conversations || []);
        setInbox(i?.messages || []);
      } catch (e) {
        setErr(e.message || 'failed');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Messagerie</h1>

      {err && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700">{err}</div>}
      {loading && <div>Chargement…</div>}

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Non lus</h2>
          <button
            onClick={async () => {
              await markAllRead();
              const i = await listInbox({ unreadOnly: true });
              setInbox(i?.messages || []);
            }}
            className="px-3 py-1.5 rounded-full border text-sm"
          >
            Tout marquer comme lu
          </button>
        </div>
        <ul className="space-y-2">
          {inbox.map((m) => (
            <li key={m.id} className="rounded border p-3 bg-yellow-50">
              <div className="text-sm text-gray-600">
                De&nbsp;
                <Link className="underline" href={`/messages/${m.from?.id}`}>
                  {m.from?.firstName} {m.from?.lastName}
                </Link>{' '}
                — {new Date(m.sentAt).toLocaleString()}
              </div>
              <div>{m.content}</div>
            </li>
          ))}
          {!inbox.length && <li className="text-sm text-gray-500">Aucun message non lu.</li>}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <ul className="space-y-2">
          {convos.map((c) => (
            <li key={c.user.id} className="rounded border p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {c.user.firstName} {c.user.lastName}
                </div>
                <div className="text-sm text-gray-600 line-clamp-1">
                  {c.lastMessage?.from?.id === c.user.id ? `${c.user.firstName}: ` : 'Vous: '}
                  {c.lastMessage?.content}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.unread > 0 && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                    {c.unread} non lus
                  </span>
                )}
                <Link href={`/messages/${c.user.id}`} className="px-3 py-1.5 rounded-full border">
                  Ouvrir
                </Link>
              </div>
            </li>
          ))}
          {!convos.length && <li className="text-sm text-gray-500">Aucune conversation.</li>}
        </ul>
      </section>
    </main>
  );
}
