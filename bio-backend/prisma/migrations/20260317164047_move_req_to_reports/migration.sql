/*
  Warnings:

  - You are about to drop the column `requestClose` on the `ReportUpdate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "requestClose" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReportUpdate" DROP COLUMN "requestClose";
