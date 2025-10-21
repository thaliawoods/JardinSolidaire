// backend/routes/availability.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

/* ---------------- Auth ---------------- */
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

/* ---------------- Helpers (UTC-safe) ---------------- */
function parseISODate(iso) {
  if (!iso) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [_, y, mo, d] = m;
  const dt = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), 0, 0, 0, 0));
  return Number.isNaN(dt.getTime()) ? null : dt;
}
function normalizeTimeString(t) {
  if (!t) return null;
  const m = String(t).match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = m[1], mm = m[2], ss = m[3] || '00';
  return `${hh}:${mm}:${ss}`;
}
function toISODateUTC(d) {
  const x = new Date(d);
  const y = x.getUTCFullYear();
  const m = String(x.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(x.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
function toTimeUTC(d) {
  const x = new Date(d);
  const hh = String(x.getUTCHours()).padStart(2, '0');
  const mm = String(x.getUTCMinutes()).padStart(2, '0');
  const ss = String(x.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
function timeOnlyUTC(hms) {
  return new Date(`1970-01-01T${hms}Z`);
}

/* ================================================================
   GARDEN availability (AvailabilitySlot)
   ================================================================ */

// GET /api/availability/gardens/:gardenId?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/gardens/:gardenId', async (req, res) => {
  try {
    const gardenId = BigInt(req.params.gardenId);
    const from = parseISODate(req.query.from);
    const to = parseISODate(req.query.to);

    const where = { gardenId };
    if (from && to) where.date = { gte: from, lt: to };

    const slots = await prisma.availabilitySlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const slotIds = slots.map((s) => s.id);
    let bookedMap = new Map();
    if (slotIds.length) {
      const bookings = await prisma.booking.findMany({
        where: { slotId: { in: slotIds }, status: { in: ['pending', 'confirmed'] } },
        select: { slotId: true },
      });
      bookedMap = new Map(bookings.map((b) => [b.slotId, true]));
    }

    const shaped = slots.map((s) => ({
      id: Number(s.id),
      date: toISODateUTC(s.date),
      startTime: toTimeUTC(s.startTime),
      endTime: toTimeUTC(s.endTime),
      status: bookedMap.get(s.id) ? 'booked' : (s.status || 'free'),
    }));

    res.json({ slots: shaped });
  } catch (e) {
    console.error('GET gardens availability error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST /api/availability/gardens/:gardenId  (OWNER of this garden only)
router.post('/gardens/:gardenId', requireAuth, async (req, res) => {
  try {
    const gardenId = BigInt(req.params.gardenId);
    const me = BigInt(req.user.id);

    const garden = await prisma.garden.findUnique({ where: { id: gardenId }, select: { ownerUserId: true } });
    if (!garden) return res.status(404).json({ error: 'garden_not_found' });
    if (garden.ownerUserId !== me) return res.status(403).json({ error: 'forbidden_not_owner' });

    const date = parseISODate(req.body?.date);
    const start = normalizeTimeString(req.body?.startTime);
    const end   = normalizeTimeString(req.body?.endTime);
    const status = req.body?.status === 'unavailable' ? 'unavailable' : 'free';
    if (!date || !start || !end) return res.status(400).json({ error: 'invalid_payload' });

    const startUTC = timeOnlyUTC(start);
    const endUTC   = timeOnlyUTC(end);

    const existing = await prisma.availabilitySlot.findFirst({
      where: { gardenId, date, startTime: startUTC, endTime: endUTC },
    });

    let slot;
    if (existing) {
      slot = await prisma.availabilitySlot.update({ where: { id: existing.id }, data: { status } });
    } else {
      slot = await prisma.availabilitySlot.create({
        data: { gardenId, date, startTime: startUTC, endTime: endUTC, status },
      });
    }

    res.json({
      slot: {
        id: Number(slot.id),
        date: toISODateUTC(slot.date),
        startTime: toTimeUTC(slot.startTime),
        endTime: toTimeUTC(slot.endTime),
        status: slot.status || 'free',
      },
    });
  } catch (e) {
    console.error('POST gardens availability error:', e?.message || e);
    res.status(500).json({ error: 'server_error', detail: e?.message });
  }
});

// DELETE /api/availability/gardens/:gardenId/:slotId  (OWNER of this garden only)
router.delete('/gardens/:gardenId/:slotId', requireAuth, async (req, res) => {
  try {
    const gardenId = BigInt(req.params.gardenId);
    const slotId = BigInt(req.params.slotId);
    const me = BigInt(req.user.id);

    const garden = await prisma.garden.findUnique({ where: { id: gardenId }, select: { ownerUserId: true } });
    if (!garden) return res.status(404).json({ error: 'garden_not_found' });
    if (garden.ownerUserId !== me) return res.status(403).json({ error: 'forbidden_not_owner' });

    const conflict = await prisma.booking.findFirst({
      where: { slotId, status: { in: ['pending', 'confirmed'] } },
      select: { id: true },
    });
    if (conflict) return res.status(409).json({ error: 'slot_booked' });

    await prisma.availabilitySlot.delete({ where: { id: slotId } });
    res.json({ ok: true });
  } catch (e) {
    console.error('DELETE gardens availability error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ================================================================
   GARDENER personal availability (GardenerAvailabilitySlot)
   ================================================================ */

// GET /api/availability/gardeners/:gardenerId?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/gardeners/:gardenerId', async (req, res) => {
  try {
    const gardenerId = Number(req.params.gardenerId);
    const from = parseISODate(req.query.from);
    const to = parseISODate(req.query.to);

    const where = { gardenerId };
    if (from && to) where.date = { gte: from, lt: to };

    const slots = await prisma.gardenerAvailabilitySlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const shaped = slots.map((s) => ({
      id: s.id,
      date: toISODateUTC(s.date),
      startTime: toTimeUTC(s.startTime),
      endTime: toTimeUTC(s.endTime),
      status: s.status || 'free',
    }));

    res.json({ slots: shaped });
  } catch (e) {
    console.error('GET gardeners availability error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST /api/availability/gardeners/:gardenerId  (only that gardener)
router.post('/gardeners/:gardenerId', requireAuth, async (req, res) => {
  try {
    const gardenerId = Number(req.params.gardenerId);

    const profile = await prisma.gardener.findUnique({
      where: { id: gardenerId },
      select: { userId: true },
    });
    if (!profile) return res.status(404).json({ error: 'gardener_not_found' });
    if (Number(profile.userId) !== req.user.id) return res.status(403).json({ error: 'forbidden_not_self' });

    const date = parseISODate(req.body?.date);
    const start = normalizeTimeString(req.body?.startTime);
    const end   = normalizeTimeString(req.body?.endTime);
    const status = req.body?.status === 'unavailable' ? 'unavailable' : 'free';
    if (!date || !start || !end) return res.status(400).json({ error: 'invalid_payload' });

    const startUTC = timeOnlyUTC(start);
    const endUTC   = timeOnlyUTC(end);

    const existing = await prisma.gardenerAvailabilitySlot.findFirst({
      where: { gardenerId, date, startTime: startUTC, endTime: endUTC },
    });

    let slot;
    if (existing) {
      slot = await prisma.gardenerAvailabilitySlot.update({ where: { id: existing.id }, data: { status } });
    } else {
      slot = await prisma.gardenerAvailabilitySlot.create({
        data: { gardenerId, date, startTime: startUTC, endTime: endUTC, status },
      });
    }

    res.json({
      id: slot.id,
      date: toISODateUTC(slot.date),
      startTime: toTimeUTC(slot.startTime),
      endTime: toTimeUTC(slot.endTime),
      status: slot.status,
    });
  } catch (e) {
    console.error('POST gardeners availability error:', e?.message || e);
    res.status(500).json({ error: 'server_error', detail: e?.message });
  }
});

// DELETE /api/availability/gardeners/:gardenerId/:slotId  (only that gardener)
router.delete('/gardeners/:gardenerId/:slotId', requireAuth, async (req, res) => {
  try {
    const gardenerId = Number(req.params.gardenerId);
    const slotId = Number(req.params.slotId);

    const profile = await prisma.gardener.findUnique({
      where: { id: gardenerId },
      select: { userId: true },
    });
    if (!profile) return res.status(404).json({ error: 'gardener_not_found' });
    if (Number(profile.userId) !== req.user.id) return res.status(403).json({ error: 'forbidden_not_self' });

    await prisma.gardenerAvailabilitySlot.delete({ where: { id: slotId } });
    res.json({ ok: true });
  } catch (e) {
    console.error('DELETE gardeners availability error:', e?.message || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
