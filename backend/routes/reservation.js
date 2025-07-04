const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/reservations - lister toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        utilisateur: true,
        jardin: true,
      },
    });
    res.json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/reservations - créer une réservation
router.post('/', async (req, res) => {
  const { id_utilisateur, id_jardin, date_reservation, statut, commentaires } = req.body;

  // Validation basique
  if (!id_utilisateur || !id_jardin || !date_reservation) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    const nouvelleReservation = await prisma.reservation.create({
      data: {
        id_utilisateur: BigInt(id_utilisateur),
        id_jardin: BigInt(id_jardin),
        date_reservation: new Date(date_reservation),
        statut: statut || 'en_attente',
        commentaires: commentaires || '',
      },
    });

    res.status(201).json(nouvelleReservation);
  } catch (error) {
    console.error('Erreur création réservation :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réservation' });
  }
});

module.exports = router;
