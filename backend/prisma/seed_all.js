require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* ---------------- config ---------------- */
const OWNER_COUNT = 18;
const GARDENER_COUNT = 18;

const firstNames = [
  'Nora','Ali','Camille','Hugo','Lina','Sofia','Jules','Chloé','Omar','Maya',
  'Léa','Mathis','Inès','Nabil','Zoé','Yanis','Emma','Victor','Adèle','Sami',
];
const lastNames = [
  'Durand','Ben Amar','Morel','Bernard','B.','A.','Martin','Lemoine','Diallo','Rossi',
  'Petit','Leroy','Garcia','Nguyen','Robin','Fabre','Marchand','Gauthier','Renard','Chevalier',
];

/* Only pretty green garden / potager photos (stable Unsplash IDs) */
const GARDEN_PHOTOS = [
  // garden paths / beds / potager / greenhouse / herbs — all very green
  "https://www.nidouillet.com/wp-content/uploads/2018/01/paysagiste-3.jpg",
  "https://www.guide-des-landes.com/_bibli/annonces/4775/hd/jardin-des-barthes.jpg",
  "https://www.nidouillet.com/wp-content/uploads/2018/01/paysagiste-2.jpg",
  "https://decorandocasas.com.br/wp-content/uploads/2014/07/jardins-residenciais-para-frente-de-casa-6.jpg",
  "https://www.guide-des-landes.com/_bibli/annonces/4775/hd/jardin-des-barthes.jpg",
  "https://www.lesplusbeauxjardinsdefrance.com/wp-content/uploads/2021/03/plus-beaux-jardins-france-parc-floral-apremont-allier-pont-rouge.jpg",
  "https://www.aidlib.fr/wp-content/uploads/2015/03/creation-jardin-94-plantation-fleurs-massif-val-de-marne-aidlib.jpg",
  "https://i-dj.unimedias.fr/2023/09/12/djwebitaliejardinpinsent-65001c9e73653.jpg",
  "https://cdn.radiofrance.fr/s3/cruiser-production/2019/06/91d9fbfe-1e85-4e59-9608-b4ef850d4eb7/1200x680_jardins_remarquables_gettyimages-164963728.jpg",
  "https://cdn-s-www.dna.fr/images/A814BD28-06F8-4D22-BCBC-E7ADD15658FF/NW_raw/ouvert-chaque-annee-entre-la-fin-du-mois-de-mars-et-le-mois-de-mai-le-parc-du-keukenhof-situe-au-sud-ouest-d-amsterdam-aux-pays-bas-compte-pres-de-sept-millions-de-tulipes-jacinthes-et-jonquilles-qui-fleurissent-en-meme-temps-pour-former-d-immenses-vagues-de-couleurs-photo-unsplash-axp-photoraghy-1680602263.jpg",
  "https://static.pratique.fr/images/unsized/be/beautiful-garden.jpg",
  "https://www.lesplusbeauxjardinsdefrance.com/wp-content/uploads/2021/03/plus-beaux-jardins-france-cinq-sens-yvoire-tissage.jpg",
  "https://www.jardinvertige.fr/public/img/medium/dsc_0865.jpg",
  "https://www.viviendasaludable.es/wp-content/uploads/2019/02/organizar-el-jardin-1.jpg",
  "https://www.lesplusbeauxjardinsdefrance.com/wp-content/uploads/2021/03/plus-beaux-jardins-france-potager-saint-jean-beauregard.jpg",
  "https://www.demotivateur.fr/images-buzz/100152/albionmanor.jpg",
  "https://bricoleurpro.ouest-france.fr/images/dossiers/2023-01/mini/jardin-naturel-065057-650-325.jpg",
  "https://www.sncf-connect.com/assets/media/2021-05/paris-jardin-des-plantes.jpg",
  "https://www.jardinsroisoleil.com/wp-content/uploads/2020/09/jardin.jpg",
  "https://www.lesplusbeauxjardinsdefrance.com/wp-content/uploads/2021/03/plus-beaux-jardins-france-parc-floral-apremont-allier-cascade.jpg",
  "https://www.jardins.biz/wp-content/uploads/2019/01/jardin-de-fleurs-magnifique.jpg",
  "https://img-4.linternaute.com/dtZgowkSqUpRZVRXNDhzNHU411s=/1240x/smart/image-cms/10343284.jpg",
  "https://thegardenstrust.org/wp-content/uploads/2021/05/The-ornamental-garden-%C2%A9-Chateau-et-Jardins-de-Villandry.jpg",
  "https://www.jardinage-conseils.fr/wp-content/uploads/2013/09/jardin1.jpg",
];

const paris = { lat: 48.8566, lng: 2.3522 };

/* ---------------- helpers ---------------- */
function jitter(c, max = 0.03) {
  const r = () => (Math.random() * 2 - 1) * max;
  return { lat: +(c.lat + r()).toFixed(6), lng: +(c.lng + r()).toFixed(6) };
}
function rand(min, max) { return Math.random() * (max - min) + min; }
function rint(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMany(arr, n) {
  const a = [...arr]; const out = [];
  while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length),1)[0]);
  return out;
}

function avatar(seed) { return `https://i.pravatar.cc/256?img=${(seed % 70) + 1}`; }

/* pick 3 distinct green garden photos */
function gardenPhotoTriplet(seedIndex) {
  const N = GARDEN_PHOTOS.length;
  const a = seedIndex % N;
  const b = (a + 5) % N;      // spaced to reduce duplicates
  const c = (a + 11) % N;
  return [GARDEN_PHOTOS[a], GARDEN_PHOTOS[b], GARDEN_PHOTOS[c]];
}

