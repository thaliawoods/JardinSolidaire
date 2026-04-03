require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

/* ---------------- config ---------------- */
const OWNER_COUNT = 18;
const GARDENER_COUNT = 18;

const firstNames = [
  "Nora","Ali","Camille","Hugo","Lina","Sofia","Jules","Chloé","Omar","Maya",
  "Léa","Mathis","Inès","Nabil","Zoé","Yanis","Emma","Victor","Adèle","Sami",
];
const lastNames = [
  "Durand","Ben Amar","Morel","Bernard","B.","A.","Martin","Lemoine","Diallo","Rossi",
  "Petit","Leroy","Garcia","Nguyen","Robin","Fabre","Marchand","Gauthier","Renard","Chevalier",
];

const districts = [
  "Montmartre","Belleville","République","Bastille","Canal Saint-Martin",
  "Nation","Auteuil","Quartier Latin","Batignolles","Buttes-Chaumont",
];

const gardenerLocations = ["Paris 11","Paris 19","Montreuil","Pantin","Ivry","Boulogne","Saint-Ouen","Bagnolet"];

const gardenKinds = ["potager","urbain","serre","fleurs","verger"];
const gardenNeeds = ["arrosage","désherbage","plantation","taille","tonte","paillage","semis"];

const skillsPool = ["arrosage","désherbage","plantation","taille","tonte","compost","semis","permaculture","paillage","greffe"];

const OWNER_INTROS = [
  "Je partage volontiers mon jardin : j’aime quand il vit et qu’on apprend ensemble.",
  "Bienvenue ! Je cherche des coups de main ponctuels et des personnes fiables.",
  "Ici on jardine simple : entraide, calme, et une bonne dose de verdure.",
  "J’ai un jardin urbain et j’adore transmettre mes astuces aux débutant·es.",
];

const OWNER_DESCRIPTIONS = [
  "Carrés potagers, aromatiques, et coin compost. Accès facile, outils sur place.",
  "Terrain plat, récupérateur d’eau, plantations variées. On avance petit à petit.",
  "Petit espace cosy, parfait pour semis / entretien léger. Ambiance tranquille.",
  "Beaucoup de fleurs et d’arbustes. Besoin d’aide pour désherbage et taille.",
];

const GARDENER_INTROS = [
  "Disponible pour entretiens réguliers et conseils.",
  "J’aime jardiner proprement : arrosage, désherbage, paillage, et semis.",
  "Je peux aider sur des créneaux fixes en semaine et parfois le week-end.",
  "Je suis à l’aise avec les potagers et les aromatiques, et j’adore apprendre.",
];

const GARDENER_BIOS = [
  "Je jardine depuis quelques années, surtout en potager. Je travaille calmement, et je respecte les lieux.",
  "J’aime les jardins urbains : je sais optimiser l’espace, pailler, et organiser les tâches.",
  "Je suis plutôt “mains dans la terre” : semis, arrosage, entretien, et compost.",
  "Je peux venir régulièrement, et je préfère une communication simple et claire.",
];

