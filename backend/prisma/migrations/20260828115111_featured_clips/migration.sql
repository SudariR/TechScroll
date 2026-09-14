-- DropIndex
DROP INDEX "Clip_published_publishedAt_idx";

-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Clip_published_featured_publishedAt_idx" ON "Clip"("published", "featured", "publishedAt");
