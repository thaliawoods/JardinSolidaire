'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useGardenAvailability,
  useGardenerAvailability,
} from './useAvailability';

const BRAND_GREEN = '#16a34a';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toISODate(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`;
}

function startOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(date, delta) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Monday as first day of week
function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // 0 for Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthLabel(date) {
  const d = new Date(date);
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function uniqById(list) {
  const m = new Map();
  for (const x of list) m.set(String(x.id), x);
  return [...m.values()];
}

/**
 * ✅ Calendrier style “site classique / un peu Airbnb”
 * - Vue mois (sélection jour)
 * - Liste de créneaux du jour (ajout/suppression)
 *
 * Libellés modifiés : “Ajouter” -> “Demander un créneau”
 */
export default function AvailabilityCalendar({ mode, targetId, ownerId, token, title }) {
  const id = targetId ?? ownerId;

  // month cursor (first day of month)
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedISO, setSelectedISO] = useState(() => toISODate(new Date()));

  // compute range to load: month grid usually covers 6 weeks (42 days)
  const monthGrid = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const gridStart = mondayOf(first);
    const days = [];
    const todayISO = toISODate(new Date());

    for (let i = 0; i < 42; i++) {
      const date = addDays(gridStart, i);
      const iso = toISODate(date);
      const inMonth = date.getMonth() === first.getMonth();
      days.push({
        date,
        iso,
        inMonth,
        isToday: iso === todayISO,
      });
    }

    const fromISO = days[0]?.iso;
    const toISO = toISODate(addDays(days[days.length - 1].date, 1)); // exclusive

    return { days, fromISO, toISO, monthStart: first };
  }, [monthCursor]);

  const gardenerAvail = useGardenerAvailability(id, monthGrid.fromISO, monthGrid.toISO, token);
  const gardenAvail = useGardenAvailability(id, monthGrid.fromISO, monthGrid.toISO, token);

  const { data, loading, error, reload, createSlot, deleteSlot } =
    mode === 'gardener' ? gardenerAvail : gardenAvail;

  const slots = useMemo(() => {
    const arr = Array.isArray(data?.slots) ? data.slots : [];
    return arr.map((s) => ({
      id: s.id,
      date: String(s.date).trim(),                 // YYYY-MM-DD
      startTime: String(s.startTime || '00:00').slice(0, 5),
      endTime: String(s.endTime || '00:00').slice(0, 5),
      status: s.status || 'free',                  // free | booked | unavailable
    }));
  }, [data]);

  // count slots per day (for the dot + “1 créneau”)
  const dayCounts = useMemo(() => {
    const counts = new Map();
    for (const s of slots) {
      const key = s.date;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }, [slots]);

  const selectedSlots = useMemo(() => {
    return uniqById(slots.filter((s) => s.date === selectedISO))
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [slots, selectedISO]);

  // Add flow
  const [addOpen, setAddOpen] = useState(false);
  const [addStart, setAddStart] = useState('09:00');
  const [addEnd, setAddEnd] = useState('10:00');
  const [addStatus, setAddStatus] = useState('free');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isInGrid = monthGrid.days.some((d) => d.iso === selectedISO);
    if (!isInGrid) {
      const firstInMonth = monthGrid.days.find((d) => d.inMonth) || monthGrid.days[0];
      if (firstInMonth?.iso) setSelectedISO(firstInMonth.iso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthCursor]);

  async function handleAddSlot() {
    if (!id) return;
    try {
      setBusy(true);
      await createSlot({
        date: selectedISO,
        startTime: addStart,
        endTime: addEnd,
        status: addStatus,
      });
      setAddOpen(false);
      await reload();
    } catch (e) {
      alert(`Erreur création créneau: ${e?.message || 'server_error'}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteSlot(slotId) {
    if (!slotId) return;
    try {
      setBusy(true);
      await deleteSlot(slotId);
      await reload();
    } catch (e) {
      alert(`Suppression impossible: ${e?.message || 'server_error'}`);
    } finally {
      setBusy(false);
    }
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-green-800">{title || 'Disponibilités'}</h3>
          <p className="text-sm text-gray-600">Choisis un jour dans le calendrier, puis gère les créneaux.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-gray-200 hover:bg-gray-50"
            onClick={() => setMonthCursor((m) => addMonths(m, -1))}
            aria-label="Mois précédent"
          >
            ←
          </button>

          <div className="h-10 px-4 rounded-full border border-gray-200 bg-white flex items-center text-sm font-medium">
            {monthLabel(monthCursor)}
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-full border border-gray-200 hover:bg-gray-50"
            onClick={() => setMonthCursor((m) => addMonths(m, 1))}
            aria-label="Mois suivant"
          >
            →
          </button>

          <button
            type="button"
            className="h-10 px-4 rounded-full border border-gray-200 hover:bg-gray-50 text-sm"
            onClick={() => {
              const now = new Date();
              setMonthCursor(startOfMonth(now));
              setSelectedISO(toISODate(now));
            }}
          >
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Month grid */}
        <section
          className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
          aria-label="Calendrier mensuel"
        >
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekDays.map((d) => (
              <div key={d} className="px-3 py-2 text-xs font-semibold text-gray-700 text-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {monthGrid.days.map((d) => {
              const isSelected = d.iso === selectedISO;
              const count = dayCounts.get(d.iso) || 0;

              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setSelectedISO(d.iso)}
                  className={[
                    'relative h-[92px] p-3 text-left border-t border-r border-gray-100',
                    'hover:bg-gray-50 transition',
                    !d.inMonth ? 'text-gray-400 bg-white/60' : 'text-gray-900',
                    isSelected ? 'ring-2 ring-inset' : '',
                  ].join(' ')}
                  style={isSelected ? { boxShadow: `inset 0 0 0 2px rgba(22,163,74,0.35)` } : undefined}
                >
                  <div className="text-sm font-medium">{d.date.getDate()}</div>

                  {/* today badge */}
                  {d.isToday && (
                    <span
                      className="absolute top-2 right-2 text-[10px] leading-none rounded-full border px-2 py-1 whitespace-nowrap"
                      style={{
                        borderColor: 'rgba(22,163,74,0.35)',
                        color: BRAND_GREEN,
                        background: 'rgba(22,163,74,0.06)',
                      }}
                    >
                      aujourd&apos;hui
                    </span>
                  )}

                  {/* slots indicator */}
                  <div className="absolute left-3 bottom-3 flex items-center gap-2">
                    {count > 0 ? (
                      <>
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: 'rgb(16,185,129)' }}
                          aria-hidden
                        />
                        <span className="text-xs text-gray-600">
                          {count} créneau{count > 1 ? 'x' : ''}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* legend */}
          <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-200 text-xs text-gray-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-200" />
              Libre
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-rose-300 bg-rose-200" />
              Réservé
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-gray-300 bg-gray-200" />
              Indispo
            </span>
          </div>
        </section>

        {/* Day slots */}
        <section
          className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6"
          aria-label="Créneaux du jour"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-green-800">Créneaux du jour</h4>
              <p className="text-sm text-gray-600">{selectedISO}</p>
            </div>

            <button
              type="button"
              onClick={() => setAddOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-white shadow-sm"
              style={{ backgroundColor: BRAND_GREEN }}
            >
              + Demander un créneau
            </button>
          </div>

          {loading && (
            <div className="mt-4 space-y-3">
              <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            </div>
          )}

          {!!error && !loading && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => reload?.()}
                  className="rounded-full px-4 py-2 border border-red-200 bg-white hover:bg-red-50"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* request form */}
          {addOpen && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-sm">
                  <span className="block text-xs text-gray-600 mb-1">Début</span>
                  <input
                    type="time"
                    value={addStart}
                    onChange={(e) => {
                      setAddStart(e.target.value);
                      const sh = parseInt(e.target.value.slice(0, 2), 10);
                      const eh = Math.min(23, sh + 1);
                      setAddEnd(`${pad2(eh)}:${e.target.value.slice(3, 5)}`);
                    }}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3"
                  />
                </label>

                <label className="text-sm">
                  <span className="block text-xs text-gray-600 mb-1">Fin</span>
                  <input
                    type="time"
                    value={addEnd}
                    onChange={(e) => setAddEnd(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3"
                  />
                </label>

                <label className="text-sm">
                  <span className="block text-xs text-gray-600 mb-1">Statut</span>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3"
                  >
                    <option value="free">Libre</option>
                    <option value="unavailable">Indispo</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleAddSlot}
                  className="rounded-full px-5 py-2.5 text-white disabled:opacity-60"
                  style={{ backgroundColor: BRAND_GREEN }}
                >
                  {busy ? 'Demande…' : 'Demander le créneau'}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setAddOpen(false)}
                  className="rounded-full px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* list */}
          {!loading && !error && (
            <div className="mt-4">
              {selectedSlots.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-sm text-gray-600">
                  Aucun créneau ce jour. Demande-en un avec “+ Demander un créneau”.
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedSlots.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {s.startTime} → {s.endTime}
                        </span>

                        <span
                          className="text-xs rounded-full border px-2 py-1"
                          style={{
                            borderColor:
                              s.status === 'booked'
                                ? 'rgba(244,63,94,0.35)'
                                : s.status === 'unavailable'
                                ? 'rgba(107,114,128,0.35)'
                                : 'rgba(16,185,129,0.35)',
                            background:
                              s.status === 'booked'
                                ? 'rgba(244,63,94,0.10)'
                                : s.status === 'unavailable'
                                ? 'rgba(107,114,128,0.10)'
                                : 'rgba(16,185,129,0.10)',
                            color:
                              s.status === 'booked'
                                ? 'rgb(190,18,60)'
                                : s.status === 'unavailable'
                                ? 'rgb(75,85,99)'
                                : 'rgb(6,95,70)',
                          }}
                        >
                          {s.status === 'booked' ? 'réservé' : s.status === 'unavailable' ? 'indispo' : 'libre'}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={busy || s.status === 'booked'}
                        onClick={() => handleDeleteSlot(s.id)}
                        className="rounded-full px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        title={s.status === 'booked' ? 'Créneau réservé — suppression impossible' : 'Supprimer'}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
