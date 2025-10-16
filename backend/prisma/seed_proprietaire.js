const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.commentProprietaire.deleteMany();
    await prisma.proprietaire.deleteMany();

    // find users to link
    const lucas  = await prisma.utilisateur.findFirst({ where: { prenom: 'Lucas',  nom: 'Martin' } });
    const jeanne = await prisma.utilisateur.findFirst({ where: { prenom: 'Jeanne', nom: 'Roux'   } });
    if (!lucas || !jeanne) throw new Error('Seed users not found. Run seed_utilisateur first.');

    await prisma.proprietaire.create({
      data: {
        userId: lucas.id_utilisateur,
        prenom: 'Christian',
        nom: 'Martin',
        isOnline: true,
        totalReviews: 18,
        rating: 4.8,
        quartier: 'Butte-aux-Cailles (Paris 13e)',
        disponibilites: 'Soirées & week-ends',
        surface: 60,
        type: 'potager',
        presentation: 'Passionné de tomates & aromatiques...',
        description: 'Carrés potagers, compost en cours.',
        comments: { create: [{ authorName: 'Sarah', text: 'Accueil chaleureux !' }] },
      },
    });

    await prisma.proprietaire.create({
      data: {
        userId: jeanne.id_utilisateur,
        prenom: 'Jeanne',
        nom: 'Roux',
        isOnline: false,
        totalReviews: 7,
        rating: 4.6,
        quartier: 'Montreuil',
        disponibilites: 'Mercredi après-midi',
        surface: 35,
        type: 'verger',
        presentation: 'Entretien d’un jeune verger.',
        description: 'Pommier, poirier, prunier.',
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
