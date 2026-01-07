'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getThread, sendMessage, markThreadRead } from '@/lib/messages';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
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

/* -----------------------------
   Fetch "other" profile (name)
------------------------------*/
function normalizePerson(raw, fallbackUserId) {
  if (!raw) return null;

  // parfois c’est enveloppé (owner/user/etc.), parfois direct
  const base = raw.user || raw.owner || raw.gardener || raw.utilisateur || raw;

  const firstName = base.firstName ?? base.prenom ?? '';
  const lastName = base.lastName ?? base.nom ?? '';

  // certains endpoints retournent userId (ex: owners)
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
    `${API_BASE}/api/jardinier.es/${userId}`,
    `${API_BASE}/api/proprietaires/${userId}`,
  ];

  for (const url of tries) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      const p = normalizePerson(data, userId);
      if (p?.firstName || p?.lastName) return p;
    } catch {
      // ignore et on tente le suivant
    }
  }
  return null;
}

export default function ThreadPage() {
  const params = useParams();
  // ✅ selon ton dossier: /messages/[userId] -> { userId }
  // (si c’est /messages/[id], remplace par params?.id)
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

  // Fallback: essayer d'inférer depuis le thread (comme tu faisais)
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

  // ✅ Nom final affiché: API d’abord, fallback ensuite
  const other = useMemo(() => {
    if (otherProfile?.firstName || otherProfile?.lastName) return otherProfile;
    return inferredOther;
  }, [otherProfile, inferredOther]);

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

  // ✅ charger messages + polling
  useEffect(() => {
    if (!userId) return;
    load();
    const t = setInterval(() => load({ silent: true }), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ✅ charger le profil de la personne pour afficher le nom
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

    return () => {
      alive = false;
    };
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
                {loadingOther ? '…' : `${other.firstName} ${other.lastName}`.trim() || '—'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
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
                  // ⚠️ ton heuristic actuel (je le garde)
                  const isMine = m.to?.id === Number(userId);

                  return (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                        isMine ? 'ml-auto bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {m.from?.firstName} {m.from?.lastName} •{' '}
                        {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                      </div>
                      <div className="text-gray-900 whitespace-pre-line">{m.content}</div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={onSend}
              className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
            >
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
