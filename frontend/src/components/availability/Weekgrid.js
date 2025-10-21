'use client';

import React, { useMemo } from 'react';
import clsx from 'clsx';

/**
 * Props:
 *  - week: { days: [{ iso, label }], ... }
 *  - events: [{ id, date:"YYYY-MM-DD", start:"HH:mm", end:"HH:mm", status:"free|booked|unavailable" }]
 *  - onAdd({ date, hour }) -> create 1h "free" slot
 *  - onDelete(event)       -> delete clicked slot
 */
export default function WeekGrid({ week, events = [], onAdd, onDelete }) {
  // fast lookup: key = `${date}-${HH}`
  const indexed = useMemo(() => {
    const map = new Map();
    for (const ev of Array.isArray(events) ? events : []) {
      const hour = String(ev.start || '00:00').slice(0, 2);
      map.set(`${ev.date}-${hour}`, ev);
    }
    return map;
  }, [events]);

  const hours = useMemo(() => {
    // 07:00 → 20:00 for a compact day; tweak as you like
    const list = [];
    for (let h = 7; h <= 20; h++) list.push(String(h).padStart(2, '0'));
    return list;
  }, []);

  if (!week || !Array.isArray(week.days) || week.days.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* header row */}
      <div className="grid" style={{ gridTemplateColumns: `80px repeat(${week.days.length}, 1fr)` }}>
        <div className="bg-gray-50 px-3 py-2 text-xs font-semibold">Heure</div>
        {week.days.map((d) => (
          <div key={d.iso} className="bg-gray-50 px-3 py-2 text-xs font-semibold text-center">
            {d.label}
            <div className="text-[10px] text-gray-400">{d.iso}</div>
          </div>
        ))}
      </div>

      {/* body */}
      {hours.map((hh) => (
        <div
          key={hh}
          className="grid border-t"
          style={{ gridTemplateColumns: `80px repeat(${week.days.length}, 1fr)` }}
        >
          {/* left hour gutter */}
          <div className="px-3 py-2 text-xs text-gray-600">{hh}:00</div>

          {/* day cells */}
          {week.days.map((d) => {
            const key = `${d.iso}-${hh}`;
            const ev = indexed.get(key);
            const booked = ev?.status === 'booked';
            const unavailable = ev?.status === 'unavailable';
            const clickable = ev ? !booked : true;

            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                className={clsx(
                  'relative m-[3px] h-8 rounded border text-[11px] flex items-center justify-center select-none transition',
                  ev
                    ? booked
                      ? 'bg-rose-200 border-rose-300 text-rose-900 cursor-not-allowed'
                      : unavailable
                      ? 'bg-gray-200 border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-300'
                      : 'bg-green-200 border-green-300 text-green-900 cursor-pointer hover:bg-green-300'
                    : 'bg-white border-gray-200 text-gray-300 cursor-pointer hover:bg-gray-50'
                )}
                onClick={() => {
                  if (!clickable) return;
                  if (ev) {
                    onDelete?.(ev);
                  } else {
                    onAdd?.({ date: d.iso, hour: hh });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!clickable) return;
                    if (ev) onDelete?.(ev);
                    else onAdd?.({ date: d.iso, hour: hh });
                  }
                }}
                title={
                  ev
                    ? ev.status === 'booked'
                      ? 'Réservé'
                      : ev.status === 'unavailable'
                      ? 'Indisponible (cliquer pour supprimer)'
                      : 'Libre (cliquer pour supprimer)'
                    : 'Cliquer pour ajouter un créneau libre'
                }
              >
                {ev ? (
                  <span className="px-2 py-0.5 rounded-full border">
                    {ev.status === 'booked'
                      ? 'booked'
                      : ev.status === 'unavailable'
                      ? 'indispo'
                      : 'free'}
                  </span>
                ) : (
                  <span className="opacity-40">＋</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
