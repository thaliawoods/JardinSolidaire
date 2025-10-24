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
    const token = h.toLowerCase().startsWith('bearer ') ? h.slice(7) : null;
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

function shapeOwnerInboxRow(b) {
  const base = shapeBooking(b);
  return {
    ...base,
    garden: b.garden
      ? {
          id: Number(b.garden.id),
          title: b.garden.title ?? '',
          address: b.garden.address ?? '',
        }
      : null,
    requester: b.user
      ? {
          id: Number(b.user.id),
          firstName: b.user.firstName ?? '',
          lastName: b.user.lastName ?? '',
          email: b.user.email ?? null,
          avatarUrl: b.user.avatarUrl ?? null,
        }
      : null,
  };
}

/* ---------------------------------------
   Notifications (simple in-app messages)
----------------------------------------*/
async function sendMessage({ fromUserId, toUserId, content }) {
  try {
    await prisma.message.create({
      data: {
        senderUserId: fromUserId != null ? BigInt(fromUserId) : null,
        targetUserId: toUserId != null ? BigInt(toUserId) : null,
        content: String(content || '').slice(0, 2000),
      },
    });
  } catch (e) {
    console.error('sendMessage failed:', e?.message || e);
  }
}

/* ---------------------------------------
   ROUTES
----------------------------------------*/

