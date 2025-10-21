-- CreateTable
CREATE TABLE "public"."GardenerAvailabilitySlot" (
    "id" SERIAL NOT NULL,
    "gardenerId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIME(6) NOT NULL,
    "endTime" TIME(6) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "GardenerAvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GardenerAvailabilitySlot_gardenerId_date_startTime_endTime_idx" ON "public"."GardenerAvailabilitySlot"("gardenerId", "date", "startTime", "endTime");

-- AddForeignKey
ALTER TABLE "public"."GardenerAvailabilitySlot" ADD CONSTRAINT "GardenerAvailabilitySlot_gardenerId_fkey" FOREIGN KEY ("gardenerId") REFERENCES "public"."Jardinier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
