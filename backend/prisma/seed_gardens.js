const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lucas = await prisma.user.findUnique({ where: { email: 'lucas@example.com' } });
  const hugo  = await prisma.user.findUnique({ where: { email: 'hugo@example.com' } });

  if (!lucas || !hugo) {
    throw new Error("Lucas or Hugo doesn't exist. Check their emails in the user seed!");
  }

  await prisma.garden.createMany({
    data: [
      {
        ownerUserId:  lucas.id,
        title:        'Jardin fleuri de Lucas',
        description:  'Un jardin lumineux avec beaucoup de fleurs.',
        address:      '25 avenue des Champs, Lyon',
        area:         40,
        kind:         'fleurs',
        needs:        'arrosage, désherbage',
        photos:       [
          'https://img.freepik.com/photos-gratuite/beau-parc-verdoyant_1417-1447.jpg?t=st=1745587481~exp=1745591081~hmac=f6c641fa958eb9bc7979c1a5e4496a66566577bb138d773bdf1d05dd87b78741&w=1380'
        ],
        publishedAt:  new Date(),
        status:       'disponible',
        averageRating: 4.9,
      },
      {
        ownerUserId:  hugo.id,
        title:        'Potager de Hugo',
        description:  'Grand potager à partager avec un passionné.',
        address:      '18 rue de l’Admin, Lille',
        area:         60,
        kind:         'potager',
        needs:        'plantation, entretien',
        photos:       [
          'https://img.freepik.com/photos-gratuite/sentier-sous-belle-arche-fleurs-plantes_181624-16890.jpg?t=st=1745587455~exp=1745591055~hmac=7a9d020aeee0dc84eb5267df6574f6708ec268ec458dfa8505112fb531e40e96&w=1380'
        ],
        publishedAt:  new Date(),
        status:       'disponible',
        averageRating: 4.8,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Gardens seeded successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Garden seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
