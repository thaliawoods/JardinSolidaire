const { PrismaClient } = require('./generated/client');
const prisma = new PrismaClient();

async function main() {
  const skills = [
    'Jardin potager 🍅',
    'Création florale 🌸',
    'Permaculture douce 🌿',
    'Transmission & apprentissage 📚',
    'Tonte & soin des pelouses ✂️',
  ];

  for (const name of skills) {
    await prisma.competence.upsert({
      where: { nom: name },
      update: {},
      create: { nom: name },
    });
  }

  console.log('✅ Skills seeded (data in French).');
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
