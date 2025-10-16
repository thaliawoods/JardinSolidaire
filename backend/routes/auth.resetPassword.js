const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/reset-password', async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    const newPassword = req.body?.newPassword;

    if (!rawEmail || !newPassword) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const email = String(rawEmail).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    const stored = user.passwordHash || '';
    let sameAsOld = false;
    if (stored.startsWith('$2')) {
      sameAsOld = await bcrypt.compare(newPassword, stored);
    } else if (stored) {
      sameAsOld = stored === newPassword;
    }
    if (sameAsOld) {
      return res.status(400).json({ error: 'password_must_be_different' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hash },
      select: { id: true },
    });

    return res.json({ success: true, message: 'Password updated.' });
  } catch (error) {
    console.error('POST /auth/reset-password failed:', error);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
