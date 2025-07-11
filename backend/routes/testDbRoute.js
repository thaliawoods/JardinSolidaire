const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/test-db', async (req, res) => {
  try {
    const user = await prisma.utilisateur.findFirst(); // Exemple : récupère un utilisateur
    res.json({ success: true, message: 'Connexion DB OK ✅', user });
  } catch (error) {
    console.error('❌ Erreur DB :', error);
    res.status(500).json({ success: false, message: 'Erreur de connexion à la base', error: error.message });
  }
});

module.exports = router;
