/*
  Warnings:

  - Added the required column `animal` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "animal" VARCHAR(50) NOT NULL;
