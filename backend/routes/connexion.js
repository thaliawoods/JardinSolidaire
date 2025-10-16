// backend/routes/connexion.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.post('/', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body || {};
    if (!email || !mot_de_passe) {
      return res.status(400).json({ error: 'email_and_password_required' });
    }

    const user = await prisma.utilisateur.findUnique({
      where: { email: String(email).trim().toLowerCase() }
    });
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const stored = user.mot_de_passe || '';
    let ok = false;

    if (stored.startsWith('$2')) {
      ok = await bcrypt.compare(mot_de_passe, stored);
    } else {
      // legacy clear-text password support + migrate to bcrypt
      ok = stored === mot_de_passe;
      if (ok) {
        const newHash = await bcrypt.hash(mot_de_passe, 10);
        await prisma.utilisateur.update({
          where: { id_utilisateur: user.id_utilisateur },
          data: { mot_de_passe: newHash },
        });
      }
    }

    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    const token = jwt.sign(
      { id_utilisateur: user.id_utilisateur },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id_utilisateur: Number(user.id_utilisateur),
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role || 'user',
      },
    });
  } catch (e) {
    console.error('POST /connexion failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
