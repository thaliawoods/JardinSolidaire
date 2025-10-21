require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function atHour(baseDate, hh, mm = 0) {
  const d = new Date(baseDate);
  d.setHours(hh, mm, 0, 0);
  return d;
}

(async () => {
  try {
    // User
    const user = await prisma.user.upsert({
      where: { email: 'seed@example.com' },
      update: {},
      create: {
        email: 'seed@example.com',
        firstName: 'Seed',
        lastName: 'User',
        passwordHash: 'bcrypt$dummy', // replace with a real hash if your login needs it
      },
    });

    // Garden (one per user)
    let garden = await prisma.garden.findFirst({ where: { ownerUserId: user.id } });
    if (!garden) {
      garden = await prisma.garden.create({
        data: {
          ownerUserId: user.id,
          title: 'Demo Garden',
          description: 'A lovely patch of green for seed testing.',
          address: '123 Rue Demo, Paris',
          kind: 'potager',
          needs: 'désherbage, tonte',
          photos: [],
          status: 'published'
        },
      });
    }

    // Availability slot tomorrow 10:00–12:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateOnly = new Date(tomorrow.toDateString());
    const start = atHour(tomorrow, 10);
    const end   = atHour(tomorrow, 12);

    const slot = await prisma.availabilitySlot.create({
      data: {
        gardenId: garden.id,
        date: dateOnly,
        startTime: start,
        endTime: end,
        status: 'booked', // we create a booking right after
      },
    });

    // Booking (pending)
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        gardenId: garden.id,
        slotId: slot.id,
        status: 'pending',
        notes: 'Seed booking to test FE pages.',
      },
    });

    console.log('✅ seed_bookings created', {
      userId: String(user.id),
      gardenId: String(garden.id),
      slotId: String(slot.id),
      bookingId: String(booking.id),
    });
    process.exit(0);
  } catch (e) {
    console.error('❌ seed_bookings failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
