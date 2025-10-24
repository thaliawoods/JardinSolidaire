// backend/routes/gardens.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const {
  geocodeAddress,
  safeUpdateCoords,
  scheduleGeocodeRetries,
} = require('../lib/geocode');

const prisma = new PrismaClient();
const router = express.Router();

/* ---------- auth helper ---------- */
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

/* =========================
 * PUBLIC: list + by id
 * ========================= */
router.get('/', async (req, res) => {
  try {
    const search = String(req.query.search ?? '').trim();
    const kind   = String(req.query.type ?? req.query.kind ?? '').trim();
    const take   = Math.min(Math.max(parseInt(req.query.take ?? '50', 10), 1), 100);
    const skip   = Math.max(parseInt(req.query.skip ?? '0', 10), 0);

    const mine      = String(req.query.mine ?? '') === '1';
    const published = req.query.published === undefined
      ? (!mine ? true : undefined)
      : (String(req.query.published).toLowerCase() === 'true' ? true : false);

    const whereAND = [];
    if (search) {
      whereAND.push({
        OR: [
          { title:       { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address:     { contains: search, mode: 'insensitive' } },
        ],
      });
    }
    if (kind) whereAND.push({ kind });
    if (published !== undefined) whereAND.push({ publishedAt: published ? { not: null } : null });

    if (mine) {
      try {
        const header = String(req.headers.authorization || '');
        const t = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : null;
        if (!t) return res.status(401).json({ error: 'auth_required_for_mine' });
        const payload = jwt.verify(t, process.env.JWT_SECRET);
        const ownerUserId = Number(payload.userId ?? payload.id);
        whereAND.push({ ownerUserId: BigInt(ownerUserId) });
      } catch {
        return res.status(401).json({ error: 'auth_required_for_mine' });
      }
    }

    const rows = await prisma.garden.findMany({
      where: { AND: whereAND },
      orderBy: { id: 'desc' },
      take,
      skip,
      select: {
        id: true, ownerUserId: true, title: true, description: true, address: true,
        kind: true, needs: true, photos: true, publishedAt: true, status: true, averageRating: true,
        lat: true, lng: true,
      },
    });

    res.json(rows.map((g) => ({
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
      lat: Number.isFinite(g.lat) ? g.lat : null,
      lng: Number.isFinite(g.lng) ? g.lng : null,
    })));
  } catch (err) {
    console.error('GET /gardens error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });
  try {
    const g = await prisma.garden.findUnique({
      where: { id: BigInt(id) },
      include: {
        ownerUser: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
        },
      },
    });
    if (!g) return res.status(404).json({ error: 'not_found' });

    res.json({
      id: String(g.id),
      title: g.title ?? '',
      description: g.description ?? '',
      address: g.address ?? '',
      area: g.area ?? null,
      kind: g.kind ?? '',
      needs: g.needs ?? '',
      photos: Array.isArray(g.photos) ? g.photos : [],
      publishedAt: g.publishedAt,
      status: g.status ?? null,
      lat: Number.isFinite(g.lat) ? g.lat : null,
      lng: Number.isFinite(g.lng) ? g.lng : null,
      owner: g.ownerUser ? {
        id: String(g.ownerUser.id),
        firstName: g.ownerUser.firstName ?? '',
        lastName: g.ownerUser.lastName ?? '',
        email: g.ownerUser.email ?? null,
        avatarUrl: g.ownerUser.avatarUrl ?? null,
      } : null,
    });
  } catch (err) {
    console.error('GET /gardens/:id error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* =========================
 * OWNER actions
 * ========================= */

// Create (auto-geocode with retry)
router.post('/', auth, async (req, res) => {
  try {
    const me = await prisma.user.findUnique({ where: { id: BigInt(req.userId) }, select: { role: true } });
    if (!me || String(me.role || '').toUpperCase() !== 'OWNER') {
      return res.status(403).json({ error: 'forbidden_owner_only' });
    }
    const { title, description, address, area, kind, needs, photos, lat, lng } = req.body || {};
    if (!title || !address) return res.status(400).json({ error: 'missing_fields', fields: ['title', 'address'] });

    let resolvedLat = Number.isFinite(Number(lat)) ? Number(lat) : null;
    let resolvedLng = Number.isFinite(Number(lng)) ? Number(lng) : null;

    if (resolvedLat == null || resolvedLng == null) {
      try {
        const coords = await geocodeAddress(address);
        if (coords) {
          resolvedLat = coords.lat;
          resolvedLng = coords.lng;
        }
      } catch (e) {
        console.warn('[gardens POST] geocode failed:', e?.message || e);
      }
    }

    const created = await prisma.garden.create({
      data: {
        ownerUserId: BigInt(req.userId),
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        address: String(address).trim(),
        area: area != null ? Number(area) : null,
        kind: kind ? String(kind).trim() : null,
        needs: needs ? String(needs).trim() : null,
        photos: Array.isArray(photos) ? photos : [],
        status: 'active',
        lat: resolvedLat,
        lng: resolvedLng,
      },
      select: { id: true, title: true, address: true, publishedAt: true, lat: true, lng: true },
    });

    // background retries if still missing
    if (created.lat == null || created.lng == null) {
      scheduleGeocodeRetries(prisma, created.id, created.address);
    }

    res.json({
      id: String(created.id),
      title: created.title,
      address: created.address,
      publishedAt: created.publishedAt,
      lat: created.lat ?? null,
      lng: created.lng ?? null,
    });
  } catch (err) {
    console.error('POST /gardens error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Update (re-geocode on address change unless lat/lng explicitly provided)
router.put('/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });

  try {
    const g = await prisma.garden.findUnique({ where: { id: BigInt(id) } });
    if (!g) return res.status(404).json({ error: 'not_found' });
    if (String(g.ownerUserId) !== String(req.userId)) return res.status(403).json({ error: 'forbidden' });

    const { title, description, address, area, kind, needs, photos, lat, lng } = req.body || {};

    const latProvided = lat !== undefined;
    const lngProvided = lng !== undefined;
    const addressProvided = address !== undefined;

    let nextLatLng = {};
    if (latProvided || lngProvided) {
      nextLatLng.lat = Number.isFinite(Number(lat)) ? Number(lat) : null;
      nextLatLng.lng = Number.isFinite(Number(lng)) ? Number(lng) : null;
    } else if (addressProvided) {
      const newAddr = String(address ?? '').trim();
      if (newAddr && newAddr !== (g.address || '')) {
        try {
          const coords = await geocodeAddress(newAddr);
          if (coords) {
            nextLatLng.lat = coords.lat;
            nextLatLng.lng = coords.lng;
          } else {
            scheduleGeocodeRetries(prisma, g.id, newAddr);
          }
        } catch {
          scheduleGeocodeRetries(prisma, g.id, newAddr);
        }
      }
    }

    const data = {
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(description !== undefined ? { description: description ? String(description).trim() : null } : {}),
      ...(address !== undefined ? { address: String(address).trim() } : {}),
      ...(area !== undefined ? { area: area != null ? Number(area) : null } : {}),
      ...(kind !== undefined ? { kind: kind ? String(kind).trim() : null } : {}),
      ...(needs !== undefined ? { needs: needs ? String(needs).trim() : null } : {}),
      ...(photos !== undefined ? { photos: Array.isArray(photos) ? photos : [] } : {}),
      ...(Object.keys(nextLatLng).length ? nextLatLng : {}),
    };

    const updated = await prisma.garden.update({
      where: { id: BigInt(id) },
      data,
      select: { id: true, title: true, address: true, publishedAt: true, lat: true, lng: true },
    });

    res.json({
      id: String(updated.id),
      title: updated.title,
      address: updated.address,
      publishedAt: updated.publishedAt,
      lat: updated.lat ?? null,
      lng: updated.lng ?? null,
    });
  } catch (err) {
    console.error('PUT /gardens/:id error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Publish (fill coords if missing)
router.post('/:id/publish', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });
  try {
    const g = await prisma.garden.findUnique({ where: { id: BigInt(id) } });
    if (!g) return res.status(404).json({ error: 'not_found' });
    if (String(g.ownerUserId) !== String(req.userId)) return res.status(403).json({ error: 'forbidden' });

    if ((g.lat == null || g.lng == null) && g.address) {
      try {
        const coords = await geocodeAddress(g.address);
        if (coords) {
          await prisma.garden.update({
            where: { id: BigInt(id) },
            data: { lat: coords.lat, lng: coords.lng },
          });
        } else {
          scheduleGeocodeRetries(prisma, g.id, g.address);
        }
      } catch {
        scheduleGeocodeRetries(prisma, g.id, g.address);
      }
    }

    const updated = await prisma.garden.update({
      where: { id: BigInt(id) },
      data: { publishedAt: new Date() },
      select: { id: true, publishedAt: true, lat: true, lng: true },
    });
    res.json({
      id: String(updated.id),
      publishedAt: updated.publishedAt,
      lat: updated.lat ?? null,
      lng: updated.lng ?? null,
    });
  } catch (err) {
    console.error('POST /gardens/:id/publish error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Hard delete
router.delete('/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });
  try {
    const g = await prisma.garden.findUnique({ where: { id: BigInt(id) } });
    if (!g) return res.status(404).json({ error: 'not_found' });
    if (String(g.ownerUserId) !== String(req.userId)) return res.status(403).json({ error: 'forbidden' });

    await prisma.garden.delete({ where: { id: BigInt(id) } });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /gardens/:id error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* =========================
 * Maintenance / Debug
 * ========================= */

// force-geocode a single garden (owner only)
router.post('/:id/force-geocode', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'invalid_id' });
  try {
    const g = await prisma.garden.findUnique({
      where: { id: BigInt(id) },
      select: { id: true, ownerUserId: true, address: true },
    });
    if (!g) return res.status(404).json({ error: 'not_found' });
    if (String(g.ownerUserId) !== String(req.userId)) return res.status(403).json({ error: 'forbidden' });
    if (!g.address) return res.status(400).json({ error: 'no_address' });

    const ret = await safeUpdateCoords(prisma, g.id, g.address);
    if (!ret) return res.status(503).json({ error: 'geocode_failed' });
    res.json({ id: String(ret.id), lat: ret.lat, lng: ret.lng, provider: ret.provider });
  } catch (e) {
    console.error('POST /gardens/:id/force-geocode error:', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// batch missing
router.post('/_geocode-missing', async (_req, res) => {
  try {
    const missing = await prisma.garden.findMany({
      where: { OR: [{ lat: null }, { lng: null }], address: { not: null } },
      select: { id: true, address: true },
      take: 1000,
    });

    let updated = 0;
    for (const g of missing) {
      const ret = await safeUpdateCoords(prisma, g.id, g.address);
      if (ret) updated += 1;
      await sleep(300); // spread requests
    }

    res.json({ ok: true, updated, scanned: missing.length });
  } catch (e) {
    console.error('POST /gardens/_geocode-missing error:', e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
