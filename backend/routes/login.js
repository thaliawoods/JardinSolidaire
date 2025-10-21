const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/_ping", (_req, res) => res.json({ ok: true, where: "routes/login.js" }));

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email_and_password_required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const stored = user.passwordHash || "";
    let ok = false;

    if (stored.startsWith("$2")) {
      ok = await bcrypt.compare(password, stored);
    } else {
      ok = stored === password;
      if (ok) {
        const newHash = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        });
      }
    }

    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "server_misconfigured", detail: "JWT_SECRET is not set" });
    }

    const token = jwt.sign({ userId: Number(user.id) }, secret, { expiresIn: "7d" });
    return res.json({
      token,
      user: {
        id: Number(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || null,
      },
    });
  } catch (e) {
    console.error("POST /login failed:", e?.stack || e);
    res.status(500).json({ error: "server_error" });
  }
});

module.exports = router;