const gardenKinds = ['potager','urbain','serre','fleurs','verger'];
const gardenNeeds = ['arrosage','désherbage','plantation','taille','tonte','paillage','semis'];
const districts = ['Montmartre','Belleville','République','Bastille','Canal Saint-Martin','Nation','Auteuil','Latin','Batignolles','Buttes-Chaumont'];
const skillsPool = ['arrosage','désherbage','plantation','taille','tonte','compost','semis','permaculture','paillage','greffe'];

/* -------------- main -------------- */
async function main() {
  console.log('🧹 Cleaning tables…');
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.gardenerComment.deleteMany();
  await prisma.ownerComment.deleteMany();
  await prisma.garden.deleteMany();
  await prisma.gardener.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  console.log('📚 Seeding skills…');
  const skills = await Promise.all(
    skillsPool.map((name) => prisma.skill.create({ data: { name } }))
  );

  console.log('👥 Seeding users (owners & gardeners)…');
  const ownerUsers = [];
  const gardenerUsers = [];

  // owners
  for (let i = 0; i < OWNER_COUNT; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    ownerUsers.push(
      await prisma.user.create({
        data: {
          firstName: fn,
          lastName: ln,
          email: `owner${i+1}@example.com`,
          passwordHash: 'bcrypt$demo',
          role: 'proprietaire',
          avatarUrl: avatar(i),
          bio: `Propriétaire de jardin à ${pick(districts)}.`,
          phone: `0600${String(i).padStart(6,'0')}`,
          address: `${rint(1,120)} rue des Jardins, Paris`,
          averageRating: +rand(4.2, 5.0).toFixed(1),
        }
      })
    );
  }

  // gardeners
  for (let i = 0; i < GARDENER_COUNT; i++) {
    const fn = firstNames[(i+5) % firstNames.length];
    const ln = lastNames[(i+7) % lastNames.length];
    const u = await prisma.user.create({
      data: {
        firstName: fn,
        lastName: ln,
        email: `gardener${i+1}@example.com`,
        passwordHash: 'bcrypt$demo',
        role: 'ami_du_vert',
        avatarUrl: avatar(100 + i),
        bio: `Jardiner·e passionné·e, spécialisé·e ${pick(gardenNeeds)}.`,
        phone: `0700${String(i).padStart(6,'0')}`,
        address: `${rint(1,180)} avenue Verte, Paris`,
        averageRating: +rand(3.8, 5.0).toFixed(1),
      }
    });
    gardenerUsers.push(u);

    for (const s of pickMany(skills, 3)) {
      await prisma.userSkill.create({ data: { userId: u.id, skillId: s.id } });
    }
  }

  console.log('🏠 Seeding owners…');
  const owners = [];
  for (let i = 0; i < ownerUsers.length; i++) {
    const u = ownerUsers[i];
    owners.push(
      await prisma.owner.create({
        data: {
          userId: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          avatarUrl: u.avatarUrl,
          isOnline: Math.random() < 0.5,
          totalReviews: rint(3, 120),
          rating: u.averageRating ?? +rand(4.2, 5.0).toFixed(1),
          district: pick(districts),
          availability: pick(['Matins','Après-midi','Soirs & week-ends']),
          area: rint(20, 160),
          kind: pick(gardenKinds),
          intro: 'Je partage volontiers mon jardin.',
          description: 'Carrés potagers, fleurs, coin compost.',
          published: true,
          comments: {
            create: [
              { authorName: 'Sarah', text: 'Accueil chaleureux !' },
              { authorName: 'Marc', text: 'Super coin potager.' },
            ]
          }
        }
      })
    );
  }

  console.log('🌿 Seeding gardens (green only)…');
  for (let i = 0; i < owners.length; i++) {
    const u = ownerUsers[i];
    const coords = jitter(paris);
    const photos = gardenPhotoTriplet(i);

    await prisma.garden.create({
      data: {
        ownerUserId: u.id, // Garden links to User (owner)
        title: `${pick(['Potager','Jardin','Verger'])} de ${u.firstName}`,
        description: pick([
          'Soleil le matin, ombre l’après-midi. Idéal tomates & herbes.',
          'Terrain plat avec récupérateur d’eau.',
          'Petit havre urbain, parfait pour semis.',
          'Beaucoup de fleurs et d’aromatiques.',
        ]),
        address: u.address || `${rint(1,120)} rue des Jardins, Paris`,
        area: rint(25, 120),
        kind: pick(['potager','verger','urbain']),
        needs: pickMany(gardenNeeds, 2).join(', '),
        photos, // ✅ only curated green garden/potager images
        lat: coords.lat,
        lng: coords.lng,
        publishedAt: new Date(),
        status: 'disponible',
        averageRating: +rand(4.0, 5.0).toFixed(1),
      }
    });
  }

  console.log('🧑‍🌾 Seeding gardeners…');
  for (let i = 0; i < gardenerUsers.length; i++) {
    const u = gardenerUsers[i];
    await prisma.gardener.create({
      data: {
        userId: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        isOnline: Math.random() < 0.6,
        location: pick(['Paris 11','Paris 19','Montreuil','Pantin','Ivry','Boulogne']),
        skills: pickMany(skillsPool, 3),
        yearsExperience: rint(0, 7),
        intro: 'Disponible pour entretiens réguliers et conseils.',
        totalReviews: rint(0, 140),
        rating: +rand(3.8, 5.0).toFixed(1),
        published: true,
        comments: {
          create: [
            { authorName: 'Claire', text: 'Très pédagogue ✨' },
            { authorName: 'Noé', text: 'Travail soigné.' },
          ]
        }
      }
    });
  }

  console.log('✅ Seed completed: 18 owners + 18 gardens + 18 gardeners');
}

/* run */
main()
  .catch((e) => { console.error('❌ Seed failed', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
