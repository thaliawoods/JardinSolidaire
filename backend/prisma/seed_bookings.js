const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lucas = await prisma.user.findUnique({ where: { email: 'lucas@example.com' } });
  const hugo  = await prisma.user.findUnique({ where: { email: 'hugo@example.com' } });

  const lucasGarden = await prisma.garden.findFirst({ where: { title: 'Jardin fleuri de Lucas' } });
  const hugoGarden  = await prisma.garden.findFirst({ where: { title: 'Potager de Hugo' } });

  if (!lucas || !hugo || !lucasGarden || !hugoGarden) {
    throw new Error('Some users or gardens not found. Check your user/garden seeds.');
  }

  await prisma.booking.createMany({
    data: [
      {
        userId:  hugo.id,
        gardenId: lucasGarden.id,
        slotId:  null,
        status:  'confirmée',
        notes:   'Je viendrai avec mes outils 🌿',
      },
      {
        userId:  lucas.id,
        gardenId: hugoGarden.id,
        slotId:  null,
        status:  'en attente',
        notes:   'Première expérience de jardinage !',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Bookings seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Booking seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
