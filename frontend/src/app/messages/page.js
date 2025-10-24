'use client';

import React, { useEffect, useState } from 'react';
import { fetchMessages, markRead } from '@/lib/messages';
import Link from 'next/link';

function MessageCard({ m, onToggle }) {
  return (
    <li className="border rounded-xl p-4 bg-white flex justify-between gap-3">
      <div>
        <div className="text-sm text-gray-500">
          {new Date(m.sentAt).toLocaleString()} • {m.read ? 'lu' : 'non lu'}
        </div>
        <div className="font-medium">{m.content}</div>
        {m.from && (
          <div className="text-sm text-gray-600">
            De&nbsp;: {m.from.firstName} {m.from.lastName} {m.from.email ? `(${m.from.email})` : ''}
          </div>
        )}
      </div>
      {!m.read && (
        <button
          className="px-3 py-1.5 rounded-full border hover:bg-gray-50 text-sm"
          onClick={() => onToggle(m.id)}
        >
          Marquer lu
        </button>
      )}
    </li>
  );
}

export default function MessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const data = await fetchMessages();
      setItems(Array.isArray(data?.messages) ? data.messages : []);
    } catch (e) {
      setErr(e.message || 'failed');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markOne(id) {
    try {
      await markRead({ ids: [id] });
      await load();
    } catch (e) {
      alert(e.message || 'failed');
    }
  }
  async function markAll() {
    try {
      await markRead({ all: true });
      await load();
    } catch (e) {
      alert(e.message || 'failed');
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Messagerie</h1>
        <div className="flex gap-2">
          <Link href="/owner/inbox" className="rounded-full px-4 py-2 border">Demandes</Link>
          <button onClick={markAll} className="rounded-full px-4 py-2 border hover:bg-gray-50">Tout marquer lu</button>
        </div>
      </div>

      {loading && <div className="rounded-xl border p-6 bg-white text-gray-500">Chargement…</div>}
      {err && <div className="rounded-xl border p-6 bg-rose-50 text-rose-700">{err}</div>}

      <ul className="space-y-3">
        {items.map((m) => (
          <MessageCard key={m.id} m={m} onToggle={markOne} />
        ))}
        {!loading && !items.length && !err && (
          <li className="text-gray-500">Aucun message.</li>
        )}
      </ul>
    </main>
  );
}
