const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /api/contact
 * { name, email, subject, message }
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (
      !name || typeof name !== 'string' ||
      !email || typeof email !== 'string' ||
      !subject || typeof subject !== 'string' ||
      !message || typeof message !== 'string'
    ) {
      return res.status(400).json({ error: 'validation_error' });
    }

    // Try to store in DB if a suitable model exists; otherwise just log.
    let stored = null;
    try {
      // Try ContactMessage model first
      if (prisma.contactMessage?.create) {
        stored = await prisma.contactMessage.create({
          data: { name, email, subject, message },
        });
      } else if (prisma.message?.create) {
        // Or a generic Message table
        stored = await prisma.message.create({
          data: {
            subject,
            body: message,
            fromEmail: email,
            fromName: name,
          },
        });
      }
    } catch (e) {
      // No matching table -> just log; still return 201
      console.warn('Contact saved to console only:', { name, email, subject, message });
    }

    return res.status(201).json({
      ok: true,
      id: stored?.id ?? null,
    });
  } catch (e) {
    console.error('POST /contact failed:', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
