/*
  Warnings:

  - Added the required column `state` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "state" "ReportUpdateType" NOT NULL,
ADD COLUMN     "updateId" TEXT NOT NULL;
