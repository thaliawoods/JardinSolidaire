-- CreateTable
CREATE TABLE "public"."proprietaire" (
    "id_proprietaire" SERIAL NOT NULL,
    "prenom" TEXT,
    "nom" TEXT,
    "avatarUrl" TEXT,
    "isOnline" BOOLEAN DEFAULT false,
    "totalReviews" INTEGER DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 4.8,
    "quartier" TEXT,
    "disponibilites" TEXT,
    "surface" INTEGER,
    "type" TEXT,
    "presentation" TEXT,
    "description" TEXT,

    CONSTRAINT "proprietaire_pkey" PRIMARY KEY ("id_proprietaire")
);

-- CreateTable
CREATE TABLE "public"."CommentProprietaire" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proprietaireId" INTEGER,

    CONSTRAINT "CommentProprietaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Jardinier" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "localisation" TEXT,
    "competences" TEXT[],
    "experienceAnnees" INTEGER,
    "presentation" TEXT,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jardinier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommentJardinier" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jardinierId" INTEGER NOT NULL,

    CONSTRAINT "CommentJardinier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CommentProprietaire" ADD CONSTRAINT "CommentProprietaire_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "public"."proprietaire"("id_proprietaire") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentJardinier" ADD CONSTRAINT "CommentJardinier_jardinierId_fkey" FOREIGN KEY ("jardinierId") REFERENCES "public"."Jardinier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
