const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const { sendMail } = require('../lib/email');
const { randomToken, hashToken, addMinutes } = require('../lib/tokens');

const prisma = new PrismaClient();
const router = express.Router();

/* -------------------- ping -------------------- */
router.get('/_ping', (_req, res) =>
  res.json({ ok: true, route: 'register' })
);

/* ---------------- password rules -------------- */
function isStrongPassword(pw) {
  const s = String(pw || '');
  if (s.length < 8) return false;
  if (/\s/.test(s)) return false;
  if (!/[a-z]/.test(s)) return false;
  if (!/[A-Z]/.test(s)) return false;
  if (!/[0-9]/.test(s)) return false;
  return true;
}

/* ---------------- POST /api/register ----------- */
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: 'email_and_password_required',
      });
    }

    const normalized = String(email).trim().toLowerCase();

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'password_too_weak',
        rules: {
          minLength: 8,
          requireLower: true,
          requireUpper: true,
          requireNumber: true,
          noSpaces: true,
        },
      });
    }

    const exists = await prisma.user.findUnique({
      where: { email: normalized },
    });
    if (exists) {
      return res.status(409).json({ error: 'email_taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rawToken = randomToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = addMinutes(new Date(), 60);

    const skipEmail = !process.env.BREVO_API_KEY;

    const user = await prisma.user.create({
      data: {
        email: normalized,
        passwordHash,
        role: null,
        emailVerifiedAt: skipEmail ? new Date() : null,
        emailVerifyTokenHash: skipEmail ? null : tokenHash,
        emailVerifyExpiresAt: skipEmail ? null : expiresAt,
      },
      select: { id: true, email: true },
    });

    const APP_URL =
      process.env.APP_URL || 'http://localhost:3000';

    const verifyLink =
      `${APP_URL}/verify-email?email=${encodeURIComponent(normalized)}&token=${rawToken}`;

    // 👉 ENVOI EMAIL BREVO (optionnel en dev si BREVO_API_KEY absent)
    if (process.env.BREVO_API_KEY) {
      await sendMail({
        to: normalized,
        subject: 'Confirme ton email — JardinSolidaire',
        text:
          `Bienvenue sur JardinSolidaire 🌿\n\n` +
          `Confirme ton email :\n${verifyLink}\n\n` +
          `Lien valable 1 heure.`,
        html: `
          <p>Bienvenue sur <b>JardinSolidaire</b> 🌿</p>
          <p>Pour activer ton compte :</p>
          <p><a href="${verifyLink}">Confirmer mon email</a></p>
          <p><small>Lien valable 1 heure.</small></p>
        `,
      });
    } else {
      console.warn('⚠️  BREVO_API_KEY not set — skipping verification email. Verify link:', verifyLink);
    }

    return res.status(201).json({
      ok: true,
      message: 'verification_email_sent',
      user: {
        id: user.id.toString(),
        email: user.email,
      },
    });
  } catch (err) {
    console.error('❌ REGISTER ERROR:', err);

    return res.status(500).json({
      error: 'server_error',
      message: err.message || String(err),
    });
  }
});

module.exports = router;
