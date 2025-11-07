// backend/routes/owners.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/** Map DB entity -> API DTO (with user fallbacks) */
function toOwnerDTO(o, { withComments = false } = {}) {
  const base = {
    id: String(o.id),
    userId: o.userId == null ? null : o.userId.toString(),
    firstName: o.firstName ?? null,
    lastName: o.lastName ?? null,
    // prefer owner avatar, fallback to linked user avatar
    avatarUrl: (o.avatarUrl ?? o.user?.avatarUrl) ?? null,
    isOnline: !!o.isOnline,
    totalReviews: o.totalReviews ?? 0,
    rating: o.rating ?? null,
    district: o.district ?? null,
    availability: o.availability ?? null,
    area: o.area ?? null,
    kind: o.kind ?? null,
    intro: o.intro ?? null,
    // expose address via the linked user for the frontend
    address: o.user?.address ?? null,
  };

  if (!withComments) return base;

  return {
    ...base,
    comments: (o.comments ?? []).map((c) => ({
      id: String(c.id),
      text: c.text,
      authorName: c.authorName ?? null,
      createdAt: c.createdAt ? c.createdAt.toISOString() : null,
    })),
  };
}

/** GET /api/owners — list */
router.get('/', async (_req, res) => {
  try {
    const owners = await prisma.owner.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: { select: { comments: true } },
        user: { select: { id: true, avatarUrl: true, address: true } },
      },
    });

    const out = owners.map((o) => ({
      ...toOwnerDTO(o, { withComments: false }),
      commentsCount: o._count?.comments ?? 0,
    }));

    res.json(out);
  } catch (err) {
    console.error('GET /api/owners failed:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/** GET /api/owners/:id — accepts owner.id OR user.id */
router.get('/:id', async (req, res) => {
  try {
    const n = Number(req.params.id);
    if (!Number.isFinite(n) || n <= 0) {
      return res.status(400).json({ error: 'invalid_id' });
    }

    // 1) try owner by its own id
    let o = await prisma.owner.findUnique({
      where: { id: n },
      include: {
        user: { select: { id: true, avatarUrl: true, address: true } },
        comments: true,
      },
    });

    // 2) if not found, try by userId (BigInt)
    if (!o) {
      o = await prisma.owner.findUnique({
        where: { userId: BigInt(n) },
        include: {
          user: { select: { id: true, avatarUrl: true, address: true } },
          comments: true,
        },
      });
    }

    if (!o) return res.status(404).json({ error: 'not_found' });

    res.json(toOwnerDTO(o, { withComments: true }));
  } catch (err) {
    console.error('GET /api/owners/:id failed:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
