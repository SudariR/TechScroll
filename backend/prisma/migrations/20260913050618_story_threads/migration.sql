-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "bridgeScene" JSONB,
ADD COLUMN     "chapterNumber" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "entities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "storyKey" TEXT,
ADD COLUMN     "storyLabel" TEXT;

-- CreateIndex
CREATE INDEX "Clip_storyKey_publishedAt_idx" ON "Clip"("storyKey", "publishedAt");
