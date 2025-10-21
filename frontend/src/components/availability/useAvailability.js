'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/* -------------------------------------------------------
 * Small helpers
 * ----------------------------------------------------- */
function toISODate(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const dd = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // 0 for Monday, 6 for Sunday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function labelFor(date) {
  const d = new Date(date);
  const wd = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'][(d.getDay() + 6) % 7];
  const day = String(d.getDate()).padStart(2, '0');
  const mo = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'][d.getMonth()];
  return `${wd}. ${day} ${mo}`;
}

/* -------------------------------------------------------
 * useWeek(cursorDate)
 * Returns: { start: Date, end: Date, fromISO, toISO, days: [...] }
 * ----------------------------------------------------- */
export function useWeek(cursor) {
  const start = useMemo(() => mondayOf(cursor || new Date()), [cursor]);
  const end = useMemo(() => addDays(start, 7), [start]);

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      arr.push({
        date: new Date(d),
        iso: toISODate(d),
        label: labelFor(d),
      });
    }
    return arr;
  }, [start]);

  return {
    start,
    end,
    fromISO: toISODate(start),
    toISO: toISODate(end), // exclusive
    days,
  };
}

/* -------------------------------------------------------
 * Centralized fetch with error surfacing
 * ----------------------------------------------------- */
async function authFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  let body;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  if (!res.ok) {
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

/* -------------------------------------------------------
 * Factory for garden/gardener availability hooks
 * ----------------------------------------------------- */
function makeAvailabilityHook(kind) {
  // kind: 'garden' | 'gardener'
  const plural = kind === 'garden' ? 'gardens' : 'gardeners';

  return function useAvailability(ownerId, fromISO, toISO, token) {
    const [data, setData] = useState({ slots: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const authHeader = useMemo(() => {
      // Prefer explicit token prop; fallback to localStorage if present
      const t =
        token ||
        (typeof window !== 'undefined' ? localStorage.getItem('TOKEN') : null) ||
        (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      return t ? { Authorization: `Bearer ${t}` } : {};
    }, [token]);

    const load = useCallback(async () => {
      if (!ownerId || !fromISO || !toISO) return;
      try {
        setLoading(true);
        setError('');
        const url = `${API_BASE}/api/availability/${plural}/${ownerId}?from=${encodeURIComponent(
          fromISO
        )}&to=${encodeURIComponent(toISO)}`;
        // IMPORTANT: include auth header even for GET
        const body = await authFetch(url, { method: 'GET', headers: { ...authHeader } });
        setData(Array.isArray(body?.slots) ? body : { slots: [] });
      } catch (e) {
        console.error('useAvailability load error', e);
        setError(e.message || 'failed');
        setData({ slots: [] });
      } finally {
        setLoading(false);
      }
    }, [ownerId, fromISO, toISO, authHeader]);

    useEffect(() => {
      load();
    }, [load]);

    async function createSlot({ date, startTime, endTime, status = 'free' }) {
      if (!ownerId) return;
      const url = `${API_BASE}/api/availability/${plural}/${ownerId}`;
      return authFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify({ date, startTime, endTime, status }),
      });
    }

    async function deleteSlot(slotId) {
      if (!ownerId || !slotId) return;
      try {
        const url = `${API_BASE}/api/availability/${plural}/${ownerId}/${slotId}`;
        await authFetch(url, {
          method: 'DELETE',
          headers: { ...authHeader },
        });
      } catch (e) {
        // Friendly handling of booked slots (409)
        if (e.status === 409 && e.body?.error === 'slot_booked') {
          alert('Ce créneau est déjà réservé – vous ne pouvez pas le supprimer.');
          return;
        }
        console.error('deleteSlot failed', e);
        alert(`Erreur suppression créneau: ${e.body?.error || e.message}`);
      }
    }

    return {
      data,
      loading,
      error,
      reload: load,
      createSlot,
      deleteSlot,
    };
  };
}

export const useGardenAvailability = makeAvailabilityHook('garden');
export const useGardenerAvailability = makeAvailabilityHook('gardener');
