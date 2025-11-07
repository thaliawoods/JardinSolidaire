/* prisma/seed_all.js */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* ---------------- helpers ---------------- */
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

const paris = { lat: 48.8566, lng: 2.3522 };
function jitter(c, max = 0.03) {
  const r = () => (Math.random() * 2 - 1) * max; // ±max
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
function picsum(seed, w=1200, h=800) { return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`; }
function avatar(seed) { return `https://i.pravatar.cc/256?img=${(seed % 70) + 1}`; }

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
  // If you truly want a pristine DB: also wipe users
  await prisma.user.deleteMany();

  console.log('📚 Seeding skills…');
  const skills = await Promise.all(
    skillsPool.map((name) => prisma.skill.create({ data: { name } }))
  );

  console.log('👥 Seeding users (owners & gardeners)…');
  const ownerUsers = [];
  const gardenerUsers = [];

  // 18 owners
  for (let i = 0; i < OWNER_COUNT; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    ownerUsers.push(
      await prisma.user.create({
        data: {
          firstName: fn,
          lastName: ln,
          email: `owner${i+1}@example.com`,
          passwordHash: 'bcrypt$demo', // replace if your login requires a real hash
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

  // 18 gardeners
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

    // attach 3 random skills to user
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

  console.log('🌿 Seeding gardens…');
  for (let i = 0; i < owners.length; i++) {
    const u = ownerUsers[i];
    const coords = jitter(paris);
    await prisma.garden.create({
      data: {
        ownerUserId: u.id,               // ⚠️ Garden links to User (owner), not Owner
        title: `${pick(['Jardin','Potager','Verger','Coin vert'])} de ${u.firstName}`,
        description: pick([
          'Soleil le matin, ombre l’après-midi. Idéal tomates & herbes.',
          'Terrain plat avec récupérateur d’eau.',
          'Petit havre urbain, parfait pour semis.',
          'Beaucoup de fleurs et d’aromatiques.',
        ]),
        address: u.address || `${rint(1,120)} rue des Jardins, Paris`,
        area: rint(25, 120),
        kind: pick(gardenKinds),
        needs: pickMany(gardenNeeds, 2).join(', '),
        photos: [
          picsum(`garden-${i}-a`),
          picsum(`garden-${i}-b`),
          picsum(`garden-${i}-c`),
        ],
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
