import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Parser from 'rss-parser';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { runQualityChecks } from '../ai/quality-checks';
import { RSS_SOURCES, MIN_CONTENT_WORDS } from './sources';
import { Category, Prisma } from '@prisma/client';
import { extract } from '@extractus/article-extractor';
import { validateExplainer } from '../clips/schemas/validate-explainer';

/** Warnings that indicate a layout or accuracy risk — these block auto-publish. */
const BLOCKING_WARNINGS = new Set([
  'NEAR_LIMIT',
  'HYPE_LANGUAGE',
  'STATISTIC_WITHOUT_NUMBER',
  'HOOK_EQUALS_TAKEAWAY',
  'MISSING_DURATION',
]);

const MIN_AUTO_PUBLISH_IMPACT = 5;

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);
  private readonly parser = new Parser();

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  /** Resolve the best available content for an RSS item, falling back to full-page extraction. */
  private async resolveContent(item: any): Promise<string> {
    const inline = stripHtml(
      item['content:encoded'] ?? item.content ?? item.contentSnippet ?? '',
    );
    if (inline.split(/\s+/).length >= MIN_CONTENT_WORDS) return inline;

    try {
      const page = await extract(item.link);
      return stripHtml(page?.content ?? '');
    } catch {
      return inline;
    }
  }

  /** Pull new articles from RSS. Deduped by the unique sourceUrl column. */
  async fetchArticles(limitPerFeed = 6) {
    let created = 0;

    for (const source of RSS_SOURCES) {
      try {
        const feed = await this.parser.parseURL(source.url);

        for (const item of feed.items.slice(0, limitPerFeed)) {
          if (!item.link) continue;

          const JUNK =
            /disrupt|strictlyvc|is back in|join us|tickets|register now|webinar|podcast/i;
          if (JUNK.test(item.title ?? '')) {
            this.logger.debug(`skip (promo): ${item.title}`);
            continue;
          }

          const content = await this.resolveContent(item);

          const words = content.split(/\s+/).filter(Boolean).length;
          if (words < MIN_CONTENT_WORDS) {
            this.logger.debug(`skip (${words}w): ${item.title}`);
            continue;
          }

          const exists = await this.prisma.article.findUnique({
            where: { sourceUrl: item.link },
          });
          if (exists) {
            this.logger.debug(`skip (dupe): ${item.title}`);
            continue;
          }

          await this.prisma.article.create({
            data: {
              title: item.title ?? 'Untitled',
              source: source.name,
              sourceUrl: item.link,
              content,
              publishedAt: item.isoDate ? new Date(item.isoDate) : null,
            },
          });
          created++;
        }
      } catch (err) {
        this.logger.warn(
          `${source.name} feed failed: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(`Ingested ${created} new articles`);
    return { created };
  }

  /** Generate explainers for articles that don't have one yet. */
  async processPending(limit = 3) {
    const pending = await this.prisma.article.findMany({
      where: { clips: { none: {} } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const results: { id: string; autoPublish: boolean }[] = [];

    for (const article of pending) {
      try {
        const { explainer, model, promptVersion } =
          await this.ai.generateExplainer({
            title: article.title,
            content: article.content,
          });

        // 1. Look up prior published clips with the same storyKey
        const prior = await this.prisma.clip.findMany({
          where: { storyKey: explainer.story.key, published: true },
          orderBy: { publishedAt: 'asc' },
        });

        const chapterNumber = prior.length + 1;
        let bridgeScene: any = null;
        let finalScenes = explainer.scenes;

        // 2. If chapterNumber > 1, generate and insert bridge scene
        if (chapterNumber > 1) {
          const previousTakeaways = prior.slice(-3).map((c) => c.takeaway);
          const bridge = await this.ai.generateBridge({
            storyLabel: explainer.story.label,
            chapterNumber,
            previousTakeaways,
            currentTitle: explainer.title,
            currentHook: explainer.hook,
            currentTakeaway: explainer.takeaway,
          });

          if (bridge) {
            const candidateBridge = {
              id: 'bridge',
              template: 'Bridge' as const,
              icon: 'globe' as const,
              storyLabel: explainer.story.label,
              previously: bridge.previously,
              nowWhat: bridge.nowWhat,
              chapterNumber,
              duration: 7,
            };

            const candidateScenes = [
              explainer.scenes[0],
              candidateBridge,
              ...explainer.scenes.slice(1),
            ];

            try {
              validateExplainer({
                ...explainer,
                scenes: candidateScenes,
              });
              finalScenes = candidateScenes;
              bridgeScene = candidateBridge;
            } catch (err) {
              this.logger.warn(
                `Bridge scene validation failed: ${(err as Error).message}`,
              );
            }
          }
        }

        const explainerForChecks = { ...explainer, scenes: finalScenes };
        const warnings = runQualityChecks(explainerForChecks);
        const blocking = warnings.filter((w) => BLOCKING_WARNINGS.has(w.code));
        const impactOk = explainer.impact.score >= MIN_AUTO_PUBLISH_IMPACT;
        const autoPublish = blocking.length === 0 && impactOk;

        const clip = await this.prisma.clip.create({
          data: {
            articleId: article.id,
            title: explainer.title,
            hook: explainer.hook,
            takeaway: explainer.takeaway,
            category: explainer.category,
            impactScore: explainer.impact.score,
            impactScope: explainer.impact.scope,
            impactHorizon: explainer.impact.horizon,
            impactReasoning: explainer.impact.reasoning,
            storyKey: explainer.story.key,
            storyLabel: explainer.story.label,
            entities: explainer.story.entities,
            chapterNumber,
            bridgeScene: bridgeScene as Prisma.InputJsonValue,
            scenes: finalScenes,
            model,
            promptVersion,
            qualityScore: Math.max(0, 100 - warnings.length * 8),
            reviewNotes: (!impactOk
              ? [
                  ...warnings,
                  {
                    code: 'LOW_IMPACT_SCORE',
                    detail: `impact score ${explainer.impact.score} below threshold ${MIN_AUTO_PUBLISH_IMPACT}`,
                  },
                ]
              : warnings) as unknown as Prisma.InputJsonValue,
            published: autoPublish,
            publishedAt: autoPublish ? new Date() : null,
            autoPublished: autoPublish,
          },
        });

        if (autoPublish) {
          this.logger.log(`AUTO-PUBLISHED: ${clip.title}`);
        } else {
          const reasons: string[] = [];
          if (!impactOk) reasons.push(`impact ${explainer.impact.score}/10`);
          if (blocking.length > 0) reasons.push(...blocking.map((b) => b.code));
          this.logger.log(`HELD (${reasons.join(', ')}): ${clip.title}`);
        }

        results.push({ id: clip.id, autoPublish });
      } catch (err) {
        this.logger.error(
          `Generation failed for "${article.title}": ${(err as Error).message}`,
        );
      }
    }

    return results;
  }

  /** Hourly autonomous cycle. */
  @Cron(CronExpression.EVERY_HOUR)
  async scheduledCycle() {
    this.logger.log('Starting scheduled ingestion cycle');
    await this.fetchArticles(2);
    await this.processPending(2);
  }

  /** Prune unreviewed drafts older than 14 days. */
  @Cron(CronExpression.EVERY_WEEK)
  async pruneStaleDrafts() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const { count } = await this.prisma.clip.deleteMany({
      where: { published: false, featured: false, createdAt: { lt: cutoff } },
    });
    this.logger.log(`Pruned ${count} stale drafts`);
  }
}
