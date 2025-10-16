const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.commentJardinier.deleteMany();
    await prisma.jardinier.deleteMany();

    // link to existing users (example: Alice & Emma)
    const alice = await prisma.utilisateur.findFirst({ where: { prenom: 'Alice', nom: 'Dupont' } });
    const emma  = await prisma.utilisateur.findFirst({ where: { prenom: 'Emma',  nom: 'Durand' } });
    if (!alice || !emma) throw new Error('Seed users for jardiniers not found.');

    await prisma.jardinier.create({
      data: {
        userId: alice.id_utilisateur,
        prenom: 'Alice',
        nom: 'Dupont',
        avatarUrl: 'https://img.freepik.com/...jpg',
        localisation: 'Paris',
        competences: ['désherbage', 'arrosage'],
        experienceAnnees: 2,
        presentation: 'Herboriste passionnée…',
        totalReviews: 12,
        rating: 4.7,
        published: true,
      },
    });

    await prisma.jardinier.create({
      data: {
        userId: emma.id_utilisateur,
        prenom: 'Emma',
        nom: 'Durand',
        localisation: 'Marseille',
        competences: ['permaculture'],
        experienceAnnees: 1,
        presentation: 'Débutante enthousiaste…',
        totalReviews: 5,
        rating: 4.5,
        published: true,
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
