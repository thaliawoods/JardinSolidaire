// backend/routes/jardins.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/_ping', (_req, res) => res.json({ ok: true }));

/**
 * LISTE des jardins
 * query: ?search=&quartier=&type=
 */
router.get('/', async (req, res) => {
  try {
    const { search = '', quartier = '', type = '' } = req.query;

    const rows = await prisma.jardin.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { titre: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { adresse: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          type ? { type } : {},
          // Si un champ "quartier" existe un jour sur "jardin", ajoute-le ici
          // quartier ? { quartier: { contains: quartier, mode: 'insensitive' } } : {},
        ],
      },
      orderBy: { id_jardin: 'asc' },
    });

    res.json(
      rows.map((j) => ({
        id_jardin: String(j.id_jardin),
        id_proprietaire: j.id_proprietaire ? String(j.id_proprietaire) : null, // utilisateur.id
        titre: j.titre ?? '',
        description: j.description ?? '',
        adresse: j.adresse ?? '',
        type: j.type ?? '',
        besoins: j.besoins ?? '',
        photos: Array.isArray(j.photos) ? j.photos : [],
        date_publication: j.date_publication,
        note_moyenne: j.note_moyenne ?? null,
      })),
    );
  } catch (err) {
    console.error('Erreur GET /jardins :', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/**
 * DÉTAIL d’un jardin
 * Retourne les infos du jardin + bloc owner (depuis "utilisateur")
 * + un pont facultatif vers la table "proprietaire" des seeds (proprietaireDemoId)
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });

  try {
    const j = await prisma.jardin.findUnique({
      where: { id_jardin: id },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            prenom: true,
            nom: true,
            email: true,
            telephone: true,
            adresse: true,
            photo_profil: true,
            note_moyenne: true,
            biographie: true,
          },
        },
      },
    });

    if (!j) return res.status(404).json({ error: 'not_found' });

    // Tentative de "pont" vers la table seed "proprietaire" par match sur prénom/nom
    let proprietaireDemoId = null;
    if (j.utilisateur?.prenom || j.utilisateur?.nom) {
      const demo = await prisma.proprietaire.findFirst({
        where: {
          prenom: j.utilisateur?.prenom || undefined,
          nom: j.utilisateur?.nom || undefined,
        },
        select: { id_proprietaire: true },
      });
      if (demo) proprietaireDemoId = String(demo.id_proprietaire);
    }

    res.json({
      id_jardin: String(j.id_jardin),
      titre: j.titre ?? '',
      description: j.description ?? '',
      adresse: j.adresse ?? '',
      type: j.type ?? '',
      besoins: j.besoins ?? '',
      photos: Array.isArray(j.photos) ? j.photos : [],
      date_publication: j.date_publication,
      note_moyenne: j.note_moyenne ?? null,

      owner: j.utilisateur
        ? {
            id_utilisateur: String(j.utilisateur.id_utilisateur),
            prenom: j.utilisateur.prenom ?? '',
            nom: j.utilisateur.nom ?? '',
            avatarUrl: j.utilisateur.photo_profil ?? null,
            telephone: j.utilisateur.telephone ?? null,
            adresse: j.utilisateur.adresse ?? null,
            note: j.utilisateur.note_moyenne ?? null,
            presentation: j.utilisateur.biographie ?? null,
          }
        : null,

      proprietaireDemoId, // pour lier vers /proprietaires/[id] si trouvé
    });
  } catch (err) {
    console.error('Erreur GET /jardins/:id :', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
