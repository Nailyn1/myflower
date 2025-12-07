/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the column `plantId` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the `TagAssignment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[plantId,order]` on the table `PlantImage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TagAssignment" DROP CONSTRAINT "TagAssignment_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_plantId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "createdAt",
DROP COLUMN "plantId";

-- DropTable
DROP TABLE "TagAssignment";

-- CreateTable
CREATE TABLE "_PlantTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlantTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlantTags_B_index" ON "_PlantTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "PlantImage_plantId_order_key" ON "PlantImage"("plantId", "order");

-- AddForeignKey
ALTER TABLE "_PlantTags" ADD CONSTRAINT "_PlantTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantTags" ADD CONSTRAINT "_PlantTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
