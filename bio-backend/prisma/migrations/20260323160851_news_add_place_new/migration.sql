/*
  Warnings:

  - You are about to drop the column `place` on the `NewsComment` table. All the data in the column will be lost.
  - Added the required column `place` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "place" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NewsComment" DROP COLUMN "place";
