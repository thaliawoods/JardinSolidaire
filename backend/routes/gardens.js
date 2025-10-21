const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

function auth(req, res, next) {
  try {
    const header = String(req.headers.authorization || '');
    const BEARER = 'bearer ';
    if (!header.toLowerCase().startsWith(BEARER)) {
      return res.status(401).json({ error: 'missing_authorization_header' });
    }
    const token = header.slice(BEARER.length).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'server_misconfigured' });
    const payload = jwt.verify(token, secret);
    const uid = Number(payload.userId ?? payload.id);
    if (!Number.isFinite(uid) || uid <= 0) return res.status(401).json({ error: 'invalid_token_payload' });
    req.userId = uid;
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

router.get('/_ping', (_req, res) => res.json({ ok: true }));

/* ---------- PUBLIC LIST ---------- */
router.get('/', async (req, res) => {
  try {
    const search = String(req.query.search ?? '').trim();
    const kind   = String(req.query.type ?? req.query.kind ?? '').trim();
    const take   = Math.min(Math.max(parseInt(req.query.take ?? '20', 10), 1), 100);
    const skip   = Math.max(parseInt(req.query.skip ?? '0', 10), 0);

    const where = {
      AND: [
        search ? {
          OR: [
            { title:       { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { address:     { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        kind ? { kind } : {},
      ],
    };

    const rows = await prisma.garden.findMany({
      where,
      orderBy: { id: 'asc' },
      take,
      skip,
      select: {
        id: true, ownerUserId: true, title: true, description: true, address: true,
        kind: true, needs: true, photos: true, publishedAt: true, status: true, averageRating: true,
      },
    });

    res.json(rows.map((g) => ({
      id: String(g.id),
      ownerUserId: g.ownerUserId ? String(g.ownerUserId) : null,
      title: g.title ?? '', description: g.description ?? '', address: g.address ?? '',
      kind: g.kind ?? '', needs: g.needs ?? '', photos: Array.isArray(g.photos) ? g.photos : [],
      publishedAt: g.publishedAt, status: g.status ?? null, averageRating: g.averageRating ?? null,
    })));
  } catch (err) {
    console.error('GET /gardens error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------- PUBLIC BY ID ---------- */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });

  try {
    const g = await prisma.garden.findUnique({
      where: { id },
      include: {
        ownerUser: {
          select: {
            id: true, firstName: true, lastName: true, email: true,
            phone: true, address: true, avatarUrl: true, averageRating: true, bio: true,
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
      title: g.title ?? '', description: g.description ?? '', address: g.address ?? '',
      kind: g.kind ?? '', needs: g.needs ?? '',
      photos: Array.isArray(g.photos) ? g.photos : [],
      publishedAt: g.publishedAt, status: g.status ?? null, averageRating: g.averageRating ?? null,
      owner: g.ownerUser ? {
        id: String(g.ownerUser.id),
        firstName: g.ownerUser.firstName ?? '', lastName: g.ownerUser.lastName ?? '',
        avatarUrl: g.ownerUser.avatarUrl ?? null, phone: g.ownerUser.phone ?? null,
        address: g.ownerUser.address ?? null, averageRating: g.ownerUser.averageRating ?? null,
        bio: g.ownerUser.bio ?? null, email: g.ownerUser.email ?? null,
      } : null,
      ownerDemoId,
    });
  } catch (err) {
    console.error('GET /gardens/:id error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------- OWNER-ONLY: CREATE ONE GARDEN ---------- */
router.post('/', auth, async (req, res) => {
  try {
    const me = await prisma.user.findUnique({ where: { id: BigInt(req.userId) }, select: { role: true } });
    if (!me) return res.status(404).json({ error: 'not_found' });
    if (String(me.role || '').toUpperCase() !== 'OWNER') {
      return res.status(403).json({ error: 'forbidden_owner_only' });
    }

    // Because your schema has @unique on Garden.ownerUserId (one garden per owner)
    const exists = await prisma.garden.findFirst({ where: { ownerUserId: BigInt(req.userId) } });
    if (exists) return res.status(409).json({ error: 'owner_already_has_garden' });

    const { title, description, address, kind, needs, photos } = req.body || {};
    if (!title || !address) return res.status(400).json({ error: 'missing_fields', fields: ['title','address'] });

    const created = await prisma.garden.create({
      data: {
        ownerUserId: BigInt(req.userId),
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        address: String(address).trim(),
        kind: kind ? String(kind).trim() : null,
        needs: needs ? String(needs).trim() : null,
        photos: Array.isArray(photos) ? photos : [],
        status: 'active',
      },
      select: { id: true, title: true, address: true }
    });

    res.json({ id: String(created.id), title: created.title, address: created.address });
  } catch (err) {
    console.error('POST /gardens error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
