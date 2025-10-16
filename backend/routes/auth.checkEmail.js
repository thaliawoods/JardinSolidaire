const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * POST /auth/check-email
 * Body: { email: string }
 * Returns 200 with { exists: true, redirect: '/reset-password' } if found,
 * 404 with { exists: false, message } if not.
 */
router.post('/check-email', async (req, res) => {
  try {
    const raw = req.body?.email;
    if (!raw || typeof raw !== 'string') {
      return res.status(400).json({ error: 'email_required' });
    }
    const email = raw.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(200).json({ exists: true, redirect: '/reset-password' });
    } else {
      return res.status(404).json({
        exists: false,
        message: 'This email was not found. Create an account 🌱',
      });
    }
  } catch (error) {
    console.error('POST /auth/check-email failed:', error);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
