'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listConversations, listInbox, markAllRead } from '@/lib/messages';

const BRAND_GREEN = '#16a34a';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-100 rounded-2xl" />
      <div className="h-28 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
    </div>
  );
}

function EmptyCard({ title, desc, icon = '💬' }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-gray-900 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-gray-500">{desc}</div>
    </div>
  );
}

export default function Page() {
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

  useEffect(() => {
    reload();
  }, []);

  const unreadTotal = useMemo(() => {
    const convUnread = (convos || []).reduce((sum, c) => sum + Number(c?.unread || 0), 0);
    const inboxUnread = Array.isArray(inbox) ? inbox.length : 0;
    return convUnread + inboxUnread;
  }, [convos, inbox]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">Messagerie</h1>
            <p className="text-gray-600 mt-1">
              Retrouvez vos conversations et vos messages non lus.
              {unreadTotal > 0 ? (
                <span className="ml-2 text-gray-700">
                  <span className="font-semibold">{unreadTotal}</span> non lu{unreadTotal > 1 ? 's' : ''}.
                </span>
              ) : null}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
            style={{ color: BRAND_GREEN }}
          >
            ← Dashboard
          </Link>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {err}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <div className="space-y-6">
            {/* Non lus */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Non lus</h2>
                  <p className="text-sm text-gray-500">Messages reçus qui n’ont pas encore été ouverts.</p>
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
                      try {
                        localStorage.setItem('messagesChanged', String(Date.now()));
                      } catch {}
                    } finally {
                      setMarking(false);
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm disabled:opacity-60"
                >
                  {marking ? '…' : 'Tout marquer comme lu'}
                </button>
              </div>

              {inbox.length === 0 ? (
                <EmptyCard
                  icon="✅"
                  title="Aucun message non lu"
                  desc="Quand vous recevrez un nouveau message, il apparaîtra ici."
                />
              ) : (
                <div className="space-y-3">
                  {inbox.map((m) => (
                    <div key={m.id} className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-gray-700">
                            De{' '}
                            <Link className="underline" href={`/messages/${m.from?.id}`}>
                              {m.from?.firstName} {m.from?.lastName}
                            </Link>
                            <span className="text-gray-500"> • {new Date(m.sentAt).toLocaleString()}</span>
                          </div>
                          <div className="mt-2 text-gray-900 whitespace-pre-line">{m.content}</div>
                        </div>

                        <Link
                          href={`/messages/${m.from?.id}`}
                          className="shrink-0 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
                        >
                          Ouvrir
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Conversations */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                <p className="text-sm text-gray-500">Toutes vos discussions en cours.</p>
              </div>

              {convos.length === 0 ? (
                <EmptyCard
                  icon="💬"
                  title="Aucune conversation"
                  desc="Dès que vous envoyez ou recevez un message, la conversation apparaîtra ici."
                />
              ) : (
                <div className="space-y-3">
                  {convos.map((c) => {
                    const other = c.user || {};
                    const last = c.lastMessage || null;
                    const isFromOther = last?.from?.id === other.id;
                    const previewPrefix = isFromOther ? `${other.firstName || '—'}: ` : 'Vous: ';
                    const preview = last?.content || '';

                    return (
                      <div
                        key={other.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                      >
                        <div className="min-w-0">
                          <div className="text-gray-900 font-semibold">
                            {other.firstName} {other.lastName}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1 mt-1">
                            {previewPrefix}
                            {preview}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {Number(c.unread || 0) > 0 && (
                            <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                              {c.unread} non lu{c.unread > 1 ? 's' : ''}
                            </span>
                          )}
                          <Link
                            href={`/messages/${other.id}`}
                            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
                          >
                            Ouvrir
                          </Link>
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
