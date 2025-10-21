'use client';

import React, { useMemo, useState } from 'react';
import WeekGrid from './Weekgrid';
import {
  useWeek,
  useGardenAvailability,
  useGardenerAvailability,
} from './useAvailability';

export default function AvailabilityCalendar({ mode, ownerId, token }) {
  const [cursor, setCursor] = useState(() => new Date());
  const week = useWeek(cursor);

  const gardenerAvail = useGardenerAvailability(ownerId, week.fromISO, week.toISO, token);
  const gardenAvail = useGardenAvailability(ownerId, week.fromISO, week.toISO, token);

  const { data, reload, createSlot, deleteSlot } = mode === 'gardener' ? gardenerAvail : gardenAvail;

  const events = useMemo(() => {
    const slots = Array.isArray(data?.slots) ? data.slots : [];
    return slots.map((s) => ({
      id: s.id,
      date: String(s.date).trim(),                       // "YYYY-MM-DD"
      start: String(s.startTime || '00:00').slice(0, 5), // "HH:mm"
      end:   String(s.endTime   || '00:00').slice(0, 5), // "HH:mm"
      status: s.status || 'free',
    }));
  }, [data]);

  async function handleAdd({ date, hour }) {
    try {
      const startTime = `${hour}:00`;
      const endTime   = `${String(Math.min(23, parseInt(hour, 10) + 1)).padStart(2, '0')}:00`;
      await createSlot({ date, startTime, endTime, status: 'free' });
      await reload();
    } catch (e) {
      alert(`Erreur création créneau: ${e?.message || 'server_error'}`);
    }
  }

  async function handleDelete(ev) {
    try {
      await deleteSlot(ev.id);
      await reload();
    } catch (e) {
      alert(`Suppression impossible: ${e?.message || 'server_error'}`);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-green-800">Disponibilités</h3>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))}
          >
            ← Semaine -1
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => setCursor(new Date())}
          >
            Cette semaine
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))}
          >
            Semaine +1 →
          </button>
        </div>
      </div>

      <WeekGrid
        week={week}
        events={events}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />

      <div className="text-xs text-gray-500">
        <span className="inline-block w-3 h-3 align-middle bg-green-200 border border-green-300 mr-1" /> Libre
        <span className="inline-block w-3 h-3 align-middle bg-rose-200 border border-rose-300 ml-4 mr-1" /> Réservé
        <span className="inline-block w-3 h-3 align-middle bg-gray-200 border border-gray-300 ml-4 mr-1" /> Indispo
      </div>
    </div>
  );
}
