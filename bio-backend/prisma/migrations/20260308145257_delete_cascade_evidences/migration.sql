-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_reportId_fkey";

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
