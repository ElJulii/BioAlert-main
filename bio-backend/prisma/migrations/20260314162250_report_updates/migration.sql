/*
  Warnings:

  - The primary key for the `Evidence` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Evidence` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReportUpdateType" AS ENUM ('USER_RESPONSE', 'REQUEST_INFO', 'PROGRESS_UPDATE', 'REQUEST_CLOSE', 'CLOSE_APPROVED', 'CLOSE_REJECTED', 'STATUS_CHANGE');

-- AlterTable
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ReportUpdate" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorRole" "UserRole" NOT NULL,
    "type" "ReportUpdateType" NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestClose" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReportUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportUpdate" ADD CONSTRAINT "ReportUpdate_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportUpdate" ADD CONSTRAINT "ReportUpdate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
