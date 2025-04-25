const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.utilisateur.createMany({
    data: [
      {
        nom: 'Dupont',
        prenom: 'Alice',
        email: 'alice@example.com',
        mot_de_passe: 'password123',
        role: 'ami_du_vert', // ✅ OK
        photo_profil: 'https://img.freepik.com/vecteurs-premium/icones-visages-jolies-filles-cheveux-colores-filles-gaies-cheveux-colores-illustration-vectorielle-isolee-fond-blanc_528104-490.jpg?w=826',
        biographie: 'Passionnée par les plantes médicinales.',
        date_inscription: new Date(),
        telephone: '0601010101',
        adresse: '10 rue des Lilas, Paris',
        note_moyenne: 4.7,
      },
      {
        nom: 'Martin',
        prenom: 'Lucas',
        email: 'lucas@example.com',
        mot_de_passe: 'securepass',
        role: 'proprietaire', // ✅ OK
        photo_profil: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-homme_24908-81754.jpg',
        biographie: 'Propriétaire d’un grand jardin urbain.',
        date_inscription: new Date(),
        telephone: '0602020202',
        adresse: '25 avenue des Champs, Lyon',
        note_moyenne: 4.9,
      },
      {
        nom: 'Durand',
        prenom: 'Emma',
        email: 'emma@example.com',
        mot_de_passe: 'mypassword',
        role: 'ami_du_vert', // ✅ OK
        photo_profil: 'https://img.freepik.com/vecteurs-libre/femme-portant-lunettes_24908-81919.jpg',
        biographie: 'Souhaite apprendre le jardinage.',
        date_inscription: new Date(),
        telephone: '0603030303',
        adresse: '3 rue Verte, Marseille',
        note_moyenne: 4.5,
      },
      {
        nom: 'Bernard',
        prenom: 'Hugo',
        email: 'hugo@example.com',
        mot_de_passe: 'pass1234',
        role: 'proprietaire', // ✅ OK
        photo_profil: 'https://img.freepik.com/vecteurs-libre/homme-blond-lunettes_24908-81528.jpg',
        biographie: 'Propriétaire passionné.',
        date_inscription: new Date(),
        telephone: '0604040404',
        adresse: '18 rue de l’Admin, Lille',
        note_moyenne: 4.8,
      },
      {
        nom: 'Lemoine',
        prenom: 'Chloé',
        email: 'chloe@example.com',
        mot_de_passe: 'abc123',
        role: 'ami_du_vert', // ✅ OK
        photo_profil: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-femme_24908-81036.jpg',
        biographie: 'Jardinière en herbe.',
        date_inscription: new Date(),
        telephone: '0605050505',
        adresse: '5 allée des Roses, Toulouse',
        note_moyenne: 4.6,
      }
    ],
  });

  console.log('Données insérées avec succès !');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
