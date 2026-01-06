const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { hashToken } = require('../lib/tokens');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, token } = req.body || {};
    if (!email || !token) return res.status(400).json({ error: 'email_and_token_required' });

    const normalized = String(email).trim().toLowerCase();
    const tokenHash = hashToken(token);

    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    if (user.emailVerifiedAt) return res.json({ ok: true, message: 'already_verified' });

    if (!user.emailVerifyTokenHash || !user.emailVerifyExpiresAt) {
      return res.status(400).json({ error: 'no_verification_in_progress' });
    }

    if (user.emailVerifyTokenHash !== tokenHash) {
      return res.status(401).json({ error: 'invalid_token' });
    }

    if (new Date(user.emailVerifyExpiresAt).getTime() < Date.now()) {
      return res.status(401).json({ error: 'token_expired' });
    }

    await prisma.user.update({
      where: { email: normalized },
      data: {
        emailVerifiedAt: new Date(),
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
      },
    });

    return res.json({ ok: true, message: 'email_verified' });
  } catch (e) {
    console.error('POST /api/verify-email failed:', e?.stack || e);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
