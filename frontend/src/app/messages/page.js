'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function normalizeThread(t) {

  return {
    peerId: Number(t.peerId),
    peer: t.peer
      ? {
          id: Number(t.peer.id_utilisateur),
          firstName: t.peer.prenom ?? '',
          lastName: t.peer.nom ?? '',
          avatarUrl: t.peer.photo_profil ?? null,
        }
      : { id: Number(t.peerId), firstName: 'User', lastName: String(t.peerId), avatarUrl: null },
    lastMessage: t.lastMessage
      ? {
          id: Number(t.lastMessage.id_message),
          text: t.lastMessage.contenu ?? '',
          sentAt: t.lastMessage.date_envoi ? new Date(t.lastMessage.date_envoi) : null,
          outgoing: !!t.lastMessage.outgoing,
          read: !!t.lastMessage.lu,
        }
      : null,
  };
}

function normalizeMessage(m) {
  return {
    id: Number(m.id_message),
    text: m.contenu ?? '',
    sentAt: m.date_envoi ? new Date(m.date_envoi) : null,
    outgoing: !!m.outgoing,
    read: !!m.lu,
  };
}

export default function MessagesPage() {
  const [token, setToken] = useState('');
  const [me, setMe] = useState(null);
  const [threads, setThreads] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState('');
  const scrollerRef = useRef(null);

  useEffect(() => {
    const t = localStorage.getItem('token') || '';
    setToken(t);

    const cached = localStorage.getItem('me');
    if (cached) {
      try { setMe(JSON.parse(cached)); } catch {}
    } else if (t) {
      fetch(`${API_BASE}/api/me`, { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => r.json())
        .then((data) => {
          if (data?.user) {
            setMe(data.user);
            localStorage.setItem('me', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoadingThreads(true);
    setError('');
    fetch(`${API_BASE}/api/messages/threads`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.threads) ? data.threads.map(normalizeThread) : [];
        setThreads(list);
      })
      .catch(() => {
        setThreads([]);
        setError('Could not load conversations.');
      })
      .finally(() => setLoadingThreads(false));
  }, [token]);

  useEffect(() => {
    if (!token || !activePeer) return;
    setLoadingMsgs(true);
    setError('');
    fetch(`${API_BASE}/api/messages/with/${activePeer}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then((data) => {
        const msgs = Array.isArray(data?.messages) ? data.messages.map(normalizeMessage) : [];
        setMessages(msgs);
      })
      .catch(() => {
        setMessages([]);
        setError('Could not load messages.');
      })
      .finally(() => setLoadingMsgs(false));
  }, [token, activePeer]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const activeThread = useMemo(
    () => threads.find((t) => t.peerId === activePeer) || null,
    [threads, activePeer]
  );

  const send = async () => {
    if (!text.trim() || !activePeer) return;
    try {
      const res = await fetch(`${API_BASE}/api/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: activePeer, contenu: text.trim() }), 
      });
      if (!res.ok) throw new Error('send_failed');
      setText('');
      const latest = await fetch(`${API_BASE}/api/messages/with/${activePeer}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }).then((r) => r.json());
      const msgs = Array.isArray(latest?.messages) ? latest.messages.map(normalizeMessage) : [];
      setMessages(msgs);
    } catch (e) {
      console.error(e);
      alert('Failed to send your message.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <p className="text-gray-700">
            You must be signed in.{' '}
            <Link className="text-pink-600 underline" href="/connexion">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex gap-4">
        <aside className="w-80 max-w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Conversations</h2>
            <Link href="/mon-espace" className="text-xs text-emerald-700 underline">My space</Link>
          </div>

          {!!error && !loadingThreads && (
            <p className="text-xs text-red-600 mb-2">{error}</p>
          )}

          {loadingThreads ? (
            <p className="text-sm text-gray-600">Loading…</p>
          ) : threads.length === 0 ? (
            <p className="text-sm text-gray-600">No conversations yet.</p>
          ) : (
            <ul className="space-y-2">
              {threads.map((t) => (
                <li key={t.peerId}>
                  <button
                    onClick={() => setActivePeer(t.peerId)}
                    className={`w-full text-left px-3 py-2 rounded-xl border ${
                      activePeer === t.peerId
                        ? 'bg-white border-emerald-200'
                        : 'bg-emerald-100 border-emerald-100 hover:bg-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={t.peer?.avatarUrl || '/assets/default-avatar.jpg'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t.peer?.firstName} {t.peer?.lastName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {t.lastMessage?.text}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {t.lastMessage?.sentAt
                          ? t.lastMessage.sentAt.toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col">
          <header className="p-4 border-b border-emerald-100">
            <h2 className="font-semibold">
              {activeThread
                ? <>Chat with {activeThread.peer?.firstName} {activeThread.peer?.lastName}</>
                : 'Select a conversation'}
            </h2>
          </header>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {loadingMsgs && activePeer && <p className="text-sm text-gray-600">Loading…</p>}
            {!loadingMsgs && activePeer && messages.length === 0 && (
              <p className="text-sm text-gray-600">No messages yet.</p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  m.outgoing
                    ? 'ml-auto bg-pink-100 text-gray-800'
                    : 'mr-auto bg-white border border-emerald-100'
                }`}
              >
                <div>{m.text}</div>
                <div className="mt-1 text-[10px] text-gray-500">
                  {m.sentAt ? m.sentAt.toLocaleString() : ''}
                </div>
              </div>
            ))}
          </div>

          <footer className="p-3 border-t border-emerald-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={activePeer ? 'Write a message…' : 'Choose a contact'}
                disabled={!activePeer}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && text.trim() && activePeer) send();
                }}
              />
              <button
                onClick={send}
                disabled={!activePeer || !text.trim()}
                className="px-4 py-2 rounded-xl bg-[#E3107D] text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