/* Only pretty green garden / potager photos */
const GARDEN_PHOTOS = [
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
function rand(min, max) { return Math.random() * (max - min) + min; }
function rint(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMany(arr, n) {
  const a = [...arr];
  const out = [];
  while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
}
function jitter(c, max = 0.03) {
  const r = () => (Math.random() * 2 - 1) * max;
  return { lat: +(c.lat + r()).toFixed(6), lng: +(c.lng + r()).toFixed(6) };
}
function avatar(seed) {
  return `https://i.pravatar.cc/256?img=${(seed % 70) + 1}`;
}
function gardenPhotoTriplet(seedIndex) {
  const N = GARDEN_PHOTOS.length;
  const a = seedIndex % N;
  const b = (a + 5) % N;
  const c = (a + 11) % N;
  return [GARDEN_PHOTOS[a], GARDEN_PHOTOS[b], GARDEN_PHOTOS[c]];
}

/**
 * Create availability slots that match your schema:
 * AvailabilitySlot: date (Date), startTime (Time), endTime (Time), status (String)
 *
 * In PostgreSQL, Prisma "Time" fields are represented as Date objects whose date part is ignored.
 */
function makeTime(h, m = 0) {
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}
function makeDateOnly(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/* next monday (UTC) */
function nextMondayUTC() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay(); // 0=Sun..6=Sat
  const diff = (8 - day) % 7 || 7; // days until next monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

/* -------------- main -------------- */
async function main() {
  console.log("🧹 Cleaning tables…");

  // Order matters because of FK constraints
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.gardenerAvailabilitySlot.deleteMany();

  // We do NOT seed comments/reviews anymore, so we clear them too (if any exist)
  await prisma.review.deleteMany();
  await prisma.gardenerComment.deleteMany();
  await prisma.ownerComment.deleteMany();

  await prisma.garden.deleteMany();
  await prisma.gardener.deleteMany();
  await prisma.owner.deleteMany();

  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.message.deleteMany();
  await prisma.hoursTotal.deleteMany();
  await prisma.user.deleteMany();

  console.log("📚 Seeding skills…");
  const skills = await Promise.all(
    skillsPool.map((name) => prisma.skill.create({ data: { name } }))
  );

  console.log("👥 Seeding users…");
  const ownerUsers = [];
  const gardenerUsers = [];
  const demoHash = await bcrypt.hash("Demo1234", 10);

  // --- owners users ---
  for (let i = 0; i < OWNER_COUNT; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];

    const u = await prisma.user.create({
      data: {
        firstName: fn,
        lastName: ln,
        email: `owner${i + 1}@example.com`,
        passwordHash: demoHash,
        emailVerifiedAt: new Date(),
        role: "proprietaire",
        avatarUrl: avatar(i),
        bio: `J’habite à ${pick(districts)}. J’aime partager mon jardin et avancer étape par étape.`,
        phone: `0600${String(i).padStart(6, "0")}`,
        address: `${rint(1, 180)} rue des Jardins, Paris`,
        averageRating: null, // ✅ no ratings feature yet
      },
    });

    // attach a few skills too (optional but makes profiles richer)
    for (const s of pickMany(skills, 2)) {
      await prisma.userSkill.create({ data: { userId: u.id, skillId: s.id } });
    }

    ownerUsers.push(u);
  }

  // --- gardeners users ---
  for (let i = 0; i < GARDENER_COUNT; i++) {
    const fn = firstNames[(i + 5) % firstNames.length];
    const ln = lastNames[(i + 7) % lastNames.length];

    const u = await prisma.user.create({
      data: {
        firstName: fn,
        lastName: ln,
        email: `gardener${i + 1}@example.com`,
        passwordHash: demoHash,
        emailVerifiedAt: new Date(),
        role: "ami_du_vert",
        avatarUrl: avatar(100 + i),
        bio: pick(GARDENER_BIOS),
        phone: `0700${String(i).padStart(6, "0")}`,
        address: `${rint(1, 200)} avenue Verte, Paris`,
        averageRating: null, // ✅ no ratings feature yet
      },
    });

    for (const s of pickMany(skills, 3)) {
      await prisma.userSkill.create({ data: { userId: u.id, skillId: s.id } });
    }

    gardenerUsers.push(u);
  }

  console.log("🏠 Seeding owners profiles…");
  const owners = [];
  for (let i = 0; i < ownerUsers.length; i++) {
    const u = ownerUsers[i];
    const o = await prisma.owner.create({
      data: {
        userId: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        isOnline: Math.random() < 0.5,

        // ✅ no reviews/ratings
        totalReviews: 0,
        rating: null,

        district: pick(districts),
        availability: pick(["Matins", "Après-midi", "Soirs & week-ends"]),
        area: rint(20, 160),
        kind: pick(gardenKinds),
        intro: pick(OWNER_INTROS),
        description: pick(OWNER_DESCRIPTIONS),
        published: true,
      },
    });
    owners.push(o);
  }

  console.log("🌿 Seeding gardens + availability…");
  const gardens = [];
  const monday = nextMondayUTC();

  for (let i = 0; i < owners.length; i++) {
    const ownerUser = ownerUsers[i];
    const coords = jitter(paris);
    const photos = gardenPhotoTriplet(i);

    const g = await prisma.garden.create({
      data: {
        ownerUserId: ownerUser.id,
        title: `${pick(["Potager", "Jardin", "Verger"])} de ${ownerUser.firstName}`,
        description: pick([
          "Soleil le matin, ombre l’après-midi. Idéal tomates & aromatiques.",
          "Terrain plat avec récupérateur d’eau. Accès simple, ambiance calme.",
          "Petit havre urbain : semis, paillage, entretien léger.",
          "Fleurs et aromatiques : besoin d’un coup de main régulier.",
        ]),
        address: ownerUser.address || `${rint(1, 120)} rue des Jardins, Paris`,
        area: +rand(25, 120).toFixed(1),
        kind: pick(["potager", "verger", "urbain"]),
        needs: pickMany(gardenNeeds, 2).join(", "),
        photos, // ✅ same photo sources
        lat: coords.lat,
        lng: coords.lng,
        publishedAt: new Date(),
        status: "disponible",
        averageRating: null, // ✅ no ratings feature yet
      },
    });

    gardens.push(g);

    // ✅ Create 2 weeks of slots, 3 days/week, 2 slots/day
    const daysOffsets = pickMany([0,1,2,3,4,5,6], 3).sort(); // 3 days in the week
    for (let w = 0; w < 2; w++) {
      for (const off of daysOffsets) {
        const date = new Date(monday);
        date.setUTCDate(monday.getUTCDate() + w * 7 + off);

        const dateOnly = makeDateOnly(date);

        // 10:00-12:00
        await prisma.availabilitySlot.create({
          data: {
            gardenId: g.id,
            date: dateOnly,
            startTime: makeTime(10, 0),
            endTime: makeTime(12, 0),
            status: "free",
          },
        });

        // 14:00-16:00
        await prisma.availabilitySlot.create({
          data: {
            gardenId: g.id,
            date: dateOnly,
            startTime: makeTime(14, 0),
            endTime: makeTime(16, 0),
            status: "free",
          },
        });
      }
    }
  }

  console.log("🧑‍🌾 Seeding gardeners profiles + personal availability…");
  for (let i = 0; i < gardenerUsers.length; i++) {
    const u = gardenerUsers[i];

    const gard = await prisma.gardener.create({
      data: {
        userId: u.id,
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        avatarUrl: u.avatarUrl,
        isOnline: Math.random() < 0.6,
        location: pick(gardenerLocations),
        skills: pickMany(skillsPool, 3),
        yearsExperience: rint(0, 7),
        intro: pick(GARDENER_INTROS),

        // ✅ no reviews/ratings
        totalReviews: 0,
        rating: null,

        published: true,
      },
    });

    // ✅ Personal availability: 2 weeks, 3 days/week, 1 slot/day (18:00-20:00)
    const daysOffsets = pickMany([0,1,2,3,4,5,6], 3).sort();
    for (let w = 0; w < 2; w++) {
      for (const off of daysOffsets) {
        const date = new Date(monday);
        date.setUTCDate(monday.getUTCDate() + w * 7 + off);
        const dateOnly = makeDateOnly(date);

        await prisma.gardenerAvailabilitySlot.create({
          data: {
            gardenerId: gard.id,
            date: dateOnly,
            startTime: makeTime(18, 0),
            endTime: makeTime(20, 0),
            status: "free",
          },
        });
      }
    }
  }

  console.log(`✅ Seed completed:
- ${OWNER_COUNT} owners + ${OWNER_COUNT} gardens (+ slots)
- ${GARDENER_COUNT} gardeners (+ personal slots)
- skills + userSkill`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
