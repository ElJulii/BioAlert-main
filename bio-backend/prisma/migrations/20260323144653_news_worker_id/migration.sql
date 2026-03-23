/*
  Warnings:

  - Added the required column `idWorker` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "idWorker" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_idWorker_fkey" FOREIGN KEY ("idWorker") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
