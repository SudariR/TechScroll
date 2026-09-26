-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "impactHorizon" TEXT,
ADD COLUMN     "impactReasoning" TEXT,
ADD COLUMN     "impactScope" TEXT,
ADD COLUMN     "impactScore" INTEGER NOT NULL DEFAULT 5;

-- CreateIndex
CREATE INDEX "Clip_published_impactScore_publishedAt_idx" ON "Clip"("published", "impactScore", "publishedAt");
