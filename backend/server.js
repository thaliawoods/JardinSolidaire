require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

const gardensRoutes       = require('./routes/gardens');
const gardenersRoutes     = require('./routes/gardeners');
const ownersRoutes        = require('./routes/owners');
const loginRoutes         = require('./routes/login');
const registerRoutes      = require('./routes/register');
const authCheckEmail      = require('./routes/auth.checkEmail');
const authResetPassword   = require('./routes/auth.resetPassword');
const navbarRoutes        = require('./routes/navbar');
const meRoutes            = require('./routes/me');
const messagesRoutes      = require('./routes/messages');
const bookingsRoutes      = require('./routes/bookings');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/_dbcheck', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: 'ok' });
  } catch (e) {
    console.error('DB check failed:', e);
    res.status(500).json({ db: 'down', message: String(e) });
  }
});

app.use('/api/gardens', gardensRoutes);
app.use('/api/gardeners', gardenersRoutes);
app.use('/api/owners', ownersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/auth', authCheckEmail);    
app.use('/api/auth', authResetPassword); 
app.use('/api/navbar', navbarRoutes);
app.use('/api/me', meRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/bookings', bookingsRoutes);
// Optional:
// app.use('/api/garden-page', gardenPageRoutes);

app.use('/api/jardins',        (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/jardins/, '/api/gardens')));
app.use('/api/jardiniers',     (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/jardiniers/, '/api/gardeners')));
app.use('/api/proprietaires',  (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/proprietaires/, '/api/owners')));

app.use('/api/connexion',      (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/connexion/, '/api/login')));
app.use('/api/inscription',    (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/inscription/, '/api/register')));
app.post('/api/verifier-email', (req, res) => res.redirect(301, '/api/auth/check-email'));
app.post('/api/modifier_mdp',   (req, res) => res.redirect(301, '/api/auth/reset-password'));
app.use('/api/mdp',            (req, res) => res.redirect(301, '/api/auth/check-email')); // old "mdp_oublie"

app.use('/api/utilisateur/has-annonce', (req, res) => res.redirect(301, '/api/navbar'));
app.use('/api/pageJardin',     (req, res) => res.redirect(301, req.originalUrl.replace(/^\/api\/pageJardin/, '/api/gardens')));

app.get('/', (_req, res) => res.send('Prisma backend is online ✅'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
