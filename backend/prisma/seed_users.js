const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        lastName: 'Dupont',
        firstName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'password123', // TODO: replace with a real hash later
        role: 'ami_du_vert',
        avatarUrl: 'https://img.freepik.com/vecteurs-premium/icones-visages-jolies-filles-cheveux-colores-filles-gaies-cheveux-colores-illustration-vectorielle-isolee-fond-blanc_528104-490.jpg?w=826',
        bio: "Herboriste passionnée, je cultive des plantes médicinales et prépare des tisanes pour toute la famille.",
        joinedAt: new Date(),
        phone: '0601010101',
        address: '10 rue des Lilas, Paris',
        averageRating: 4.7,
      },
      {
        lastName: 'Martin',
        firstName: 'Lucas',
        email: 'lucas@example.com',
        passwordHash: 'securepass',
        role: 'proprietaire',
        avatarUrl: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-homme_24908-81754.jpg',
        bio: "J’ai transformé mon terrain urbain en havre de biodiversité. J’accueille avec plaisir ceux qui veulent jardiner.",
        joinedAt: new Date(),
        phone: '0602020202',
        address: '25 avenue des Champs, Lyon',
        averageRating: 4.9,
      },
      {
        lastName: 'Durand',
        firstName: 'Emma',
        email: 'emma@example.com',
        passwordHash: 'mypassword',
        role: 'ami_du_vert',
        avatarUrl: 'https://img.freepik.com/vecteurs-libre/femme-portant-lunettes_24908-81919.jpg',
        bio: "Débutante enthousiaste, j’ai soif d’apprendre les bases du jardinage naturel et de la permaculture.",
        joinedAt: new Date(),
        phone: '0603030303',
        address: '3 rue Verte, Marseille',
        averageRating: 4.5,
      },
      {
        lastName: 'Bernard',
        firstName: 'Hugo',
        email: 'hugo@example.com',
        passwordHash: 'pass1234',
        role: 'proprietaire',
        avatarUrl: 'https://img.freepik.com/vecteurs-libre/homme-blond-lunettes_24908-81528.jpg',
        bio: "Mon jardin, c’est mon refuge. J’y cultive légumes, fleurs et idées. Toujours heureux de partager cet espace.",
        joinedAt: new Date(),
        phone: '0604040404',
        address: '18 rue de l’Admin, Lille',
        averageRating: 4.8,
      },
      {
        lastName: 'Lemoine',
        firstName: 'Chloé',
        email: 'chloe@example.com',
        passwordHash: 'abc123',
        role: 'ami_du_vert',
        avatarUrl: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-femme_24908-81036.jpg',
        bio: "Fascinée par les fleurs comestibles et les plantes grimpantes, je cherche à en apprendre davantage chaque jour.",
        joinedAt: new Date(),
        phone: '0605050505',
        address: '5 allée des Roses, Toulouse',
        averageRating: 4.6,
      }
    ],
    skipDuplicates: true, 
  });

  console.log('✅ Users inserted.');

  const greenFriends = await prisma.user.findMany({
    where: { role: 'ami_du_vert' },
  });
  const skills = await prisma.skill.findMany();

  function pickRandom(arr, n) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  for (const user of greenFriends) {
    const selection = pickRandom(skills, 3);
    for (const skill of selection) {
      await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
        },
      });
    }
    console.log(`🔗 Skills linked to ${user.firstName} ${user.lastName}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ User seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
