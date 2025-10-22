/*
  Warnings:

  - A unique constraint covering the columns `[gardenerId,date,startTime,endTime]` on the table `GardenerAvailabilitySlot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."jardin_id_proprietaire_key";

-- AlterTable
ALTER TABLE "public"."jardin" ALTER COLUMN "date_publication" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "GardenerAvailabilitySlot_gardenerId_date_startTime_endTime_key" ON "public"."GardenerAvailabilitySlot"("gardenerId", "date", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "jardin_id_proprietaire_idx" ON "public"."jardin"("id_proprietaire");
