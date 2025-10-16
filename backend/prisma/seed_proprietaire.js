const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.commentProprietaire.deleteMany();
    await prisma.proprietaire.deleteMany();

    // Lucas Martin (matchera l'owner du jardin "Jardin fleuri de Lucas")
    await prisma.proprietaire.create({
      data: {
        prenom: 'Lucas',
        nom: 'Martin',
        avatarUrl: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-homme_24908-81754.jpg',
        isOnline: true,
        totalReviews: 12,
        rating: 4.9,
        quartier: 'Lyon',
        disponibilites: 'Week-ends',
        surface: 120,
        type: 'fleurs',
        presentation: 'J’ai transformé mon terrain urbain en havre de biodiversité.',
        description: 'Fleurs, arrosage, désherbage',
        comments: {
          create: [
            { authorName: 'Ana', text: 'Très accueillant, jardin magnifique.' },
          ],
        },
      },
    });

    // Christian Martin
    await prisma.proprietaire.create({
      data: {
        prenom: 'Christian',
        nom: 'Martin',
        avatarUrl: null,
        isOnline: true,
        totalReviews: 18,
        rating: 4.8,
        quartier: 'Butte-aux-Cailles (Paris 13e)',
        disponibilites: 'Soirées & week-ends',
        surface: 60,
        type: 'potager',
        presentation: 'Passionné de tomates & aromatiques. Cherche coup de main arrosage & désherbage.',
        description: 'Carrés potagers, compost en cours.',
        comments: {
          create: [
            { authorName: 'Sarah', text: 'Accueil chaleureux, jardin agréable !' },
            { authorName: 'Nicolas', text: 'Tout est bien organisé, merci.' },
          ],
        },
      },
    });

    // Jeanne Roux
    await prisma.proprietaire.create({
      data: {
        prenom: 'Jeanne',
        nom: 'Roux',
        avatarUrl: null,
        isOnline: false,
        totalReviews: 7,
        rating: 4.6,
        quartier: 'Montreuil',
        disponibilites: 'Mercredi après-midi',
        surface: 35,
        type: 'verger',
        presentation: 'Petites tailles et entretien d’un jeune verger.',
        description: 'Pommier, poirier, prunier.',
        comments: { create: [{ authorName: 'Léo', text: 'Très sympa et flexible sur les horaires.' }] },
      },
    });

    console.log('✅ Proprietaires + commentaires insérés');
  } catch (e) {
    console.error('❌ Seed proprietaires failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
