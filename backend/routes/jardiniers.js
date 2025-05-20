const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();


router.get('/', async (req, res) => {
    const { note, type, search } = req.query;
    
    const where = {
        role: 'ami_du_vert',
        ...(search && {
            OR: [
                { prenom:     { contains: search, mode: 'insensitive' } },
                { nom:        { contains: search, mode: 'insensitive' } },
                { biographie: { contains: search, mode: 'insensitive' } },
            ],
        }),
        ...(note && { note_moyenne: { gte: parseFloat(note) } }),
        ...(type && {
            biographie: { contains: type, mode: 'insensitive' },
        }),
    };
    
    try {
        const jardiniers = await prisma.utilisateur.findMany({
            where,
            select: {
                id_utilisateur: true,
                prenom:         true,
                nom:            true,
                biographie:     true,
                telephone:      true,
                adresse:        true,
                note_moyenne:   true,
                photo_profil:   true,
            },
        });

        // Convertir les BigInt en String
    const formatés = jardiniers.map(j => ({
      ...j,
      id_utilisateur: j.id_utilisateur.toString(),
    }));

    res.json(formatés);
  } catch (error) {
    console.error('Erreur chargement jardiniers :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;