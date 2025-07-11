require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();

const jardinsRoutes = require('./routes/jardins');
const jardiniersRoutes = require('./routes/jardiniers');
// const reservationsRoutes = require('./routes/reservations');
const {hashPassword} = require('./utils')
const app = express();
const PORT = process.env.PORT || 5001;

// Import des routes
const connexionRoutes = require('./routes/connexion'); // ⬅️ ajout ici*/
const inscriptionRoutes = require('./routes/inscription');
const mdpOublieRoutes = require('./routes/mdp_oublie');
const modifierMdpRoutes = require('./routes/modifier_mdp');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/jardins', jardinsRoutes);
app.use('/api/jardiniers', jardiniersRoutes);
// app.use('/api/reservations', reservationsRoutes);

app.use('/api/connexion', connexionRoutes); // ⬅️ activation route login*/
app.use('/api/inscription', inscriptionRoutes);
app.use('/api/mdp', mdpOublieRoutes);
app.use('/api/modifier_mdp', modifierMdpRoutes);

// Route test
app.get('/', (req, res) => {
  res.send('Backend avec Prisma est en ligne ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
