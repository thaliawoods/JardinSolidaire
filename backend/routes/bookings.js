const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const take = Math.min(Math.max(parseInt(req.query.take ?? '50', 10), 1), 100);
    const skip = Math.max(parseInt(req.query.skip ?? '0', 10), 0);

    const rows = await prisma.booking.findMany({
      take, skip,
      orderBy: { bookedAt: 'desc' },
      include: {
        user:   { select: { id: true, firstName: true, lastName: true, email: true } },
        garden: { select: { id: true, title: true, address: true } },
        slot:   { select: { id: true, date: true, startTime: true, endTime: true, status: true } },
      },
    });

    res.json(rows.map(b => ({
      id: Number(b.id),
      userId: Number(b.userId ?? 0),
      gardenId: Number(b.gardenId ?? 0),
      slotId: b.slotId == null ? null : Number(b.slotId),
      status: b.status ?? null,
      bookedAt: b.bookedAt,
      notes: b.notes ?? '',
      user: b.user ? {
        id: Number(b.user.id),
        firstName: b.user.firstName ?? '',
        lastName: b.user.lastName ?? '',
        email: b.user.email ?? '',
      } : null,
      garden: b.garden ? {
        id: Number(b.garden.id),
        title: b.garden.title ?? '',
        address: b.garden.address ?? '',
      } : null,
      slot: b.slot ? {
        id: Number(b.slot.id),
        date: b.slot.date,
        startTime: b.slot.startTime,
        endTime: b.slot.endTime,
        status: b.slot.status ?? null,
      } : null,
    })));
  } catch (error) {
    console.error('GET /bookings failed:', error);
    res.status(500).json({ error: 'server_error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      userId, gardenId, slotId = null,
      bookedAt = new Date(),
      status = 'pending',
      notes = '',
    } = req.body || {};

    const uid = Number(userId);
    const gid = Number(gardenId);
    const sid = slotId == null ? null : Number(slotId);

    if (!Number.isFinite(uid) || !Number.isFinite(gid)) {
      return res.status(400).json({ error: 'userId_and_gardenId_required' });
    }

    const created = await prisma.booking.create({
      data: {
        userId: BigInt(uid),
        gardenId: BigInt(gid),
        slotId: sid == null ? null : BigInt(sid),
        bookedAt: new Date(bookedAt),
        status,
        notes,
      },
      include: {
        user:   { select: { id: true, firstName: true, lastName: true, email: true } },
        garden: { select: { id: true, title: true, address: true } },
      },
    });

    res.status(201).json({
      id: Number(created.id),
      userId: Number(created.userId),
      gardenId: Number(created.gardenId),
      slotId: created.slotId == null ? null : Number(created.slotId),
      status: created.status,
      bookedAt: created.bookedAt,
      notes: created.notes ?? '',
      user: created.user ? {
        id: Number(created.user.id),
        firstName: created.user.firstName ?? '',
        lastName: created.user.lastName ?? '',
        email: created.user.email ?? '',
      } : null,
      garden: created.garden ? {
        id: Number(created.garden.id),
        title: created.garden.title ?? '',
        address: created.garden.address ?? '',
      } : null,
    });
  } catch (error) {
    console.error('POST /bookings failed:', error);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
