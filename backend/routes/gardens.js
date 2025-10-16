const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

/**
 * GET /gardens
 * Query:
 *  - search  : text search on title/description/address
 *  - kind    : exact match on kind (ex: "potager", "fleurs")
 *  - take    : page size (default 20, max 100)
 *  - skip    : offset (default 0)
 */
router.get('/', async (req, res) => {
  try {
    const search = String(req.query.search ?? '').trim();
    const kind   = String(req.query.type ?? req.query.kind ?? '').trim(); // accept legacy ?type=
    const take   = Math.min(Math.max(parseInt(req.query.take ?? '20', 10), 1), 100);
    const skip   = Math.max(parseInt(req.query.skip ?? '0', 10), 0);

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title:       { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { address:     { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        kind ? { kind } : {},
      ],
    };

    const rows = await prisma.garden.findMany({
      where,
      orderBy: { id: 'asc' },
      take,
      skip,
      select: {
        id: true,
        ownerUserId: true,
        title: true,
        description: true,
        address: true,
        kind: true,
        needs: true,
        photos: true,          
        publishedAt: true,
        status: true,
        averageRating: true,
      },
    });

    res.json(
      rows.map((g) => ({
        id: String(g.id),
        ownerUserId: g.ownerUserId ? String(g.ownerUserId) : null,
        title: g.title ?? '',
        description: g.description ?? '',
        address: g.address ?? '',
        kind: g.kind ?? '',
        needs: g.needs ?? '',
        photos: Array.isArray(g.photos) ? g.photos : [],
        publishedAt: g.publishedAt,
        status: g.status ?? null,
        averageRating: g.averageRating ?? null,
      }))
    );
  } catch (err) {
    console.error('GET /gardens error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * GET /gardens/:id
 * Returns garden details + owner (User) summary.
 * Also tries to find a matching Owner profile by first/last name (demo bridge).
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });

  try {
    const g = await prisma.garden.findUnique({
      where: { id },
      include: {
        ownerUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
            avatarUrl: true,
            averageRating: true,
            bio: true,
          },
        },
      },
    });

    if (!g) return res.status(404).json({ error: 'not_found' });

    let ownerDemoId = null;
    if (g.ownerUser?.firstName || g.ownerUser?.lastName) {
      const demo = await prisma.owner.findFirst({
        where: {
          firstName: g.ownerUser?.firstName || undefined,
          lastName:  g.ownerUser?.lastName  || undefined,
        },
        select: { id: true },
      });
      if (demo) ownerDemoId = String(demo.id);
    }

    res.json({
      id: String(g.id),
      title: g.title ?? '',
      description: g.description ?? '',
      address: g.address ?? '',
      kind: g.kind ?? '',
      needs: g.needs ?? '',
      photos: Array.isArray(g.photos) ? g.photos : [],
      publishedAt: g.publishedAt,
      status: g.status ?? null,
      averageRating: g.averageRating ?? null,

      owner: g.ownerUser
        ? {
            id: String(g.ownerUser.id),
            firstName: g.ownerUser.firstName ?? '',
            lastName: g.ownerUser.lastName ?? '',
            avatarUrl: g.ownerUser.avatarUrl ?? null,
            phone: g.ownerUser.phone ?? null,
            address: g.ownerUser.address ?? null,
            averageRating: g.ownerUser.averageRating ?? null,
            bio: g.ownerUser.bio ?? null,
            email: g.ownerUser.email ?? null,
          }
        : null,

      ownerDemoId,
    });
  } catch (err) {
    console.error('GET /gardens/:id error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
