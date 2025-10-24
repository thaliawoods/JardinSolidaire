// backend/routes/messages.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

/* Auth */
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

/* Shape helpers */
function shapeMsg(m) {
  return {
    id: Number(m.id),
    from: m.senderUser
      ? {
          id: Number(m.senderUser.id),
          firstName: m.senderUser.firstName ?? '',
          lastName: m.senderUser.lastName ?? '',
          email: m.senderUser.email ?? null,
          avatarUrl: m.senderUser.avatarUrl ?? null,
        }
      : null,
    to: m.targetUser
      ? {
          id: Number(m.targetUser.id),
          firstName: m.targetUser.firstName ?? '',
          lastName: m.targetUser.lastName ?? '',
          email: m.targetUser.email ?? null,
          avatarUrl: m.targetUser.avatarUrl ?? null,
        }
      : null,
    content: m.content ?? '',
    read: !!m.read,
    sentAt: m.sentAt,
  };
}

/* ---------------------------------------------------
   POST /api/messages
   Body: { toUserId: number, content: string }
---------------------------------------------------- */
router.post('/', requireAuth, async (req, res) => {
  try {
    const toUserId = Number(req.body?.toUserId);
    const content = String(req.body?.content || '').trim();
    if (!toUserId || !content) {
      return res.status(400).json({ error: 'invalid_payload' });
    }
    if (toUserId === req.user.id) {
      return res.status(400).json({ error: 'cannot_message_self' });
    }

    // ensure recipient exists
    const target = await prisma.user.findUnique({
      where: { id: BigInt(toUserId) },
      select: { id: true },
    });
    if (!target) return res.status(404).json({ error: 'recipient_not_found' });

    const created = await prisma.message.create({
      data: {
        senderUserId: BigInt(req.user.id),
        targetUserId: BigInt(toUserId),
        content: content.slice(0, 2000),
        read: false,
      },
      include: {
        senderUser: true,
        targetUser: true,
      },
    });

    res.status(201).json(shapeMsg(created));
  } catch (e) {
    console.error('POST /messages failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------------------------------------------------
   GET /api/messages?unread=1
   Returns unread received messages (inbox)
---------------------------------------------------- */
router.get('/', requireAuth, async (req, res) => {
  try {
    const unreadOnly = String(req.query.unread || '') === '1';
    const where = { targetUserId: BigInt(req.user.id) };
    if (unreadOnly) where.read = false;

    const rows = await prisma.message.findMany({
      where,
      orderBy: { sentAt: 'desc' },
      include: { senderUser: true, targetUser: true },
      take: 100,
    });
    res.json({ messages: rows.map(shapeMsg) });
  } catch (e) {
    console.error('GET /messages failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------------------------------------------------
   GET /api/messages/conversations
   Distinct people you’ve exchanged messages with + last message
---------------------------------------------------- */
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const me = BigInt(req.user.id);
    // pull latest 200 messages involving me, group client-side
    const rows = await prisma.message.findMany({
      where: {
        OR: [{ senderUserId: me }, { targetUserId: me }],
      },
      orderBy: { sentAt: 'desc' },
      include: { senderUser: true, targetUser: true },
      take: 200,
    });

    const map = new Map(); // key: otherUserId -> convo
    for (const m of rows) {
      const other =
        String(m.senderUserId) === String(me) ? m.targetUser : m.senderUser;
      if (!other) continue;
      const otherId = Number(other.id);
      if (!map.has(otherId)) {
        map.set(otherId, {
          user: {
            id: otherId,
            firstName: other.firstName ?? '',
            lastName: other.lastName ?? '',
            email: other.email ?? null,
            avatarUrl: other.avatarUrl ?? null,
          },
          lastMessage: shapeMsg(m),
          unread: 0,
        });
      }
      // count unread incoming
      if (String(m.targetUserId) === String(me) && !m.read) {
        map.get(otherId).unread += 1;
      }
    }

    res.json({ conversations: Array.from(map.values()) });
  } catch (e) {
    console.error('GET /messages/conversations failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------------------------------------------------
   GET /api/messages/with/:userId  (thread)
---------------------------------------------------- */
router.get('/with/:userId', requireAuth, async (req, res) => {
  try {
    const me = BigInt(req.user.id);
    const other = BigInt(req.params.userId);

    const rows = await prisma.message.findMany({
      where: {
        OR: [
          { senderUserId: me, targetUserId: other },
          { senderUserId: other, targetUserId: me },
        ],
      },
      orderBy: { sentAt: 'asc' },
      include: { senderUser: true, targetUser: true },
      take: 500,
    });

    res.json({ messages: rows.map(shapeMsg) });
  } catch (e) {
    console.error('GET /messages/with failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------------------------------------------------
   POST /api/messages/mark-read
   Body: { all?: boolean, ids?: number[] }
---------------------------------------------------- */
router.post('/mark-read', requireAuth, async (req, res) => {
  try {
    const me = BigInt(req.user.id);
    const { all = false, ids = [] } = req.body || {};

    if (all) {
      await prisma.message.updateMany({
        where: { targetUserId: me, read: false },
        data: { read: true },
      });
      return res.json({ ok: true });
    }

    const validIds = (Array.isArray(ids) ? ids : [])
      .map((x) => Number(x))
      .filter((x) => Number.isFinite(x) && x > 0);

    if (!validIds.length) return res.json({ ok: true });

    await prisma.message.updateMany({
      where: { id: { in: validIds.map((n) => BigInt(n)) }, targetUserId: me },
      data: { read: true },
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /messages/mark-read failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
