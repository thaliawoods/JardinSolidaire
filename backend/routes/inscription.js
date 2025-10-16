// backend/routes/inscription.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

router.post('/', async (req, res) => {
  try {
    let { prenom = null, nom = null, email, mot_de_passe, role = 'user' } = req.body || {};
    if (!email || !mot_de_passe) {
      return res.status(400).json({ error: 'email_and_password_required' });
    }

    email = String(email).trim().toLowerCase();

    const exists = await prisma.utilisateur.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'email_already_used' });

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const user = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email,
        mot_de_passe: hash,
        role,
        photo_profil: null,
        biographie: null,
        telephone: null,
        adresse: null,
        note_moyenne: null,
      },
      select: { id_utilisateur: true, prenom: true, nom: true, email: true, role: true },
    });

    // 👇 Cast BigInt to Number for JWT
    const uid = Number(user.id_utilisateur);

    const token = jwt.sign(
      { id_utilisateur: uid },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { ...user, id_utilisateur: uid }, // 👈 cast in response too
    });
  } catch (e) {
    if (e?.code === 'P2002' && e?.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'email_already_used' });
    }
    console.error('POST /inscription failed:', e?.stack || e);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
