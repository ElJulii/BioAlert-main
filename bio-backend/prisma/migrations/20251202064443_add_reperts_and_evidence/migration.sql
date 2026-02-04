-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "analysisResult" JSONB,
ADD COLUMN     "analysisStatus" TEXT DEFAULT 'pending';
