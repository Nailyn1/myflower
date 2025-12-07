-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_typeId_fkey";

-- AlterTable
ALTER TABLE "Plant" ALTER COLUMN "typeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PlantType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
