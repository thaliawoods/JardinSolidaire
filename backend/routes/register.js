const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'user' } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'all_fields_required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) return res.status(400).json({ error: 'email_already_used' });

    const hash = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: normalizedEmail,
        passwordHash: hash,
        role,
      },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    });

    res.status(201).json({ user: { ...created, id: Number(created.id) } });
  } catch (e) {
    console.error('POST /register failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
