/*
  Warnings:

  - You are about to drop the column `mainImage` on the `Plant` table. All the data in the column will be lost.
  - Added the required column `order` to the `PlantImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "mainImage";

-- AlterTable
ALTER TABLE "PlantImage" ADD COLUMN     "main" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER NOT NULL;
