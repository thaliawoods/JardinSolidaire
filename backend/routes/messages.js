// backend/routes/messages.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

/** Auth middleware: extracts user id from Bearer token */
function auth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'invalid_token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const uid = Number(payload.id_utilisateur);
    if (!uid || Number.isNaN(uid)) return res.status(401).json({ error: 'invalid_token' });

    req.userId = uid;
    next();
  } catch (_e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

router.get('/_ping', (_req, res) => res.json({ ok: true }));

/**
 * GET /api/messages/threads
 * Returns the distinct conversation peers of the current user with the last message preview.
 */
router.get('/threads', auth, async (req, res) => {
  try {
    const me = BigInt(req.userId);

    // Get last 50 messages where I am sender or recipient
    const msgs = await prisma.messagerie.findMany({
      where: { OR: [{ id_envoyeur: me }, { id_destinataire: me }] },
      orderBy: { date_envoi: 'desc' },
      take: 200,
      select: {
        id_message: true,
        id_envoyeur: true,
        id_destinataire: true,
        contenu: true,
        date_envoi: true,
        lu: true,
      },
    });

    // Build threads {peerId, lastMessage}
    const seen = new Set();
    const threads = [];
    for (const m of msgs) {
      const sender = Number(m.id_envoyeur);
      const recipient = Number(m.id_destinataire);
      const peerId = sender === req.userId ? recipient : sender;
      if (seen.has(peerId)) continue;
      seen.add(peerId);

      // fetch basic user info for the peer
      const peerUser = await prisma.utilisateur.findUnique({
        where: { id_utilisateur: BigInt(peerId) },
        select: { id_utilisateur: true, prenom: true, nom: true, photo_profil: true },
      });

      threads.push({
        peerId,
        peer: peerUser
          ? {
              id_utilisateur: Number(peerUser.id_utilisateur),
              prenom: peerUser.prenom,
              nom: peerUser.nom,
              photo_profil: peerUser.photo_profil,
            }
          : { id_utilisateur: peerId, prenom: 'Utilisateur', nom: String(peerId), photo_profil: null },
        lastMessage: {
          id_message: Number(m.id_message),
          contenu: m.contenu,
          date_envoi: m.date_envoi,
          outgoing: sender === req.userId,
          lu: m.lu,
        },
      });
    }

    res.json({ threads });
  } catch (e) {
    console.error('GET /messages/threads failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * GET /api/messages/with/:peerId
 * Returns messages between me and peer (latest 100, ascending).
 */
router.get('/with/:peerId', auth, async (req, res) => {
  try {
    const me = BigInt(req.userId);
    const peer = BigInt(Number(req.params.peerId));
    const results = await prisma.messagerie.findMany({
      where: {
        OR: [
          { id_envoyeur: me, id_destinataire: peer },
          { id_envoyeur: peer, id_destinataire: me },
        ],
      },
      orderBy: { date_envoi: 'asc' },
      take: 100,
      select: {
        id_message: true,
        id_envoyeur: true,
        id_destinataire: true,
        contenu: true,
        date_envoi: true,
        lu: true,
      },
    });

    const messages = results.map((m) => ({
      id_message: Number(m.id_message),
      contenu: m.contenu,
      date_envoi: m.date_envoi,
      outgoing: Number(m.id_envoyeur) === req.userId,
      lu: m.lu,
    }));

    res.json({ messages });
  } catch (e) {
    console.error('GET /messages/with/:peerId failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * POST /api/messages/send
 * body: { to: number, contenu: string }
 */
router.post('/send', auth, async (req, res) => {
  try {
    const { to, contenu } = req.body || {};
    const toNum = Number(to);
    if (!toNum || !contenu || typeof contenu !== 'string') {
      return res.status(400).json({ error: 'to_and_contenu_required' });
    }

    const created = await prisma.messagerie.create({
      data: {
        id_envoyeur: BigInt(req.userId),
        id_destinataire: BigInt(toNum),
        contenu,
        lu: false,
      },
      select: {
        id_message: true,
        date_envoi: true,
      },
    });

    res.status(201).json({
      sent: {
        id_message: Number(created.id_message),
        date_envoi: created.date_envoi,
      },
    });
  } catch (e) {
    console.error('POST /messages/send failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
