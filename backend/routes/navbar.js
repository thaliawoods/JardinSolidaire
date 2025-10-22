const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /api/navbar?userId=8&role=owner|gardener
 * Returns { hasListing: boolean }
 * - owner  -> has Garden linked to that user
 * - gardener -> has Gardener profile linked to that user (optionally published)
 */
router.get('/', async (req, res) => {
  try {
    const userIdNum = Number(req.query.userId);
    const roleRaw = String(req.query.role || '').trim().toLowerCase();

    if (!Number.isFinite(userIdNum) || !roleRaw) {
      return res.status(400).json({ error: 'missing_params' });
    }

    const role = roleRaw === 'owner' || roleRaw === 'proprietaire'
      ? 'owner'
      : roleRaw === 'gardener' || roleRaw === 'jardinier'
      ? 'gardener'
      : null;

    if (!role) return res.status(400).json({ error: 'invalid_role' });

    const userId = BigInt(userIdNum);
    let hasListing = false;

    if (role === 'owner') {
      const garden = await prisma.garden.findFirst({
        where: { ownerUserId: userId },
        select: { id: true },
      });
      hasListing = !!garden;
    } else {
      const profile = await prisma.gardener.findUnique({
        where: { userId },
        select: { id: true, published: true },
      });
      hasListing = !!profile; // or: !!profile && profile.published
    }

    return res.json({ hasListing });
  } catch (err) {
    console.error('GET /navbar failed:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
