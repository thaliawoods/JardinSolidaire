// backend/server.js (only the routing/middleware part shown)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

// CORS + JSON first
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_ORIGIN].filter(Boolean),
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true,
  maxAge: 86400
}));
app.options('*', cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Import routers
const gardensRoutes      = require('./routes/gardens');
const gardenersRoutes    = require('./routes/gardeners');
const ownersRoutes       = require('./routes/owners');
const loginRoutes        = require('./routes/login');
const registerRoutes     = require('./routes/register');     // <— make sure this file exists HERE
const authCheckEmail     = require('./routes/auth.checkEmail');
const authResetPassword  = require('./routes/auth.resetPassword');
const navbarRoutes       = require('./routes/navbar');
const meRoutes           = require('./routes/me');
const messagesRoutes     = require('./routes/messages');
const bookingsRoutes     = require('./routes/bookings');
const contactRoutes      = require('./routes/contact');
const availabilityRoutes = require('./routes/availability');

// --- Health
app.get('/api/_dbcheck', async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ db: 'ok' }); }
  catch (e) { console.error(e); res.status(500).json({ db: 'down', message: String(e) }); }
});

// --- Mount routers
app.use('/api/gardens', gardensRoutes);
app.use('/api/gardeners', gardenersRoutes);
app.use('/api/owners', ownersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);   // <— THIS is the /api/register mount
app.use('/api/auth', authCheckEmail);
app.use('/api/auth', authResetPassword);
app.use('/api/navbar', navbarRoutes);
app.use('/api/me', meRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/availability', availabilityRoutes);

// --- Route map (diagnostic)
app.get('/api/_routes', (_req, res) => {
  function listRoutes(stack, base = '') {
    const out = [];
    stack.forEach((l) => {
      if (l.route && l.route.path) {
        const methods = Object.keys(l.route.methods).filter(Boolean).map(m=>m.toUpperCase());
        out.push({ path: base + l.route.path, methods });
      } else if (l.name === 'router' && l.handle && l.handle.stack) {
        const prefix = l.regexp?.fast_star ? '' : (l.regexp?.fast_slash ? '/' : (l.regexp?.toString() || ''));
        // crude prefix detect is tough; keep it simple:
        out.push(...listRoutes(l.handle.stack, base));
      }
    });
    return out;
  }
  res.json(listRoutes(app._router.stack));
});

// Legacy redirects (keep after mounts)
app.post('/api/verifier-email', (req, res) => res.redirect(307, '/api/auth/check-email'));
app.post('/api/modifier_mdp',  (req, res) => res.redirect(307, '/api/auth/reset-password'));
app.post('/api/mdp/verifier-email', (req, res) => res.redirect(307, '/api/auth/check-email'));

app.use('/api/jardins',       (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/jardins/, '/api/gardens')));
app.use('/api/jardiniers',    (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/jardiniers/, '/api/gardeners')));
app.use('/api/proprietaires', (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/proprietaires/, '/api/owners')));
app.use('/api/connexion',     (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/connexion/, '/api/login')));
app.use('/api/inscription',   (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/inscription/, '/api/register')));

// Root
app.get('/', (_req, res) => res.send('Prisma backend is online ✅'));

app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
