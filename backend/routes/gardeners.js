const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.get('/', async (req, res) => {
  try {
    const take = Math.min(Math.max(parseInt(req.query.take ?? '20', 10), 1), 100);
    const skip = Math.max(parseInt(req.query.skip ?? '0', 10), 0);
    const q = (req.query.q ?? '').toString().trim();

    const where = q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName:  { contains: q, mode: 'insensitive' } },
            { location:  { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const rows = await prisma.gardener.findMany({
      where,
      orderBy: [{ id: 'asc' }],
      take,
      skip,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        isOnline: true,
        location: true,
        skills: true,           
        yearsExperience: true,
        totalReviews: true,
        rating: true,
        published: true,
      },
    });

    res.json(
      rows.map((g) => ({
        id: String(g.id),
        firstName: g.firstName ?? '',
        lastName: g.lastName ?? '',
        avatarUrl: g.avatarUrl ?? null,
        isOnline: !!g.isOnline,
        location: g.location ?? '',
        skills: g.skills ?? [],
        yearsExperience: g.yearsExperience ?? null,
        totalReviews: g.totalReviews ?? 0,
        rating: g.rating ?? null,
        published: !!g.published,
      }))
    );
  } catch (err) {
    console.error('GET /gardeners error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });

  try {
    const g = await prisma.gardener.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, text: true, authorName: true, createdAt: true },
        },
        user: {
          select: { id: true, email: true }, 
        },
      },
    });

    if (!g) return res.status(404).json({ error: 'not_found' });

    const data = {
      id: String(g.id),
      userId: g.user?.id ? Number(g.user.id) : null,
      firstName: g.firstName ?? '',
      lastName: g.lastName ?? '',
      avatarUrl: g.avatarUrl ?? null,
      isOnline: !!g.isOnline,
      location: g.location ?? '',
      skills: g.skills ?? [],
      yearsExperience: g.yearsExperience ?? null,
      intro: g.intro ?? '',
      totalReviews: g.totalReviews ?? 0,
      rating: g.rating ?? null,
      published: !!g.published,
      comments: (g.comments ?? []).map((c) => ({
        id: c.id,
        text: c.text,
        authorName: c.authorName ?? null,
        createdAt: c.createdAt,
      })),
    };

    res.json(data);
  } catch (err) {
    console.error('GET /gardeners/:id error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
