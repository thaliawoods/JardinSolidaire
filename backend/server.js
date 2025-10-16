// backend/server.js
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

// Routers
const jardinsRoutes = require('./routes/jardins');
const jardiniersRoutes = require('./routes/jardiniers');
const proprietairesRoutes = require('./routes/proprietaires');
const connexionRoutes = require('./routes/connexion');
const inscriptionRoutes = require('./routes/inscription');
const mdpOublieRoutes = require('./routes/mdp_oublie');
const modifierMdpRoutes = require('./routes/modifier_mdp');
const navbarRoute = require('./routes/navbar');
const meRoutes = require('./routes/me'); // <- make sure this line exists

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB health
app.get('/api/_dbcheck', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: 'ok' });
  } catch (e) {
    console.error('DB check failed:', e);
    res.status(500).json({ db: 'down', message: String(e) });
  }
});

// Mount API
app.use('/api/jardins', jardinsRoutes);
app.use('/api/jardiniers', jardiniersRoutes);
app.use('/api/proprietaires', proprietairesRoutes);
app.use('/api/connexion', connexionRoutes);
app.use('/api/inscription', inscriptionRoutes);
app.use('/api/mdp', mdpOublieRoutes);
app.use('/api/modifier_mdp', modifierMdpRoutes);
app.use('/api/utilisateur/has-annonce', navbarRoute);
app.use('/api/me', meRoutes);

app.get('/', (_req, res) => res.send('Backend avec Prisma est en ligne ✅'));

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
