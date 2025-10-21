// backend/routes/bookings.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

/* ---------------------------------------
   Auth middleware
----------------------------------------*/
function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const id = Number(payload.userId || payload.id || payload.sub);
    if (!id) return res.status(401).json({ error: 'unauthorized' });
    req.user = { id };
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

/* ---------------------------------------
   Helpers
----------------------------------------*/
// Build Date ranges from AvailabilitySlot (date + time columns)
function buildRangeFromSlot(slot) {
  if (!slot?.date || !slot?.startTime || !slot?.endTime) {
    return { startsAt: null, endsAt: null };
  }
  // slot.date is a DATE (no time). startTime/endTime are TIME. We reconstruct a full Date.
  const start = new Date(slot.date);
  const st = new Date(slot.startTime);
  start.setHours(st.getHours(), st.getMinutes(), st.getSeconds(), st.getMilliseconds());

  const end = new Date(slot.date);
  const et = new Date(slot.endTime);
  end.setHours(et.getHours(), et.getMinutes(), et.getSeconds(), et.getMilliseconds());

  return { startsAt: start, endsAt: end };
}

// overlap if NOT( a.end <= b.start OR a.start >= b.end )
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return !(bEnd <= aStart || bStart >= aEnd);
}

// get all pending/confirmed bookings for a garden on the same calendar day as 'day'
async function listDayBookings(gardenId, day) {
  const dateOnly = new Date(day.toDateString()); // local-day semantics
  return prisma.booking.findMany({
    where: {
      gardenId: BigInt(gardenId),
      status: { in: ['pending', 'confirmed'] },
      slot: { is: { date: dateOnly } },
    },
    include: { slot: true },
  });
}

// JS-based conflict check (robust across drivers/time types)
async function hasConflictJS({ gardenId, startsAt, endsAt, ignoreBookingId = null }) {
  if (!(startsAt instanceof Date) || isNaN(startsAt)) return null;
  if (!(endsAt instanceof Date) || isNaN(endsAt)) return null;

  const list = await listDayBookings(gardenId, startsAt);
  for (const b of list) {
    if (ignoreBookingId && String(b.id) === String(ignoreBookingId)) continue;
    const { startsAt: s, endsAt: e } = buildRangeFromSlot(b.slot);
    if (s && e && rangesOverlap(startsAt, endsAt, s, e)) {
      return { id: b.id, slot: b.slot, status: b.status };
    }
  }
  return null;
}

// Make API-safe JSON (no BigInt) for a booking with slot included
function shapeBooking(b) {
  const { startsAt, endsAt } = buildRangeFromSlot(b.slot);
  return {
    id: Number(b.id),
    gardenId: b.gardenId != null ? Number(b.gardenId) : null,
    slotId: b.slotId != null ? Number(b.slotId) : null,
    title: null,
    notes: b.notes ?? null,
    status: b.status || 'pending',
    startsAt,
    endsAt,
  };
}

/* ---------------------------------------
   Routes
----------------------------------------*/

// GET /api/bookings/can-book?slotId=... OR ?gardenId=...&startsAt=...&endsAt=...
router.get('/can-book', requireAuth, async (req, res) => {
  try {
    const { slotId } = req.query;
    const gardenId = req.query.gardenId ? Number(req.query.gardenId) : null;
    const startsAt = req.query.startsAt ? new Date(String(req.query.startsAt)) : null;
    const endsAt   = req.query.endsAt ? new Date(String(req.query.endsAt)) : null;

    const reasons = [];

    if (slotId) {
      const slot = await prisma.availabilitySlot.findUnique({
        where: { id: BigInt(slotId) },
        select: { id: true, gardenId: true, status: true, date: true, startTime: true, endTime: true },
      });
      if (!slot) return res.json({ ok: false, reasons: ['slot_not_found'] });
      if (slot.status && slot.status !== 'free') reasons.push('slot_not_free');

      const { startsAt: s, endsAt: e } = buildRangeFromSlot(slot);
      const conflict = await hasConflictJS({ gardenId: slot.gardenId, startsAt: s, endsAt: e });
      if (conflict) reasons.push('time_conflict');

      return res.json({ ok: reasons.length === 0, reasons, conflict });
    }

    if (!gardenId || !startsAt || !endsAt) {
      return res.status(400).json({ ok: false, reasons: ['invalid_params'] });
    }
    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      return res.status(400).json({ ok: false, reasons: ['invalid_dates'] });
    }
    if (!(startsAt < endsAt)) reasons.push('start_must_be_before_end');
    if (endsAt < new Date()) reasons.push('slot_in_past');

    const conflict = await hasConflictJS({ gardenId, startsAt, endsAt });
    if (conflict) reasons.push('time_conflict');

    return res.json({ ok: reasons.length === 0, reasons, conflict });
  } catch (e) {
    console.error('can-book error:', e?.message || e);
    res.status(500).json({ ok: false, reasons: ['server_error'] });
  }
});

