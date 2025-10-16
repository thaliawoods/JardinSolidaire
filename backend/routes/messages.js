const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

function auth(req, res, next) {
  try {
    const header = String(req.headers.authorization || '');
    const BEARER = 'bearer ';
    if (!header.toLowerCase().startsWith(BEARER)) {
      return res.status(401).json({ error: 'missing_authorization_header' });
    }
    const token = header.slice(BEARER.length).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'server_misconfigured', detail: 'JWT_SECRET missing' });

    const payload = jwt.verify(token, secret);
    const uid = Number(payload.userId ?? payload.id); // brief legacy allowance
    if (!Number.isFinite(uid) || uid <= 0) return res.status(401).json({ error: 'invalid_token_payload' });

    req.userId = uid;
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.get('/threads', auth, async (req, res) => {
  try {
    const me = BigInt(req.userId);

    const msgs = await prisma.message.findMany({
      where: { OR: [{ senderUserId: me }, { targetUserId: me }] },
      orderBy: { sentAt: 'desc' },
      take: 200,
      select: {
        id: true,
        senderUserId: true,
        targetUserId: true,
        content: true,
        sentAt: true,
        read: true,
      },
    });

    const seen = new Set();
    const peersInOrder = [];
    for (const m of msgs) {
      const sender = Number(m.senderUserId);
      const recipient = Number(m.targetUserId);
      const peerId = sender === req.userId ? recipient : sender;
      if (!seen.has(peerId)) {
        seen.add(peerId);
        peersInOrder.push({ peerId, lastMessage: m });
      }
    }

    const peerIds = peersInOrder.map((p) => BigInt(p.peerId));
    const peerUsers = peerIds.length
      ? await prisma.user.findMany({
          where: { id: { in: peerIds } },
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        })
      : [];

    const userById = new Map(peerUsers.map((u) => [Number(u.id), u]));

    const threads = peersInOrder.map(({ peerId, lastMessage }) => {
      const u = userById.get(peerId);
      return {
        peerId,
        peer: u
          ? {
              id: Number(u.id),
              firstName: u.firstName ?? '',
              lastName: u.lastName ?? '',
              avatarUrl: u.avatarUrl ?? null,
            }
          : { id: peerId, firstName: 'User', lastName: String(peerId), avatarUrl: null },
        lastMessage: {
          id: Number(lastMessage.id),
          content: lastMessage.content,
          sentAt: lastMessage.sentAt,
          outgoing: Number(lastMessage.senderUserId) === req.userId,
          read: !!lastMessage.read,
        },
      };
    });

    res.json({ threads });
  } catch (e) {
    console.error('GET /messages/threads failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/with/:peerId', auth, async (req, res) => {
  try {
    const me = BigInt(req.userId);
    const peer = BigInt(Number(req.params.peerId));

    const results = await prisma.message.findMany({
      where: {
        OR: [
          { senderUserId: me, targetUserId: peer },
          { senderUserId: peer, targetUserId: me },
        ],
      },
      orderBy: { sentAt: 'asc' },
      take: 100,
      select: {
        id: true,
        senderUserId: true,
        targetUserId: true,
        content: true,
        sentAt: true,
        read: true,
      },
    });

    const messages = results.map((m) => ({
      id: Number(m.id),
      content: m.content,
      sentAt: m.sentAt,
      outgoing: Number(m.senderUserId) === req.userId,
      read: !!m.read,
    }));

    res.json({ messages });
  } catch (e) {
    console.error('GET /messages/with/:peerId failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

router.post('/send', auth, async (req, res) => {
  try {
    const { to, content } = req.body || {};
    const toNum = Number(to);
    if (!Number.isFinite(toNum) || !content || typeof content !== 'string') {
      return res.status(400).json({ error: 'to_and_content_required' });
    }

    const created = await prisma.message.create({
      data: {
        senderUserId: BigInt(req.userId),
        targetUserId: BigInt(toNum),
        content,
        read: false,
      },
      select: { id: true, sentAt: true },
    });

    res.status(201).json({
      sent: { id: Number(created.id), sentAt: created.sentAt },
    });
  } catch (e) {
    console.error('POST /messages/send failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
