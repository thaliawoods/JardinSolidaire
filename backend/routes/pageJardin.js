const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route existante pour findMany…
router.get('/', async (req, res) => {
  // … ton code pour lister …
});

// Nouvelle route pour un seul jardin :
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const jardin = await prisma.jardin.findUnique({
      where: { id_jardin: id },
      include: {
        utilisateur: true,     // si tu veux les infos du proprio
        disponibilites: true,  // etc.
        avis: true,
      }
    });
    if (!jardin) {
      return res.status(404).json({ error: 'Jardin non trouvé' });
    }
    res.json(jardin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

module.exports = router;
