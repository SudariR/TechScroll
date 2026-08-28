import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Parser from 'rss-parser';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { runQualityChecks } from '../ai/quality-checks';
import { RSS_SOURCES, MIN_CONTENT_WORDS } from './sources';
import { Category, Prisma } from '@prisma/client';
import { extract } from '@extractus/article-extractor';

/** Warnings that indicate a layout or accuracy risk — these block auto-publish. */
const BLOCKING_WARNINGS = new Set([
    'NEAR_LIMIT',
    'HYPE_LANGUAGE',
    'STATISTIC_WITHOUT_NUMBER',
    'HOOK_EQUALS_TAKEAWAY',
    'MISSING_DURATION',
]);

const stripHtml = (s: string) =>
    s.replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();

@Injectable()
export class IngestService {
    private readonly logger = new Logger(IngestService.name);
    private readonly parser = new Parser();

    constructor(private prisma: PrismaService, private ai: AiService) { }

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

                    const JUNK = /disrupt|strictlyvc|is back in|join us|tickets|register now|webinar|podcast/i;
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

                    const exists = await this.prisma.article.findUnique({ where: { sourceUrl: item.link } });
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
                this.logger.warn(`${source.name} feed failed: ${(err as Error).message}`);
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
                const { explainer, model, promptVersion } = await this.ai.generateExplainer({
                    title: article.title,
                    content: article.content,
                });

                const warnings = runQualityChecks(explainer);
                const blocking = warnings.filter((w) => BLOCKING_WARNINGS.has(w.code));
                const autoPublish = blocking.length === 0;

                const clip = await this.prisma.clip.create({
                    data: {
                        articleId: article.id,
                        title: explainer.title,
                        hook: explainer.hook,
                        takeaway: explainer.takeaway,
                        category: explainer.category as Category,
                        scenes: explainer.scenes as unknown as Prisma.InputJsonValue,
                        model,
                        promptVersion,
                        qualityScore: Math.max(0, 100 - warnings.length * 8),
                        reviewNotes: warnings as unknown as Prisma.InputJsonValue,
                        published: autoPublish,
                        publishedAt: autoPublish ? new Date() : null,
                        autoPublished: autoPublish,
                    },
                });

                this.logger.log(
                    `${autoPublish ? 'AUTO-PUBLISHED' : 'HELD FOR REVIEW'}: ${clip.title}` +
                    (blocking.length ? ` (${blocking.map((b) => b.code).join(', ')})` : ''),
                );

                results.push({ id: clip.id, autoPublish });
            } catch (err) {
                this.logger.error(`Generation failed for "${article.title}": ${(err as Error).message}`);
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