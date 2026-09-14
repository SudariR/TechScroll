-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "autoPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qualityScore" INTEGER,
ADD COLUMN     "reviewNotes" JSONB;
