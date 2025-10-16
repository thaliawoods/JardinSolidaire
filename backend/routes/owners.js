const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

function toOwnerDTO(o, withComments = false) {
  const base = {
    id: String(o.id),
    firstName: o.firstName ?? null,
    lastName: o.lastName ?? null,
    avatarUrl: o.avatarUrl ?? null,
    isOnline: !!o.isOnline,
    totalReviews: o.totalReviews ?? 0,
    rating: o.rating ?? null,
    district: o.district ?? null,
    availability: o.availability ?? null,
    area: o.area ?? null,
    kind: o.kind ?? null,
    intro: o.intro ?? null,
    userId: o.userId == null ? null : o.userId.toString(), 
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

router.get('/', async (_req, res) => {
  try {
    const owners = await prisma.owner.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { comments: true } } },
    });

    const out = owners.map((o) => ({
      ...toOwnerDTO(o, false),
      commentsCount: o._count?.comments ?? 0,
    }));

    res.json(out);
  } catch (err) {
    console.error('GET /api/owners failed:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });

    const o = await prisma.owner.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!o) return res.status(404).json({ error: 'not_found' });

    res.json(toOwnerDTO(o, true));
  } catch (err) {
    console.error('GET /api/owners/:id failed:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
