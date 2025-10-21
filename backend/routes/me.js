const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

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
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

/* ---------- GET /api/me ---------- */
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
            id: true, firstName: true, lastName: true, avatarUrl: true, isOnline: true,
            location: true, skills: true, yearsExperience: true, intro: true,
            totalReviews: true, rating: true, published: true, createdAt: true, updatedAt: true,
          },
        },
        owner: {
          select: {
            id: true, firstName: true, lastName: true, avatarUrl: true, isOnline: true,
            totalReviews: true, rating: true, district: true, availability: true,
            area: true, kind: true, intro: true, description: true, published: true,
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
        role: user.role, // <= important for the frontend
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        phone: user.phone,
        address: user.address,
        averageRating: user.averageRating,
        jardinier: user.gardener ? { ...user.gardener, id: Number(user.gardener.id) } : null,
        proprietaire: user.owner ? { ...user.owner, id: Number(user.owner.id) } : null,
      },
    });
  } catch (e) {
    console.error('GET /me failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------- PUT /api/me/role  (OWNER | GARDENER) ---------- */
router.put('/role', auth, async (req, res) => {
  try {
    const raw = String(req.body?.role || '').trim().toUpperCase();
    if (!['OWNER', 'GARDENER'].includes(raw)) {
      return res.status(400).json({ error: 'bad_role', allowed: ['OWNER', 'GARDENER'] });
    }

    const updated = await prisma.user.update({
      where: { id: BigInt(req.userId) },
      data: { role: raw },
      select: { id: true, role: true }
    });

    // optional convenience: ensure skeleton profile exists
    if (raw === 'OWNER') {
      const existing = await prisma.owner.findUnique({ where: { userId: BigInt(req.userId) } });
      if (!existing) {
        await prisma.owner.create({
          data: {
            userId: BigInt(req.userId),
            firstName: '',
            lastName: '',
            published: false
          }
        });
      }
    } else if (raw === 'GARDENER') {
      const existing = await prisma.gardener.findUnique({ where: { userId: BigInt(req.userId) } });
      if (!existing) {
        await prisma.gardener.create({
          data: {
            userId: BigInt(req.userId),
            firstName: '',
            lastName: '',
            isOnline: false,
            totalReviews: 0,
            published: false
          }
        });
      }
    }

    res.json({ id: Number(updated.id), role: updated.role });
  } catch (e) {
    console.error('PUT /me/role failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------- Update basic profile (kept from your version) ---------- */
router.post('/profile', auth, async (req, res) => {
  try {
    const userId = BigInt(req.userId);
    const {
      firstName = '',
      lastName = '',
      phone = '',
      address = '',
      bio = '',
      avatarUrl = '',
    } = req.body || {};

    if (!String(firstName).trim() || !String(lastName).trim()) {
      return res.status(400).json({ error: 'validation_error', fields: ['firstName','lastName'] });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: String(firstName).trim(),
        lastName:  String(lastName).trim(),
        phone:     String(phone).trim() || null,
        address:   String(address).trim() || null,
        bio:       String(bio).trim() || null,
        avatarUrl: String(avatarUrl).trim() || null,
      },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, address: true, bio: true, avatarUrl: true,
      },
    });

    res.json({ user: { ...updated, id: Number(updated.id) } });
  } catch (e) {
    console.error('POST /me/profile failed:', isDev ? e?.stack || e : e?.message);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------- Keep your /me/gardener & /me/owner endpoints as is ---------- */
// … you can keep your existing POST /me/gardener, /me/gardener/publish, /me/owner, /me/owner/publish here
module.exports = router;
