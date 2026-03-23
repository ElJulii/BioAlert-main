/*
  Warnings:

  - Added the required column `place` to the `NewsComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsComment" ADD COLUMN     "place" TEXT NOT NULL;