// POST /api/bookings
// Body: { slotId }  OR  { gardenId, startsAt, endsAt, notes? }
router.post('/', requireAuth, async (req, res) => {
  try {
    const { slotId, gardenId, startsAt, endsAt, notes } = req.body || {};

    // Mode 1: book an existing slot
    if (slotId) {
      const slot = await prisma.availabilitySlot.findUnique({
        where: { id: BigInt(slotId) },
        select: { id: true, gardenId: true, status: true, date: true, startTime: true, endTime: true },
      });
      if (!slot) return res.status(404).json({ error: 'slot_not_found' });
      if (slot.status && slot.status !== 'free') return res.status(400).json({ error: 'slot_not_free' });

      const { startsAt: s, endsAt: e } = buildRangeFromSlot(slot);
      const conflict = await hasConflictJS({ gardenId: slot.gardenId, startsAt: s, endsAt: e });
      if (conflict) return res.status(409).json({ error: 'time_conflict' });

      // Make slot booked + create booking atomically
      const created = await prisma.$transaction(async (tx) => {
        await tx.availabilitySlot.update({ where: { id: slot.id }, data: { status: 'booked' } });
        return tx.booking.create({
          data: {
            userId: BigInt(req.user.id),
            gardenId: slot.gardenId,
            slotId: slot.id,
            status: 'pending',
            notes: notes || null,
          },
          include: { slot: true },
        });
      });

      return res.json(shapeBooking(created));
    }

    // Mode 2: free-dates flow → create a slot then book it
    if (!gardenId || !startsAt || !endsAt) {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    const s = new Date(startsAt);
    const e = new Date(endsAt);

    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return res.status(400).json({ error: 'invalid_dates' });
    }
    if (!(s < e)) return res.status(400).json({ error: 'start_must_be_before_end' });
    if (e < new Date()) return res.status(400).json({ error: 'slot_in_past' });

    const conflict = await hasConflictJS({ gardenId: Number(gardenId), startsAt: s, endsAt: e });
    if (conflict) return res.status(409).json({ error: 'time_conflict' });

    // date column should be just the day (strip time)
    const dateOnly = new Date(s.toDateString());

    const created = await prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.create({
        data: {
          gardenId: BigInt(gardenId),
          date: dateOnly,
          startTime: s, // Prisma stores only the time part into TIME columns
          endTime: e,
          status: 'booked',
        },
      });

      return tx.booking.create({
        data: {
          userId: BigInt(req.user.id),
          gardenId: BigInt(gardenId),
          slotId: slot.id,
          status: 'pending',
          notes: notes || null,
        },
        include: { slot: true },
      });
    });

    res.json(shapeBooking(created));
  } catch (e) {
    console.error('create booking error:', e?.message || e, e?.stack);
    res.status(500).json({ error: 'server_error', hint: 'see server logs' });
  }
});

// GET /api/bookings/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const list = await prisma.booking.findMany({
      where: { userId: BigInt(req.user.id) },
      orderBy: { bookedAt: 'desc' },
      include: { slot: true },
    });

    res.json(list.map(shapeBooking));
  } catch (e) {
    console.error('list bookings error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// GET /api/bookings/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const r = await prisma.booking.findUnique({ where: { id }, include: { slot: true } });
    if (!r) return res.status(404).json({ error: 'not_found' });
    if (r.userId !== BigInt(req.user.id)) return res.status(403).json({ error: 'forbidden' });

    res.json(shapeBooking(r));
  } catch (e) {
    console.error('get booking error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// PATCH /api/bookings/:id  (update notes/status)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const { status, notes } = req.body || {};

    const current = await prisma.booking.findUnique({ where: { id }, include: { slot: true } });
    if (!current) return res.status(404).json({ error: 'not_found' });
    if (current.userId !== BigInt(req.user.id)) return res.status(403).json({ error: 'forbidden' });

    const patch = {};
    if (typeof notes === 'string') patch.notes = notes;
    if (typeof status === 'string') {
      if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'invalid_status' });
      }
      patch.status = status;
    }

    const updated = await prisma.booking.update({ where: { id }, data: patch, include: { slot: true } });
    res.json(shapeBooking(updated));
  } catch (e) {
    console.error('patch booking error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
