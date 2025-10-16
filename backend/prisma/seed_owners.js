const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.ownerComment.deleteMany();
    await prisma.owner.deleteMany();

    const lucas = await prisma.user.findFirst({
      where: { firstName: "Lucas", lastName: "Martin" },
    });
    const hugo = await prisma.user.findFirst({
      where: { firstName: "Hugo", lastName: "Bernard" },
    });
    if (!lucas || !hugo)
      throw new Error("Seed users not found. Run your user seed first.");

    await prisma.owner.create({
      data: {
        userId: lucas.id,
        firstName: "Christian",
        lastName: "Martin",
        isOnline: true,
        totalReviews: 18,
        rating: 4.8,
        district: "Butte-aux-Cailles (Paris 13e)",
        availability: "Soirées & week-ends",
        area: 60,
        kind: "potager",
        intro: "Passionné de tomates & aromatiques...",
        description: "Carrés potagers, compost en cours.",
        comments: {
          create: [{ authorName: "Sarah", text: "Accueil chaleureux !" }],
        },
        published: true,
      },
    });

    await prisma.owner.create({
      data: {
        userId: hugo.id,
        firstName: "Hugo",
        lastName: "Bernard",
        isOnline: false,
        totalReviews: 7,
        rating: 4.6,
        district: "Montreuil",
        availability: "Mercredi après-midi",
        area: 35,
        kind: "verger",
        intro: "Entretien d’un jeune verger.",
        description: "Pommier, poirier, prunier.",
        published: true,
      },
    });

    console.log("✅ Owners + comments seeded");
  } catch (e) {
    console.error("❌ Owners seed failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
