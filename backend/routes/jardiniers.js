// backend/routes/jardiniers.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

// ✅ LIST — you already have something similar; keep yours if it works.
// Here’s a compatible version that returns what you showed in curl.
router.get('/', async (req, res) => {
  try {
    const rows = await prisma.utilisateur.findMany({
      where: {
        // use a role filter if you have one (e.g., role: 'Jardinier')
        // role: 'Jardinier'
      },
      orderBy: { id_utilisateur: 'asc' },
      select: {
        id_utilisateur: true,
        prenom: true,
        nom: true,
        biographie: true,
        telephone: true,
        adresse: true,
        note_moyenne: true,
        photo_profil: true,
      },
    });

    res.json(
      rows.map((u) => ({
        id_utilisateur: String(u.id_utilisateur),
        prenom: u.prenom ?? '',
        nom: u.nom ?? '',
        biographie: u.biographie ?? '',
        telephone: u.telephone ?? '',
        adresse: u.adresse ?? '',
        note_moyenne: u.note_moyenne ?? null,
        photo_profil: u.photo_profil ?? null,
      })),
    );
  } catch (err) {
    console.error('Erreur GET /jardiniers :', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// ✅ DETAIL — new route your Next page needs
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });

  try {
    const u = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: id },
      include: {
        // competences via pivot table
        competences: {
          include: { competence: true },
        },
      },
    });
    if (!u) return res.status(404).json({ error: 'not_found' });

    // Map DB → API shape expected by your frontend page (/app/jardinier/[id]/page.js)
    const data = {
      id: String(u.id_utilisateur),
      prenom: u.prenom ?? '',
      nom: u.nom ?? '',
      avatarUrl: u.photo_profil ?? null,
      isOnline: false, // no field yet → false by default
      totalReviews: 0, // no table yet → 0 by default
      rating: u.note_moyenne ?? null,
      localisation: u.adresse ?? '—',
      competences: Array.isArray(u.competences)
        ? u.competences.map((uc) => uc.competence?.nom).filter(Boolean)
        : [],
      experienceAnnees: null,
      presentation: u.biographie ?? '—',
      comments: [], // no comment model tied to utilisateur yet
    };

    res.json(data);
  } catch (err) {
    console.error('Erreur GET /jardiniers/:id :', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
