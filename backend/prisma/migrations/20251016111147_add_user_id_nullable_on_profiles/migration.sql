/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Jardinier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `proprietaire` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Jardinier" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" BIGINT;

-- AlterTable
ALTER TABLE "public"."proprietaire" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "Jardinier_userId_key" ON "public"."Jardinier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "proprietaire_userId_key" ON "public"."proprietaire"("userId");

-- AddForeignKey
ALTER TABLE "public"."proprietaire" ADD CONSTRAINT "proprietaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."utilisateur"("id_utilisateur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jardinier" ADD CONSTRAINT "Jardinier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."utilisateur"("id_utilisateur") ON DELETE SET NULL ON UPDATE CASCADE;
