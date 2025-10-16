// backend/routes/inscription.js
const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.post('/', async (req, res) => {
  try {
    const { prenom, nom, email, mot_de_passe, role = 'user' } = req.body || {};
    if (!prenom || !nom || !email || !mot_de_passe) {
      return res.status(400).json({ error: 'all_fields_required' });
    }

    const exists = await prisma.utilisateur.findUnique({
      where: { email: String(email).trim().toLowerCase() }
    });
    if (exists) return res.status(400).json({ error: 'email_already_used' });

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const created = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email: String(email).trim().toLowerCase(),
        mot_de_passe: hash,
        role,
      },
      select: {
        id_utilisateur: true, prenom: true, nom: true, email: true, role: true
      }
    });

    res.status(201).json({ user: { ...created, id_utilisateur: Number(created.id_utilisateur) } });
  } catch (e) {
    console.error('POST /inscription failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
