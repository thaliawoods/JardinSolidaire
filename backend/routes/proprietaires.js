// backend/routes/proprietaires.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

// LIST: supports ?type=&quartier=&skip=&take=, returns commentsCount too
router.get('/', async (req, res) => {
  try {
    const { type, quartier, skip = 0, take = 10 } = req.query;

    const rows = await prisma.proprietaire.findMany({
      where: {
        type: type || undefined,
        quartier: quartier ? { contains: quartier, mode: 'insensitive' } : undefined,
      },
      skip: Number.parseInt(skip, 10),
      take: Number.parseInt(take, 10),
      orderBy: { id_proprietaire: 'asc' },
      select: {
        id_proprietaire: true,
        prenom: true,
        nom: true,
        avatarUrl: true,
        isOnline: true,
        totalReviews: true,
        rating: true,
        quartier: true,
        disponibilites: true,
        surface: true,
        type: true,
        presentation: true,
        description: true,
        _count: { select: { comments: true } }, // Count CommentProprietaire
      },
    });

    res.json(
      rows.map((p) => ({
        id_proprietaire: String(p.id_proprietaire),
        prenom: p.prenom ?? null,
        nom: p.nom ?? null,
        avatarUrl: p.avatarUrl ?? null,
        isOnline: !!p.isOnline,
        totalReviews: p.totalReviews ?? 0,
        rating: p.rating ?? 4.8,
        quartier: p.quartier ?? '—',
        disponibilites: p.disponibilites ?? '—',
        surface: p.surface ?? null,
        type: p.type ?? '—',
        presentation: p.presentation ?? p.description ?? '—',
        commentsCount: p._count?.comments ?? 0,
      })),
    );
  } catch (err) {
    console.error('Erreur GET /proprietaires :', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

// DETAIL: include comments (CommentProprietaire)
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });

  try {
    const p = await prisma.proprietaire.findUnique({
      where: { id_proprietaire: id },
      include: { comments: { orderBy: { createdAt: 'desc' } } }, // CommentProprietaire[]
    });
    if (!p) return res.status(404).json({ error: 'not_found' });

    res.json({
      id_proprietaire: String(p.id_proprietaire),
      prenom: p.prenom ?? null,
      nom: p.nom ?? null,
      avatarUrl: p.avatarUrl ?? null,
      isOnline: !!p.isOnline,
      totalReviews: p.totalReviews ?? 0,
      rating: p.rating ?? 4.8,
      quartier: p.quartier ?? '—',
      disponibilites: p.disponibilites ?? '—',
      surface: p.surface ?? null,
      type: p.type ?? '—',
      presentation: p.presentation ?? p.description ?? '—',
      comments: (p.comments || []).map((c) => ({
        id: c.id,
        text: c.text,
        author: c.authorName ?? null,     // 🔸 note the field rename
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error('Erreur GET /proprietaires/:id :', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

// CREATE owner
router.post('/', async (req, res) => {
  try {
    const {
      prenom = null,
      nom = null,
      avatarUrl = null,
      isOnline = false,
      totalReviews = 0,
      rating = 4.8,
      quartier = null,
      disponibilites = null,
      surface = null,
      type = null,
      presentation = null,
      description = null,
    } = req.body || {};

    const created = await prisma.proprietaire.create({
      data: {
        prenom,
        nom,
        avatarUrl,
        isOnline: Boolean(isOnline),
        totalReviews: Number(totalReviews),
        rating: Number(rating),
        quartier,
        disponibilites,
        surface: surface == null ? null : Number(surface),
        type,
        presentation,
        description,
      },
      select: { id_proprietaire: true },
    });

    res.status(201).json({ id: String(created.id_proprietaire) });
  } catch (err) {
    console.error('POST /proprietaires failed:', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

// (Optional) CREATE a comment for a proprietaire
router.post('/:id/comments', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });

  try {
    const { text, authorName = null } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text_required' });
    }

    const exists = await prisma.proprietaire.findUnique({
      where: { id_proprietaire: id },
      select: { id_proprietaire: true },
    });
    if (!exists) return res.status(404).json({ error: 'not_found' });

    const c = await prisma.commentProprietaire.create({
      data: { text, authorName, proprietaireId: id },
    });

    res.status(201).json({
      id: c.id,
      text: c.text,
      author: c.authorName ?? null,
      createdAt: c.createdAt,
    });
  } catch (err) {
    console.error('POST /proprietaires/:id/comments failed:', err.stack || err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
