/*
  Warnings:

  - A unique constraint covering the columns `[idReport]` on the table `News` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "idReport" TEXT,
ALTER COLUMN "image_url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "News_idReport_key" ON "News"("idReport");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_idReport_fkey" FOREIGN KEY ("idReport") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
