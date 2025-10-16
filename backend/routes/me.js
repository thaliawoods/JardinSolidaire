// backend/routes/me.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Auth middleware
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
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

router.get('/_ping', (_req, res) => res.json({ ok: true }));

// GET /api/me (JSON-safe selection)
router.get('/', auth, async (req, res) => {
  try {
    const idBig = BigInt(req.userId);
    const user = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: idBig },
      select: {
        id_utilisateur: true,
        prenom: true,
        nom: true,
        email: true,
        role: true,
        photo_profil: true,
        biographie: true,
        telephone: true,
        adresse: true,
        note_moyenne: true,
        jardinier: {
          select: {
            id: true, prenom: true, nom: true, avatarUrl: true, isOnline: true,
            localisation: true, competences: true, experienceAnnees: true,
            presentation: true, totalReviews: true, rating: true,
            published: true, createdAt: true, updatedAt: true,
          },
        },
        proprietaire: {
          select: {
            id_proprietaire: true, prenom: true, nom: true, avatarUrl: true, isOnline: true,
            totalReviews: true, rating: true, quartier: true, disponibilites: true,
            surface: true, type: true, presentation: true, description: true, published: true,
          },
        },
      },
    });
    if (!user) return res.status(404).json({ error: 'not_found' });
    res.json({
      user: {
        id_utilisateur: Number(user.id_utilisateur),
        prenom: user.prenom, nom: user.nom, email: user.email, role: user.role,
        photo_profil: user.photo_profil, biographie: user.biographie,
        telephone: user.telephone, adresse: user.adresse, note_moyenne: user.note_moyenne,
        jardinier: user.jardinier ? { ...user.jardinier, id: Number(user.jardinier.id) } : null,
        proprietaire: user.proprietaire
          ? { ...user.proprietaire, id_proprietaire: Number(user.proprietaire.id_proprietaire) }
          : null,
      },
    });
  } catch (e) {
    console.error('GET /api/me failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST /api/me/jardinier (upsert)
router.post('/jardinier', auth, async (req, res) => {
  try {
    const idBig = BigInt(req.userId);
    const {
      prenom, nom, avatarUrl = null, isOnline = false,
      localisation = null, competences = [], experienceAnnees = null,
      presentation = null, totalReviews = 0, rating = null,
    } = req.body || {};
    const data = {
      userId: idBig, prenom, nom, avatarUrl, isOnline: !!isOnline,
      localisation, competences: Array.isArray(competences) ? competences : [],
      experienceAnnees: experienceAnnees == null ? null : Number(experienceAnnees),
      presentation, totalReviews: Number(totalReviews || 0),
      rating: rating == null ? null : Number(rating),
    };
    const profile = await prisma.jardinier.upsert({
      where: { userId: idBig },
      update: data,
      create: { ...data, published: false },
      select: { id: true, prenom: true, nom: true, published: true },
    });
    res.json({ jardinier: { ...profile, id: Number(profile.id) } });
  } catch (e) {
    console.error('POST /api/me/jardinier failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST /api/me/jardinier/publish
router.post('/jardinier/publish', auth, async (req, res) => {
  try {
    const idBig = BigInt(req.userId);
    const { published } = req.body || {};
    const updated = await prisma.jardinier.update({
      where: { userId: idBig },
      data: { published: !!published },
      select: { id: true, published: true },
    });
    res.json({ jardinier: { ...updated, id: Number(updated.id) } });
  } catch (e) {
    console.error('POST /api/me/jardinier/publish failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST /api/me/proprietaire (upsert)
router.post('/proprietaire', auth, async (req, res) => {
  try {
    const idBig = BigInt(req.userId);
    const {
      prenom, nom, avatarUrl = null, isOnline = false, totalReviews = 0, rating = null,
      quartier = null, disponibilites = null, surface = null, type = null,
      presentation = null, description = null,
    } = req.body || {};
    const data = {
      userId: idBig, prenom, nom, avatarUrl, isOnline: !!isOnline,
      totalReviews: Number(totalReviews || 0),
      rating: rating == null ? null : Number(rating),
      quartier, disponibilites,
      surface: surface == null ? null : Number(surface),
      type, presentation, description,
    };
    const owner = await prisma.proprietaire.upsert({
      where: { userId: idBig },
      update: data,
      create: { ...data, published: false },
      select: { id_proprietaire: true, prenom: true, nom: true, published: true },
    });
    res.json({ proprietaire: { ...owner, id_proprietaire: Number(owner.id_proprietaire) } });
  } catch (e) {
    console.error('POST /api/me/proprietaire failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST /api/me/proprietaire/publish
router.post('/proprietaire/publish', auth, async (req, res) => {
  try {
    const idBig = BigInt(req.userId);
    const { published } = req.body || {};
    const updated = await prisma.proprietaire.update({
      where: { userId: idBig },
      data: { published: !!published },
      select: { id_proprietaire: true, published: true },
    });
    res.json({ proprietaire: { ...updated, id_proprietaire: Number(updated.id_proprietaire) } });
  } catch (e) {
    console.error('POST /api/me/proprietaire/publish failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
