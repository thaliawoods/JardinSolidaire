const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.get('/', async (req, res) => {
  try {
    const kind     = String(req.query.kind ?? req.query.type ?? '').trim() || undefined;
    const district = String(req.query.district ?? req.query.quartier ?? '').trim() || undefined;
    const skip     = Number.parseInt(req.query.skip ?? '0', 10);
    const take     = Number.parseInt(req.query.take ?? '10', 10);

    const rows = await prisma.owner.findMany({
      where: {
        kind: kind || undefined,
        district: district ? { contains: district, mode: 'insensitive' } : undefined,
      },
      skip: Number.isFinite(skip) ? skip : 0,
      take: Number.isFinite(take) ? take : 10,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        isOnline: true,
        totalReviews: true,
        rating: true,
        district: true,
        availability: true,
        area: true,
        kind: true,
        intro: true,
        description: true,
        _count: { select: { comments: true } }, 
      },
    });

    res.json(
      rows.map((o) => ({
        id: String(o.id),
        firstName: o.firstName ?? null,
        lastName: o.lastName ?? null,
        avatarUrl: o.avatarUrl ?? null,
        isOnline: !!o.isOnline,
        totalReviews: o.totalReviews ?? 0,
        rating: o.rating ?? 4.8,
        district: o.district ?? '—',
        availability: o.availability ?? '—',
        area: o.area ?? null,
        kind: o.kind ?? '—',
        intro: o.intro ?? o.description ?? '—',
        commentsCount: o._count?.comments ?? 0,
      })),
    );
  } catch (err) {
    console.error('GET /owners error:', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });

  try {
    const o = await prisma.owner.findUnique({
      where: { id: BigInt(id) },
      include: { comments: { orderBy: { createdAt: 'desc' } } },
    });
    if (!o) return res.status(404).json({ error: 'not_found' });

    res.json({
      id: String(o.id),
      firstName: o.firstName ?? null,
      lastName: o.lastName ?? null,
      avatarUrl: o.avatarUrl ?? null,
      isOnline: !!o.isOnline,
      totalReviews: o.totalReviews ?? 0,
      rating: o.rating ?? 4.8,
      district: o.district ?? '—',
      availability: o.availability ?? '—',
      area: o.area ?? null,
      kind: o.kind ?? '—',
      intro: o.intro ?? o.description ?? '—',
      comments: (o.comments || []).map((c) => ({
        id: c.id,
        text: c.text,
        author: c.authorName ?? null,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error('GET /owners/:id error:', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      firstName = null,
      lastName = null,
      avatarUrl = null,
      isOnline = false,
      totalReviews = 0,
      rating = 4.8,
      district = null,
      availability = null,
      area = null,
      kind = null,
      intro = null,
      description = null,
    } = req.body || {};

    const created = await prisma.owner.create({
      data: {
        firstName,
        lastName,
        avatarUrl,
        isOnline: !!isOnline,
        totalReviews: Number(totalReviews),
        rating: Number(rating),
        district,
        availability,
        area: area == null ? null : Number(area),
        kind,
        intro,
        description,
      },
      select: { id: true },
    });

    res.status(201).json({ id: String(created.id) });
  } catch (err) {
    console.error('POST /owners failed:', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.post('/:id/comments', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });

  try {
    const { text, authorName = null } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text_required' });
    }

    const exists = await prisma.owner.findUnique({
      where: { id: BigInt(id) },
      select: { id: true },
    });
    if (!exists) return res.status(404).json({ error: 'not_found' });

    const c = await prisma.ownerComment.create({
      data: { text, authorName, ownerId: id },
    });

    res.status(201).json({
      id: c.id,
      text: c.text,
      author: c.authorName ?? null,
      createdAt: c.createdAt,
    });
  } catch (err) {
    console.error('POST /owners/:id/comments failed:', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
