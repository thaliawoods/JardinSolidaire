/*
  Warnings:

  - A unique constraint covering the columns `[id_proprietaire]` on the table `jardin` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id_proprietaire` on table `jardin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."jardin" ALTER COLUMN "id_proprietaire" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "jardin_id_proprietaire_key" ON "public"."jardin"("id_proprietaire");
