const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Récupérer tous les jardins
router.get('/', async (req, res) => {
  try {
    const { type, quartier, skip = 0, take = 10 } = req.query;

    const jardins = await prisma.jardin.findMany({
      where: {
        type: type || undefined,
        adresse: quartier ? { contains: quartier } : undefined
      },
      skip: parseInt(skip),
      take: parseInt(take)
    });

    const formatés = jardins.map((j) => ({
      ...j,
      id_jardin: j.id_jardin.toString(),
      id_proprietaire: j.id_proprietaire.toString(),
    }));

    res.json(formatés);
  } catch (error) {
    console.error('Erreur filtrée :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// GET un jardin par ID
router.get('/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  try {
    const jardin = await prisma.jardin.findUnique({
      where: { id_jardin: id }
    });

    if (!jardin) return res.status(404).json({ error: 'Jardin non trouvé' });

    // Conversion BigInt → String
    jardin.id_jardin = jardin.id_jardin.toString();
    jardin.id_proprietaire = jardin.id_proprietaire.toString();

    res.json(jardin);
  } catch (error) {
    console.error('Erreur get by ID :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST un nouveau jardin
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    const nouveau = await prisma.jardin.create({
      data: {
        id_proprietaire: BigInt(data.id_proprietaire),
        titre: data.titre,
        description: data.description,
        adresse: data.adresse,
        superficie: parseFloat(data.superficie),
        type: data.type,
        besoins: data.besoins,
        photos: data.photos, // JSON (array of URLs)
        date_publication: new Date(),
        statut: 'disponible',
        note_moyenne: 0,
      }
    });

    res.status(201).json({ message: 'Jardin ajouté', id: nouveau.id_jardin.toString() });
  } catch (error) {
    console.error('Erreur création jardin :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
