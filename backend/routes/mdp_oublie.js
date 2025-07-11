const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/verifier-email', async (req, res) => {
  const { email } = req.body;

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (utilisateur) {
      return res.status(200).json({ success: true, redirect: '/modifier_mdp' });
    } else {
      return res.status(404).json({
        success: false,
        message: "Cette adresse e-mail n'est pas connue. Créez un compte 🌱",
      });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l’e-mail :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
