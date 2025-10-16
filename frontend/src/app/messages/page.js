'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function MessagesPage() {
  const [token, setToken] = useState('');
  const [me, setMe] = useState(null);
  const [threads, setThreads] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const scrollerRef = useRef(null);

  // Load token + me
  useEffect(() => {
    const t = localStorage.getItem('token') || '';
    setToken(t);

    // if you saved the "me" payload in localStorage, use it; otherwise fetch /api/me
    const cached = localStorage.getItem('me');
    if (cached) {
      try { setMe(JSON.parse(cached)); } catch {}
    } else if (t) {
      fetch(`${API_BASE}/api/me`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.json())
        .then(data => {
          if (data?.user) {
            setMe(data.user);
            localStorage.setItem('me', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Load threads
  useEffect(() => {
    if (!token) return;
    setLoadingThreads(true);
    fetch(`${API_BASE}/api/messages/threads`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(r => r.json())
      .then(data => setThreads(Array.isArray(data?.threads) ? data.threads : []))
      .catch(() => setThreads([]))
      .finally(() => setLoadingThreads(false));
  }, [token]);

  // Load messages for selected peer
  useEffect(() => {
    if (!token || !activePeer) return;
    setLoadingMsgs(true);
    fetch(`${API_BASE}/api/messages/with/${activePeer}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data?.messages) ? data.messages : []))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [token, activePeer]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const activeThread = useMemo(
    () => threads.find(t => t.peerId === activePeer) || null,
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
      // refresh messages
      const latest = await fetch(`${API_BASE}/api/messages/with/${activePeer}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }).then(r => r.json());
      setMessages(Array.isArray(latest?.messages) ? latest.messages : []);
    } catch (e) {
      console.error(e);
      alert("Échec de l'envoi du message.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Messagerie</h1>
          <p className="text-gray-700">
            Vous devez être connecté(e).{' '}
            <Link className="text-pink-600 underline" href="/connexion">Se connecter</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex gap-4">
        {/* Threads list */}
        <aside className="w-80 max-w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Conversations</h2>
            <Link href="/mon-espace" className="text-xs text-emerald-700 underline">Mon espace</Link>
          </div>
          {loadingThreads ? (
            <p className="text-sm text-gray-600">Chargement…</p>
          ) : threads.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune conversation pour le moment.</p>
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
                        src={t.peer?.photo_profil || '/assets/default-avatar.jpg'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t.peer?.prenom} {t.peer?.nom}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {t.lastMessage?.contenu}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {new Date(t.lastMessage?.date_envoi || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Chat pane */}
        <section className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col">
          <header className="p-4 border-b border-emerald-100">
            <h2 className="font-semibold">
              {activeThread
                ? <>Discussion avec {activeThread.peer?.prenom} {activeThread.peer?.nom}</>
                : 'Sélectionnez une conversation'}
            </h2>
          </header>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {loadingMsgs && activePeer && <p className="text-sm text-gray-600">Chargement…</p>}
            {!loadingMsgs && activePeer && messages.length === 0 && (
              <p className="text-sm text-gray-600">Aucun message pour le moment.</p>
            )}
            {messages.map((m) => (
              <div
                key={m.id_message}
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  m.outgoing
                    ? 'ml-auto bg-pink-100 text-gray-800'
                    : 'mr-auto bg-white border border-emerald-100'
                }`}
              >
                <div>{m.contenu}</div>
                <div className="mt-1 text-[10px] text-gray-500">
                  {new Date(m.date_envoi).toLocaleString()}
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
                placeholder={activePeer ? 'Écrire un message…' : 'Choisissez un contact'}
                disabled={!activePeer}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2"
              />
              <button
                onClick={send}
                disabled={!activePeer || !text.trim()}
                className="px-4 py-2 rounded-xl bg-[#E3107D] text-white disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
