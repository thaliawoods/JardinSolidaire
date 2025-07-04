const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.createMany({
    data: [
      {
        id_utilisateur: 2,
        id_jardin: 3,
        id_disponibilite: null,
        statut: 'confirmée',
        commentaires: 'Je viendrai avec mes outils 🌿'
      },
      {
        id_utilisateur: 3,
        id_jardin: 4,
        id_disponibilite: null,
        statut: 'en attente',
       commentaires: 'Première expérience de jardinage !'
      },
    //   {
    //     id_utilisateur: 5n, 
    //     id_jardin: 2n,
    //     id_disponibilite: null,
    //     statut: 'confirmée',
    //     commentaires: 'Dispo toute la semaine 🌱'
    //   }
    ]
  });

  console.log('✅ Réservations insérées avec succès.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'insertion des réservations :', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });