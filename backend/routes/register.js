// backend/routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

function makeToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ userId: Number(userId) }, secret, { expiresIn: '7d' });
}

// sanity ping to prove this router is mounted
router.get('/_ping', (_req, res) => res.json({ ok: true, where: 'routes/register.js' }));

/**
 * POST /api/register
 * body: { email, password }
 */
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email_and_password_required' });
    }

    const normalized = String(email).trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email: normalized } });
    if (exists) return res.status(409).json({ error: 'email_taken' });

    const hash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.create({
      data: { email: normalized, passwordHash: hash, role: null },
      select: { id: true, email: true, role: true }
    });

    const token = makeToken(user.id);
    return res.status(201).json({
      token,
      user: { id: Number(user.id), email: user.email, role: user.role || null }
    });
  } catch (e) {
    console.error('POST /api/register failed:', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router; // <-- important
