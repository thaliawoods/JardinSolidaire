const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const { sendMail } = require('../lib/email');
const { randomToken, hashToken, addMinutes } = require('../lib/tokens');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true, where: 'routes/register.js' }));

/* ---------- password rules ---------- */
/**
 * Règles simples (à adapter si tu veux) :
 * - min 8 caractères
 * - au moins 1 minuscule, 1 majuscule, 1 chiffre
 * - pas d'espaces
 */
function isStrongPassword(pw) {
  const s = String(pw || '');
  if (s.length < 8) return false;
  if (/\s/.test(s)) return false;
  if (!/[a-z]/.test(s)) return false;
  if (!/[A-Z]/.test(s)) return false;
  if (!/[0-9]/.test(s)) return false;
  return true;
}

/**
 * POST /api/register
 * body: { email, password }
 *
 * ✅ crée un compte NON vérifié + envoie un email de vérification
 * ❌ ne renvoie PAS de JWT tant que l’email n’est pas confirmé
 */
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email_and_password_required' });
    }

    const normalized = String(email).trim().toLowerCase();

    // ✅ validation mot de passe côté serveur
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

    const exists = await prisma.user.findUnique({ where: { email: normalized } });
    if (exists) return res.status(409).json({ error: 'email_taken' });

    const hash = await bcrypt.hash(String(password), 10);

    // ✅ token de vérification (on stocke un hash)
    const rawVerifyToken = randomToken();
    const verifyTokenHash = hashToken(rawVerifyToken);
    const expiresAt = addMinutes(new Date(), 60); // 1h

    const user = await prisma.user.create({
      data: {
        email: normalized,
        passwordHash: hash,
        role: null,
        emailVerifiedAt: null,
        emailVerifyTokenHash: verifyTokenHash,
        emailVerifyExpiresAt: expiresAt,
      },
      select: { id: true, email: true },
    });

    const APP_URL = process.env.APP_URL || 'http://localhost:3000';
    const verifyLink =
      `${APP_URL}/verify-email?email=${encodeURIComponent(normalized)}&token=${rawVerifyToken}`;

    await sendMail({
      to: normalized,
      subject: 'Confirme ton email — JardinSolidaire',
      text:
        `Bienvenue sur JardinSolidaire 🌿\n\n` +
        `Pour activer ton compte, confirme ton email :\n${verifyLink}\n\n` +
        `Ce lien expire dans 1 heure.`,
      html: `
        <p>Bienvenue sur <b>JardinSolidaire</b> 🌿</p>
        <p>Pour activer ton compte, confirme ton email :</p>
        <p><a href="${verifyLink}">Confirmer mon email</a></p>
        <p><small>Ce lien expire dans 1 heure.</small></p>
      `,
    });

    return res.status(201).json({
      ok: true,
      message: 'verification_email_sent',
      user: { id: user.id.toString(), email: user.email },
    });
  } catch (e) {
    console.error('POST /api/register failed:', e?.stack || e);

    if (String(e.message || '').includes('SMTP')) {
      return res.status(500).json({ error: 'server_misconfigured', detail: 'SMTP not configured' });
    }

    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
