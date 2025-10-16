// backend/prisma/seed_jardinier.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // Clean demo data (safe for local dev)
    await prisma.commentJardinier.deleteMany();
    await prisma.jardinier.deleteMany();

    // 1) Alice
    await prisma.jardinier.create({
      data: {
        prenom: 'Alice',
        nom: 'Dupont',
        avatarUrl: null,
        isOnline: true,
        localisation: '10 rue des Lilas, Paris',
        competences: ['herboristerie', 'taille', 'désherbage'],
        experienceAnnees: 3,
        presentation:
          'Herboriste passionnée, je cultive des plantes médicinales et je partage mes connaissances.',
        totalReviews: 242,
        rating: 4.9,
        comments: {
          create: [
            { authorName: 'Lucas', text: 'Super prestation, très ponctuelle !' },
            { authorName: 'Hugo', text: 'Très pédagogue, merci !' },
          ],
        },
      },
    });

    // 2) Emma
    await prisma.jardinier.create({
      data: {
        prenom: 'Emma',
        nom: 'Durand',
        avatarUrl: null,
        isOnline: false,
        localisation: '3 rue Verte, Marseille',
        competences: ['permaculture', 'plantation'],
        experienceAnnees: 1,
        presentation:
          'Débutante enthousiaste, j’apprends la permaculture et le jardinage naturel.',
        totalReviews: 120,
        rating: 4.5,
        comments: { create: [] },
      },
    });

    // 3) Karim (extra example)
    await prisma.jardinier.create({
      data: {
        prenom: 'Karim',
        nom: 'Ben Ali',
        avatarUrl: null,
        isOnline: true,
        localisation: 'Lyon',
        competences: ['arrosage', 'paillage', 'compost'],
        experienceAnnees: 5,
        presentation:
          'Jardinier bénévole, orienté entretien biologique et optimisation de l’arrosage.',
        totalReviews: 37,
        rating: 4.7,
        comments: {
          create: [{ authorName: 'Zoé', text: 'Très soigneux et efficace.' }],
        },
      },
    });

    console.log('✅ Seed jardiniers ok');
  } catch (e) {
    console.error('❌ Seed jardiniers failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
