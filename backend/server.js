// backend/server.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

/* ------------------------- Core middleware ------------------------- */
app.disable('x-powered-by');

app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_ORIGIN].filter(Boolean),
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true,
  maxAge: 86400
}));
app.options('*', cors());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ------------------------- Static uploads -------------------------- */
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', etag: true }));

/* ----------------------------- Routers ----------------------------- */
const gardensRoutes      = require('./routes/gardens');
const gardenersRoutes    = require('./routes/gardeners');
const ownersRoutes       = require('./routes/owners');
const loginRoutes        = require('./routes/login');
const registerRoutes     = require('./routes/register');
const authCheckEmail     = require('./routes/auth.checkEmail');
const authResetPassword  = require('./routes/auth.resetPassword');
const navbarRoutes       = require('./routes/navbar');
const meRoutes           = require('./routes/me');
const messagesRoutes     = require('./routes/messages');
const bookingsRoutes     = require('./routes/bookings');
const contactRoutes      = require('./routes/contact');
const availabilityRoutes = require('./routes/availability');
const uploadsRoutes      = require('./routes/uploads'); // <= NEW (multer route)

/* ---------------------------- Healthcheck -------------------------- */
app.get('/api/_dbcheck', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: 'ok' });
  } catch (e) {
    console.error('DB check failed:', e);
    res.status(500).json({ db: 'down', message: String(e) });
  }
});

/* ----------------------------- Mount API --------------------------- */
app.use('/api/gardens',      gardensRoutes);
app.use('/api/gardeners',    gardenersRoutes);
app.use('/api/owners',       ownersRoutes);
app.use('/api/login',        loginRoutes);
app.use('/api/register',     registerRoutes);
app.use('/api/auth',         authCheckEmail);
app.use('/api/auth',         authResetPassword);
app.use('/api/navbar',       navbarRoutes);
app.use('/api/me',           meRoutes);
app.use('/api/messages',     messagesRoutes);
app.use('/api/bookings',     bookingsRoutes);
app.use('/api/contact',      contactRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/uploads',      uploadsRoutes); // <= NEW

/* --------------------------- Route Inspector ------------------------ */
app.get('/api/_routes', (_req, res) => {
  function listRoutes(stack, base = '') {
    const out = [];
    for (const layer of stack) {
      if (layer.route?.path) {
        const methods = Object.keys(layer.route.methods || {})
          .filter(Boolean)
          .map(m => m.toUpperCase());
        out.push({ path: base + layer.route.path, methods });
      } else if (layer.name === 'router' && layer.handle?.stack) {
        // recurse
        out.push(...listRoutes(layer.handle.stack, base));
      }
    }
    return out;
  }
  res.json(listRoutes(app._router.stack));
});

/* ------------------------- Legacy redirects ------------------------ */
app.post('/api/verifier-email',      (req, res) => res.redirect(307, '/api/auth/check-email'));
app.post('/api/modifier_mdp',        (req, res) => res.redirect(307, '/api/auth/reset-password'));
app.post('/api/mdp/verifier-email',  (req, res) => res.redirect(307, '/api/auth/check-email'));

app.use('/api/jardins',       (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/jardins/, '/api/gardens')));
app.use('/api/jardiniers',    (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/jardiniers/, '/api/gardeners')));
app.use('/api/proprietaires', (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/proprietaires/, '/api/owners')));
app.use('/api/connexion',     (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/connexion/, '/api/login')));
app.use('/api/inscription',   (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/inscription/, '/api/register')));

/* ----------------------------- Root ping --------------------------- */
app.get('/', (_req, res) => res.send('Prisma backend is online ✅'));

/* --------------------------- Error handling ------------------------ */
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', path: req.originalUrl });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  const code = err.status || 500;
  res.status(code).json({ error: 'SERVER_ERROR', message: String(err?.message || err) });
});

/* ------------------------- Start & shutdown ------------------------ */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT}`);
});

async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, closing server...`);
  server.close(async () => {
    try { await prisma.$disconnect(); } catch {}
    process.exit(0);
  });
}
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
