const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route : GET /api/navbar?userId=xxx&role=xxx
router.get('/', (req, res) => {
  const { userId, role } = req.query;

  if (!userId || !role) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  let query = '';
  if (role === 'proprietaire') {
    query = 'SELECT id_jardin FROM jardin WHERE id_proprietaire = ? LIMIT 1';
  } else if (role === 'ami_du_vert') {
    query = 'SELECT id_utilisateur FROM utilisateurCompetence WHERE id_utilisateur = ? LIMIT 1';
  } else {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const hasAnnonce = results.length > 0;
    res.json({ hasAnnonce });
  });
});

module.exports = router;
