-- DropForeignKey
ALTER TABLE "PlantImage" DROP CONSTRAINT "PlantImage_plantId_fkey";

-- AddForeignKey
ALTER TABLE "PlantImage" ADD CONSTRAINT "PlantImage_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