// Owner inbox — bookings on gardens owned by current user
// GET /api/bookings/inbox?status=pending|confirmed|cancelled|completed
router.get('/inbox', requireAuth, async (req, res) => {
  try {
    const ownerUserId = BigInt(req.user.id);
    const status = String(req.query.status || '').trim().toLowerCase();
    const where = {
      garden: { ownerUserId: ownerUserId },
    };
    if (status) {
      // safety: only allow known statuses
      const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ error: 'invalid_status' });
      }
      where.status = status;
    }

    const rows = await prisma.booking.findMany({
      where,
      orderBy: { bookedAt: 'desc' },
      include: {
        slot: true,
        garden: { select: { id: true, title: true, address: true, ownerUserId: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      },
    });

    const shaped = rows.map(shapeOwnerInboxRow);
    res.json(shaped);
  } catch (e) {
    console.error('GET /bookings/inbox failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

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

    // Mode 1: book existing slot
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

      const created = await prisma.$transaction(async (tx) => {
        await tx.availabilitySlot.update({ where: { id: slot.id }, data: { status: 'booked' } });
        const booking = await tx.booking.create({
          data: {
            userId: BigInt(req.user.id),
            gardenId: slot.gardenId,
            slotId: slot.id,
            status: 'pending',
            notes: notes || null,
          },
          include: { slot: true, garden: { select: { id: true, title: true, ownerUserId: true } } },
        });

        // Notify owner
        if (booking.garden?.ownerUserId) {
          const { startsAt: s2, endsAt: e2 } = buildRangeFromSlot(booking.slot);
          const content = `Nouvelle demande de réservation pour "${booking.garden.title || 'Jardin'}" le ${s2?.toLocaleString()} → ${e2?.toLocaleString()}.`;
          await sendMessage({ fromUserId: req.user.id, toUserId: Number(booking.garden.ownerUserId), content });
        }

        return booking;
      });

      return res.json(shapeBooking(created));
    }

    // Mode 2: free-dates -> create slot then book
    if (!gardenId || !startsAt || !endsAt) {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    const s = new Date(startsAt);
    const e = new Date(endsAt);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return res.status(400).json({ error: 'invalid_dates' });
    if (!(s < e)) return res.status(400).json({ error: 'start_must_be_before_end' });
    if (e < new Date()) return res.status(400).json({ error: 'slot_in_past' });

    const conflict = await hasConflictJS({ gardenId: Number(gardenId), startsAt: s, endsAt: e });
    if (conflict) return res.status(409).json({ error: 'time_conflict' });

    const dateOnly = new Date(s.toDateString());

    const created = await prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.create({
        data: {
          gardenId: BigInt(gardenId),
          date: dateOnly,
          startTime: s,
          endTime: e,
          status: 'booked',
        },
      });

      const booking = await tx.booking.create({
        data: {
          userId: BigInt(req.user.id),
          gardenId: BigInt(gardenId),
          slotId: slot.id,
          status: 'pending',
          notes: notes || null,
        },
        include: { slot: true, garden: { select: { id: true, title: true, ownerUserId: true } } },
      });

      // Notify owner
      if (booking.garden?.ownerUserId) {
        const { startsAt: s2, endsAt: e2 } = buildRangeFromSlot(booking.slot);
        const content = `Nouvelle demande de réservation pour "${booking.garden.title || 'Jardin'}" le ${s2?.toLocaleString()} → ${e2?.toLocaleString()}.`;
        await sendMessage({ fromUserId: req.user.id, toUserId: Number(booking.garden.ownerUserId), content });
      }

      return booking;
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

// PATCH /api/bookings/:id  (update notes/status by requester)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const { status, notes } = req.body || {};

    const current = await prisma.booking.findUnique({
      where: { id },
      include: { slot: true },
    });
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

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: patch,
        include: { slot: true },
      });

      if (b.slotId && (b.status === 'cancelled' || b.status === 'completed')) {
        await tx.availabilitySlot.update({
          where: { id: b.slotId },
          data: { status: 'free' },
        });
      }

      return b;
    });

    res.json(shapeBooking(updated));
  } catch (e) {
    console.error('patch booking error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------------------------------------
   OWNER actions on a booking (confirm/cancel)
----------------------------------------*/

// Confirm booking (owner of the garden only)
router.post('/:id/confirm', requireAuth, async (req, res) => {
  try {
    const id = BigInt(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        slot: true,
        garden: { select: { id: true, title: true, address: true, ownerUserId: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!booking) return res.status(404).json({ error: 'not_found' });

    const ownerId = booking.garden?.ownerUserId;
    if (!ownerId || String(ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'forbidden_not_owner' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: { status: 'confirmed' },
        include: { slot: true, garden: { select: { id: true, title: true, address: true, ownerUserId: true } }, user: true },
      });

      if (b.slotId) {
        await tx.availabilitySlot.update({ where: { id: b.slotId }, data: { status: 'booked' } });
      }

      // notify gardener
      const { startsAt, endsAt } = buildRangeFromSlot(b.slot);
      const content =
        `Votre réservation sur "${b.garden?.title || 'Jardin'}" a été confirmée ` +
        `(${startsAt?.toLocaleString()} → ${endsAt?.toLocaleString()}).`;
      await sendMessage({ fromUserId: Number(ownerId), toUserId: Number(b.userId), content });

      return b;
    });

    const shaped = shapeOwnerInboxRow(updated);
    res.json(shaped);
  } catch (e) {
    console.error('confirm booking error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Cancel booking (owner of the garden only)
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const id = BigInt(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        slot: true,
        garden: { select: { id: true, title: true, address: true, ownerUserId: true } },
        user: true,
      },
    });
    if (!booking) return res.status(404).json({ error: 'not_found' });

    const ownerId = booking.garden?.ownerUserId;
    if (!ownerId || String(ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'forbidden_not_owner' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: { status: 'cancelled' },
        include: { slot: true, garden: true, user: true },
      });

      if (b.slotId) {
        await tx.availabilitySlot.update({ where: { id: b.slotId }, data: { status: 'free' } });
      }

      // notify gardener
      const { startsAt, endsAt } = buildRangeFromSlot(b.slot);
      const content =
        `Votre réservation sur "${b.garden?.title || 'Jardin'}" a été annulée ` +
        `(${startsAt?.toLocaleString()} → ${endsAt?.toLocaleString()}).`;
      await sendMessage({ fromUserId: Number(ownerId), toUserId: Number(b.userId), content });

      return b;
    });

    const shaped = shapeOwnerInboxRow(updated);
    res.json(shaped);
  } catch (e) {
    console.error('cancel booking error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
