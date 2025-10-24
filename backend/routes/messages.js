// backend/routes/messages.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

/* ---------- auth ---------- */
function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.toLowerCase().startsWith('bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const id = Number(payload.userId || payload.id || payload.sub);
    if (!id) return res.status(401).json({ error: 'unauthorized' });
    req.user = { id };
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

/* ---------- GET /api/messages?unread=1 ---------- */
router.get('/', requireAuth, async (req, res) => {
  try {
    const unreadOnly = String(req.query.unread || '') === '1';

    const where = { targetUserId: BigInt(req.user.id) };
    if (unreadOnly) where.read = false;

    const list = await prisma.message.findMany({
      where,
      orderBy: { sentAt: 'desc' },
      include: {
        senderUser: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      },
    });

    const out = list.map((m) => ({
      id: Number(m.id),
      from: m.senderUser
        ? {
            id: Number(m.senderUser.id),
            firstName: m.senderUser.firstName || null,
            lastName: m.senderUser.lastName || null,
            email: m.senderUser.email || null,
            avatarUrl: m.senderUser.avatarUrl || null,
          }
        : null,
      content: m.content || '',
      read: !!m.read,
      sentAt: m.sentAt || null,
    }));

    res.json({ messages: out });
  } catch (e) {
    console.error('GET /api/messages failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------- POST /api/messages/mark-read ---------- */
/* Body: { ids?: number[], all?: boolean } */
router.post('/mark-read', requireAuth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((x) => Number(x)).filter(Number.isFinite) : [];
    const all = !!req.body?.all;

    if (!all && ids.length === 0) {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    if (all) {
      await prisma.message.updateMany({
        where: { targetUserId: BigInt(req.user.id), read: false },
        data: { read: true },
      });
    } else {
      await prisma.message.updateMany({
        where: { id: { in: ids.map((x) => BigInt(x)) }, targetUserId: BigInt(req.user.id) },
        data: { read: true },
      });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error('POST /api/messages/mark-read failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
