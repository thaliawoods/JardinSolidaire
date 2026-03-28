'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useGardenAvailability, useGardenerAvailability } from './useAvailability';
import { createBooking } from '@/lib/bookings';

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

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
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

function isoToLocalDateTimeValue(isoDate, hhmm) {
  return `${isoDate}T${hhmm}`;
}

export default function AvailabilityCalendar({
  mode,
  intent = 'manage',
  gardenerId,
  gardenId,
  targetId,
  ownerId,
  token,
  title,
  hint,
  onPick,
}) {
  const resolvedId =
    mode === 'garden' ? gardenId ?? targetId ?? ownerId : gardenerId ?? targetId ?? ownerId;

  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedISO, setSelectedISO] = useState(() => toISODate(new Date()));

  const monthGrid = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const gridStart = mondayOf(first);
    const days = [];
    const todayISO = toISODate(new Date());

    for (let i = 0; i < 42; i++) {
      const date = addDays(gridStart, i);
      const iso = toISODate(date);
      const inMonth = date.getMonth() === first.getMonth();
      days.push({ date, iso, inMonth, isToday: iso === todayISO });
    }

    const fromISO = days[0]?.iso;
    const toISO = toISODate(addDays(days[days.length - 1].date, 1));
    return { days, fromISO, toISO, monthStart: first };
  }, [monthCursor]);

  const gardenerAvail = useGardenerAvailability(
    mode === 'gardener' ? resolvedId : null,
    monthGrid.fromISO,
    monthGrid.toISO,
    token
  );

  const gardenAvail = useGardenAvailability(
    mode === 'garden' ? resolvedId : null,
    monthGrid.fromISO,
    monthGrid.toISO,
    token
  );

  const { data, loading, error, reload, createSlot, deleteSlot } =
    mode === 'gardener' ? gardenerAvail : gardenAvail;

  const slots = useMemo(() => {
    const arr = Array.isArray(data?.slots) ? data.slots : [];
    return arr.map((s) => ({
      id: s.id,
      date: String(s.date).trim(),
      startTime: String(s.startTime || '00:00').slice(0, 5),
      endTime: String(s.endTime || '00:00').slice(0, 5),
      status: s.status || 'free',
    }));
  }, [data]);

  const dayCounts = useMemo(() => {
    const counts = new Map();
    for (const s of slots) counts.set(s.date, (counts.get(s.date) || 0) + 1);
    return counts;
  }, [slots]);

  const selectedSlots = useMemo(() => {
    return uniqById(slots.filter((s) => s.date === selectedISO)).sort((a, b) =>
      (a.startTime || '').localeCompare(b.startTime || '')
    );
  }, [slots, selectedISO]);

  const [addOpen, setAddOpen] = useState(false);
  const [addStart, setAddStart] = useState('09:00');
  const [addEnd, setAddEnd] = useState('10:00');
  const [addStatus, setAddStatus] = useState('free');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  function translateErr(msg) {
    const map = {
      slot_in_past: 'Ce créneau est dans le passé.',
      slot_overlap: 'Ce créneau chevauche une réservation existante.',
      slot_unavailable: 'Ce créneau n\'est pas disponible.',
      create_failed: 'Impossible de créer la demande.',
      request_failed: 'Une erreur est survenue.',
    };
    return map[msg] || msg;
  }

  function showToast(type, text) {
    setToast({ type, text });
    window.clearTimeout(window.__avail_toast__);
    window.__avail_toast__ = window.setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    const isInGrid = monthGrid.days.some((d) => d.iso === selectedISO);
    if (!isInGrid) {
      const first = monthGrid.days.find((d) => d.inMonth) || monthGrid.days[0];
      if (first?.iso) setSelectedISO(first.iso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthCursor]);

  useEffect(() => {
    if (typeof onPick === 'function') {
      onPick({ dateISO: selectedISO, startTime: addStart, endTime: addEnd });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedISO]);

  async function handleAddSlot() {
    if (!resolvedId) return;
    try {
      setBusy(true);
      await createSlot({ date: selectedISO, startTime: addStart, endTime: addEnd, status: addStatus });
      setAddOpen(false);
      showToast('success', 'Créneau ajouté');
      await reload();
    } catch (e) {
      showToast('error', `Erreur : ${e?.message || 'server_error'}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteSlot(slotId) {
    if (!slotId) return;
    try {
      setBusy(true);
      await deleteSlot(slotId);
      showToast('success', 'Créneau supprimé');
      await reload();
    } catch (e) {
      showToast('error', `Suppression impossible : ${e?.message || 'server_error'}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestBooking() {
    if (!resolvedId) return;
    try {
      setBusy(true);
      const startsAt = new Date(isoToLocalDateTimeValue(selectedISO, addStart)).toISOString();
      const endsAt = new Date(isoToLocalDateTimeValue(selectedISO, addEnd)).toISOString();
      await createBooking({ gardenId: resolvedId, title: 'Demande de créneau', notes: '', startsAt, endsAt });
      setAddOpen(false);
      showToast('success', 'Demande envoyée — en attente de validation');
      await reload();
    } catch (e) {
      showToast('error', translateErr(e?.message || 'request_failed'));
    } finally {
      setBusy(false);
    }
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const subtitle =
    hint ||
    (intent === 'book'
      ? 'Choisis un jour, puis demande un créneau.'
      : 'Choisis un jour dans le calendrier, puis gère les créneaux.');

  const flatBtn = {
    background: '#fff',
    border: '1px solid var(--border)',
    fontSize: '0.8125rem',
    color: 'var(--foreground)',
    cursor: 'pointer',
    padding: '0.4rem 0.875rem',
    fontFamily: 'inherit',
    lineHeight: 1,
  };

  const inputStyle = {
    width: '100%',
    height: '2.25rem',
    border: '1px solid var(--border)',
    background: '#fff',
    padding: '0 0.75rem',
    fontSize: '0.8125rem',
    color: 'var(--foreground)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.2 }}>
            {title || 'Disponibilités'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{subtitle}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" style={{ ...flatBtn, padding: '0.4rem 0.75rem' }}
            onClick={() => setMonthCursor((m) => addMonths(m, -1))} aria-label="Mois précédent">
            ←
          </button>
          <div style={{ ...flatBtn, cursor: 'default', whiteSpace: 'nowrap', padding: '0.4rem 1rem' }}>
            {monthLabel(monthCursor)}
          </div>
          <button type="button" style={{ ...flatBtn, padding: '0.4rem 0.75rem' }}
            onClick={() => setMonthCursor((m) => addMonths(m, 1))} aria-label="Mois suivant">
            →
          </button>
          <button type="button" style={flatBtn}
            onClick={() => { const now = new Date(); setMonthCursor(startOfMonth(now)); setSelectedISO(toISODate(now)); }}>
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

        <section style={{ border: '1px solid var(--border)', background: '#fff', overflow: 'hidden' }} aria-label="Calendrier mensuel">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
            {weekDays.map((d) => (
              <div key={d} style={{ padding: '0.5rem 0', textAlign: 'center', fontSize: '0.6875rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {monthGrid.days.map((d) => {
              const isSelected = d.iso === selectedISO;
              const count = dayCounts.get(d.iso) || 0;
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setSelectedISO(d.iso)}
                  style={{
                    position: 'relative',
                    height: '86px',
                    padding: '0.5rem',
                    textAlign: 'left',
                    borderTop: '1px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                    background: isSelected ? 'rgba(45,106,79,0.05)' : '#fff',
                    outline: isSelected ? '1px solid var(--green)' : 'none',
                    outlineOffset: '-1px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.1s',
                  }}
                >
                  <div style={{ fontSize: '0.8125rem', color: d.inMonth ? 'var(--foreground)' : 'var(--border)', fontWeight: d.isToday ? 600 : 400 }}>
                    {d.date.getDate()}
                  </div>

                  {d.isToday && (
                    <div style={{ fontSize: '0.6rem', color: 'var(--green)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.1rem' }}>
                      auj.
                    </div>
                  )}

                  <div style={{ position: 'absolute', left: '0.5rem', bottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {count > 0 ? (
                      <>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%', flexShrink: 0 }} aria-hidden />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{count}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.6875rem', color: 'var(--border)' }}>—</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ border: '1px solid var(--border)', background: '#fff', padding: '1.25rem' }} aria-label="Créneaux du jour">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--foreground)', margin: 0 }}>
                {intent === 'book' ? 'Demander un créneau' : 'Créneaux du jour'}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{selectedISO}</p>
            </div>

            <button
              type="button"
              onClick={() => setAddOpen((v) => !v)}
              disabled={!resolvedId}
              style={{
                ...flatBtn,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                border: 'none',
                padding: '0.2rem 0',
                opacity: resolvedId ? 1 : 0.4,
                cursor: resolvedId ? 'pointer' : 'not-allowed',
              }}
            >
              {intent === 'book' ? '+ Demander ce créneau' : '+ Ajouter un créneau'}
            </button>
          </div>

          {toast && (
            <div style={{
              marginBottom: '1rem',
              border: '1px solid var(--border)',
              padding: '0.625rem 0.875rem',
              fontSize: '0.8125rem',
              color: toast.type === 'success' ? 'var(--green)' : '#b91c1c',
            }}>
              {toast.text}
            </div>
          )}

          {loading && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Chargement…</p>
          )}

          {!!error && !loading && (
            <div style={{ border: '1px solid var(--border)', padding: '0.875rem', fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              {error}
              <button type="button" onClick={() => reload?.()} style={{ ...flatBtn, marginTop: '0.5rem', display: 'block' }}>
                Réessayer
              </button>
            </div>
          )}

          {addOpen && (
            <div style={{ border: '1px solid var(--border)', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: intent !== 'book' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.8125rem' }}>
                  <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Début</span>
                  <input type="time" value={addStart} onChange={(e) => {
                    setAddStart(e.target.value);
                    const eh = Math.min(23, parseInt(e.target.value.slice(0, 2), 10) + 1);
                    setAddEnd(`${pad2(eh)}:${e.target.value.slice(3, 5)}`);
                    if (typeof onPick === 'function') onPick({ dateISO: selectedISO, startTime: e.target.value, endTime: `${pad2(eh)}:${e.target.value.slice(3, 5)}` });
                  }} style={inputStyle} />
                </label>

                <label style={{ fontSize: '0.8125rem' }}>
                  <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fin</span>
                  <input type="time" value={addEnd} onChange={(e) => {
                    setAddEnd(e.target.value);
                    if (typeof onPick === 'function') onPick({ dateISO: selectedISO, startTime: addStart, endTime: e.target.value });
                  }} style={inputStyle} />
                </label>

                {intent !== 'book' && (
                  <label style={{ fontSize: '0.8125rem' }}>
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</span>
                    <select value={addStatus} onChange={(e) => setAddStatus(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option value="free">Libre</option>
                      <option value="unavailable">Indispo</option>
                    </select>
                  </label>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={intent === 'book' ? handleRequestBooking : handleAddSlot}
                  style={{ ...flatBtn, background: 'var(--foreground)', color: '#fff', border: 'none', opacity: busy ? 0.6 : 1 }}
                >
                  {busy ? 'Envoi…' : intent === 'book' ? 'Envoyer la demande' : 'Créer le créneau'}
                </button>
                <button type="button" disabled={busy} onClick={() => setAddOpen(false)} style={{ ...flatBtn, opacity: busy ? 0.6 : 1 }}>
                  Annuler
                </button>
                {intent === 'book' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    Le propriétaire recevra ta demande.
                  </span>
                )}
              </div>
            </div>
          )}

          {!loading && !error && (
            <div>
              {intent === 'book' ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '0.875rem', lineHeight: 1.6 }}>
                  Choisis une date, puis clique sur « + Demander ce créneau » pour proposer une plage horaire.
                </p>
              ) : selectedSlots.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}>
                  Aucun créneau ce jour.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedSlots.map((s) => (
                    <li key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)', padding: '0.625rem 0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--foreground)' }}>{s.startTime} → {s.endTime}</span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {s.status === 'booked' ? 'réservé' : s.status === 'unavailable' ? 'indispo' : 'libre'}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={busy || s.status === 'booked'}
                        onClick={() => handleDeleteSlot(s.id)}
                        style={{ ...flatBtn, fontSize: '0.75rem', color: 'var(--muted)', opacity: (busy || s.status === 'booked') ? 0.4 : 1, cursor: s.status === 'booked' ? 'not-allowed' : 'pointer' }}
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
