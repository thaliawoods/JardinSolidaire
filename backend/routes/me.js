// routes/me.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

/* -------------------- auth middleware -------------------- */
function auth(req, res, next) {
  try {
    const header = String(req.headers.authorization || '');
    const BEARER = 'bearer ';
    if (!header.toLowerCase().startsWith(BEARER)) {
      return res.status(401).json({ error: 'missing_authorization_header' });
    }
    const token = header.slice(BEARER.length).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'server_misconfigured', detail: 'JWT_SECRET missing' });
    }

    const payload = jwt.verify(token, secret);
    const uid = Number(payload.userId ?? payload.id);
    if (!Number.isFinite(uid) || uid <= 0) {
      return res.status(401).json({ error: 'invalid_token_payload' });
    }
    req.userId = uid;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

/* -------------------- small helpers -------------------- */
const isDev = process.env.NODE_ENV !== 'production';

function cleanString(x, { allowEmpty = true } = {}) {
  if (x == null) return allowEmpty ? '' : null;
  const s = String(x).trim();
  return s || (allowEmpty ? '' : null);
}
function cleanInt(x, { allowNull = true } = {}) {
  if (x == null || x === '') return allowNull ? null : 0;
  const n = Number.parseInt(x, 10);
  return Number.isFinite(n) ? n : (allowNull ? null : 0);
}
function asStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return Array.from(
    new Set(
      arr
        .map((v) => cleanString(v))
        .filter((v) => v !== '')
    )
  );
}

/* -------------------------------------------------------- */

router.get('/_ping', (_req, res) => res.json({ ok: true }));

/**
 * GET /me
 * Returns the authenticated user + attached Gardener/Owner profiles (if any)
 * Uses ENGLISH keys in the response for consistency with your frontend.
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(req.userId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        phone: true,
        address: true,
        averageRating: true,
        gardener: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isOnline: true,
            location: true,
            skills: true,            // string[]
            yearsExperience: true,
            intro: true,
            totalReviews: true,
            rating: true,
            published: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        owner: {
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
            published: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'not_found' });

    res.json({
      user: {
        id: Number(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        phone: user.phone,
        address: user.address,
        averageRating: user.averageRating,
        gardener: user.gardener
          ? { ...user.gardener, id: Number(user.gardener.id) }
          : null,
        owner: user.owner ? { ...user.owner, id: Number(user.owner.id) } : null,
      },
    });
  } catch (e) {
    console.error('GET /me failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * POST /me/gardener  (upsert)
 * Accepts EN keys (preferred) and FR aliases (mapped to EN):
 * EN: firstName, lastName, location, skills[], yearsExperience, intro, avatarUrl?, isOnline?, totalReviews?, rating?, published?
 * FR: prenom, nom, localisation, competences[], experienceAnnees, presentation
 */
router.post('/gardener', auth, async (req, res) => {
  try {
    const userId = BigInt(req.userId);

    // Accept English AND French aliases
    const body = req.body || {};
    const firstName = cleanString(body.firstName ?? body.prenom);
    const lastName = cleanString(body.lastName ?? body.nom);
    const location = cleanString(body.location ?? body.localisation);
    const intro = cleanString(body.intro ?? body.presentation);
    const yearsExperience = cleanInt(body.yearsExperience ?? body.experienceAnnees, { allowNull: true });

    // skills as array of strings (FR: competences)
    const skills = asStringArray(body.skills ?? body.competences);

    const avatarUrl = body.avatarUrl == null ? null : cleanString(body.avatarUrl);
    const isOnline = !!body.isOnline;
    const totalReviews = cleanInt(body.totalReviews, { allowNull: false });
    const rating =
      body.rating == null || body.rating === ''
        ? null
        : Number.isFinite(Number(body.rating))
          ? Number(body.rating)
          : null;

    // Basic required validation for first/last/intro (keep lenient like your frontend)
    if (!firstName || !lastName || !intro) {
      return res.status(400).json({ error: 'validation_error', fields: ['firstName', 'lastName', 'intro'] });
    }

    const data = {
      userId,
      firstName,
      lastName,
      avatarUrl,
      isOnline,
      location: location || null,
      skills, // string[]
      yearsExperience: yearsExperience,
      intro,
      totalReviews: totalReviews || 0,
      rating,
    };

    const profile = await prisma.gardener.upsert({
      where: { userId },
      update: data,
      create: { ...data, published: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        location: true,
        skills: true,
        yearsExperience: true,
        intro: true,
        rating: true,
        totalReviews: true,
        published: true,
      },
    });

    res.json({ gardener: { ...profile, id: Number(profile.id) } });
  } catch (e) {
    console.error('POST /me/gardener failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * POST /me/gardener/publish
 * Body: { published: boolean }
 */
router.post('/gardener/publish', auth, async (req, res) => {
  try {
    const userId = BigInt(req.userId);
    const { published } = req.body || {};
    const updated = await prisma.gardener.update({
      where: { userId },
      data: { published: !!published },
      select: { id: true, published: true },
    });
    res.json({ gardener: { ...updated, id: Number(updated.id) } });
  } catch (e) {
    console.error('POST /me/gardener/publish failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * POST /me/owner  (upsert)
 * English keys
 */
router.post('/owner', auth, async (req, res) => {
  try {
    const userId = BigInt(req.userId);
    const body = req.body || {};

    const ownerData = {
      userId,
      firstName: cleanString(body.firstName),
      lastName: cleanString(body.lastName),
      avatarUrl: body.avatarUrl == null ? null : cleanString(body.avatarUrl),
      isOnline: !!body.isOnline,
      totalReviews: cleanInt(body.totalReviews, { allowNull: false }) || 0,
      rating:
        body.rating == null || body.rating === ''
          ? null
          : Number.isFinite(Number(body.rating))
            ? Number(body.rating)
            : null,
      district: cleanString(body.district),
      availability: cleanString(body.availability),
      area:
        body.area == null || body.area === ''
          ? null
          : Number.isFinite(Number(body.area))
            ? Number(body.area)
            : null,
      kind: cleanString(body.kind),
      intro: cleanString(body.intro),
      description: cleanString(body.description),
    };

    const owner = await prisma.owner.upsert({
      where: { userId },
      update: ownerData,
      create: { ...ownerData, published: false },
      select: { id: true, firstName: true, lastName: true, published: true },
    });

    res.json({ owner: { ...owner, id: Number(owner.id) } });
  } catch (e) {
    console.error('POST /me/owner failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * POST /me/owner/publish
 * Body: { published: boolean }
 */
router.post('/owner/publish', auth, async (req, res) => {
  try {
    const userId = BigInt(req.userId);
    const { published } = req.body || {};
    const updated = await prisma.owner.update({
      where: { userId },
      data: { published: !!published },
      select: { id: true, published: true },
    });
    res.json({ owner: { ...updated, id: Number(updated.id) } });
  } catch (e) {
    console.error('POST /me/owner/publish failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
