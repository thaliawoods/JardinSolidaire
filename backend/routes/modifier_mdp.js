const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, nouveauMotDePasse } = req.body;

  if (!email || !nouveauMotDePasse) {
    return res.status(400).json({ error: "Champs manquants." });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });

    if (!utilisateur) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    if (nouveauMotDePasse === utilisateur.mot_de_passe) {
      return res.status(400).json({ error: "Le nouveau mot de passe ne peut pas être identique à l'ancien." });
    }

    await prisma.utilisateur.update({
      where: { email },
      data: { mot_de_passe: nouveauMotDePasse },
    });

    res.json({ success: true, message: "Mot de passe mis à jour." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
