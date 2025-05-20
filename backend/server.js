require('dotenv').config();
console.log('▶️ DATABASE_URL =', process.env.DATABASE_URL);

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


const jardinsRoutes = require('./routes/jardins');
const jardiniersRoutes = require('./routes/jardiniers');


const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());
app.use('/api/jardins', jardinsRoutes);
app.use('/api/jardiniers', jardiniersRoutes);


app.get('/', (req, res) => {
  res.send('Backend avec Prisma est en ligne ✅');
});

// Connexion sécurisée
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const user = await prisma.utilisateur.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.mot_de_passe);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
    }

    res.status(200).json({
      message: 'Connexion réussie !',
      user: {
        id: Number(user.id_utilisateur),
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
        photo: user.photo_profil,
      }
    });
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Inscription sécurisée avec cryptage du mot de passe
app.post('/register', async (req, res) => {
  const { prenom, nom, email, password, role } = req.body;

  if (!prenom || !nom || !email || !password || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Un compte avec cet e-mail existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email,
        mot_de_passe: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message: 'Inscription réussie !',
      user: {
        id: Number(newUser.id_utilisateur),
        prenom: newUser.prenom,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});

