const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.gardenerComment.deleteMany();
    await prisma.gardener.deleteMany();

    const alice = await prisma.user.findFirst({
      where: { firstName: 'Alice', lastName: 'Dupont' },
    });
    const emma = await prisma.user.findFirst({
      where: { firstName: 'Emma', lastName: 'Durand' },
    });
    if (!alice || !emma) {
      throw new Error('Seed users for gardeners not found. Check your user seed.');
    }

    await prisma.gardener.create({
      data: {
        userId: alice.id,
        firstName: 'Alice',
        lastName: 'Dupont',
        avatarUrl: 'https://img.freepik.com/...jpg',
        location: 'Paris',
        skills: ['désherbage', 'arrosage'], 
        yearsExperience: 2,
        intro: 'Herboriste passionnée…',
        totalReviews: 12,
        rating: 4.7,
        published: true,
      },
    });

    await prisma.gardener.create({
      data: {
        userId: emma.id,
        firstName: 'Emma',
        lastName: 'Durand',
        location: 'Marseille',
        skills: ['permaculture'],
        yearsExperience: 1,
        intro: 'Débutante enthousiaste…',
        totalReviews: 5,
        rating: 4.5,
        published: true,
      },
    });

    console.log('✅ Gardeners seeded successfully');
  } catch (e) {
    console.error('❌ Gardeners seed failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
