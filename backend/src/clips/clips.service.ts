import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Category, Prisma } from '@prisma/client';
import { validateExplainer } from './schemas/validate-explainer';

const CLIP_PUBLIC_SELECT = {
  id: true,
  title: true,
  hook: true,
  takeaway: true,
  category: true,
  scenes: true,
  publishedAt: true,
  autoPublished: true,
  impactScore: true,
  impactScope: true,
  impactHorizon: true,
  impactReasoning: true,
  storyKey: true,
  storyLabel: true,
  chapterNumber: true,
  entities: true,
  bridgeScene: true,
} as const;

@Injectable()
export class ClipsService {
  private readonly logger = new Logger(ClipsService.name);

  constructor(private prisma: PrismaService, private ai: AiService) {}

  async generate(input: { title: string; source: string; content: string; sourceUrl?: string }) {
    const article = await this.prisma.article.create({
      data: {
        title: input.title,
        source: input.source,
        content: input.content,
        sourceUrl: input.sourceUrl,
      },
    });

    const result = await this.ai.generateExplainer({
      title: input.title,
      content: input.content,
    });

    const prior = await this.prisma.clip.findMany({
      where: { storyKey: result.explainer.story.key, published: true },
      orderBy: { publishedAt: 'asc' },
    });

    const chapterNumber = prior.length + 1;
    let bridgeScene: any = null;
    let finalScenes = result.explainer.scenes;

    if (chapterNumber > 1) {
      const previousTakeaways = prior.slice(-3).map((c) => c.takeaway);
      const bridge = await this.ai.generateBridge({
        storyLabel: result.explainer.story.label,
        chapterNumber,
        previousTakeaways,
        currentTitle: result.explainer.title,
        currentHook: result.explainer.hook,
        currentTakeaway: result.explainer.takeaway,
      });

      if (bridge) {
        const candidateBridge = {
          id: 'bridge',
          template: 'Bridge' as const,
          icon: 'globe' as const,
          storyLabel: result.explainer.story.label,
          previously: bridge.previously,
          nowWhat: bridge.nowWhat,
          chapterNumber,
          duration: 7,
        };

        const candidateScenes = [
          result.explainer.scenes[0],
          candidateBridge,
          ...result.explainer.scenes.slice(1),
        ];

        try {
          validateExplainer({
            ...result.explainer,
            scenes: candidateScenes,
          });
          finalScenes = candidateScenes as any;
          bridgeScene = candidateBridge;
        } catch (err) {
          this.logger.warn(`Bridge scene validation failed in generate: ${(err as Error).message}`);
        }
      }
    }

    return this.prisma.clip.create({
      data: {
        articleId: article.id,
        title: result.explainer.title,
        hook: result.explainer.hook,
        takeaway: result.explainer.takeaway,
        category: result.explainer.category as Category,
        impactScore: result.explainer.impact.score,
        impactScope: result.explainer.impact.scope,
        impactHorizon: result.explainer.impact.horizon,
        impactReasoning: result.explainer.impact.reasoning,
        storyKey: result.explainer.story.key,
        storyLabel: result.explainer.story.label,
        entities: result.explainer.story.entities,
        chapterNumber,
        bridgeScene: bridgeScene as Prisma.InputJsonValue,
        scenes: finalScenes as unknown as Prisma.InputJsonValue,
        model: result.model,
        promptVersion: result.promptVersion,
      },
    });
  }

  async findPublished(range: 'today' | 'week' | 'all' = 'today') {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    let where: Prisma.ClipWhereInput;
    if (range === 'today') {
      where = { published: true, publishedAt: { gte: startOfDay } };
    } else if (range === 'week') {
      where = { published: true, publishedAt: { gte: weekAgo, lt: startOfDay } };
    } else {
      where = { published: true };
    }

    const clips = await this.prisma.clip.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { impactScore: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: 30,
      select: CLIP_PUBLIC_SELECT,
    });

    // Never return a near-empty feed — widen to all-time as a fallback.
    if (clips.length < 3 && range !== 'all') {
      return this.prisma.clip.findMany({
        where: { published: true },
        orderBy: [
          { featured: 'desc' },
          { impactScore: 'desc' },
          { publishedAt: 'desc' },
        ],
        take: 30,
        select: CLIP_PUBLIC_SELECT,
      });
    }

    return clips;
  }

  async findThreads(limit = 12) {
    const publishedClips = await this.prisma.clip.findMany({
      where: {
        published: true,
        storyKey: { not: null },
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        storyKey: true,
        storyLabel: true,
        impactScore: true,
        publishedAt: true,
        entities: true,
        title: true,
      },
    });

    const threadMap = new Map<
      string,
      {
        storyKey: string;
        storyLabel: string;
        chapterCount: number;
        latestPublishedAt: Date;
        topImpactScore: number;
        entities: string[];
        latestTitle: string;
      }
    >();

    for (const clip of publishedClips) {
      if (!clip.storyKey) continue;

      const existing = threadMap.get(clip.storyKey);
      if (!existing) {
        threadMap.set(clip.storyKey, {
          storyKey: clip.storyKey,
          storyLabel: clip.storyLabel ?? clip.storyKey,
          chapterCount: 1,
          latestPublishedAt: clip.publishedAt ?? new Date(0),
          topImpactScore: clip.impactScore,
          entities: clip.entities,
          latestTitle: clip.title,
        });
      } else {
        existing.chapterCount += 1;
        if (clip.impactScore > existing.topImpactScore) {
          existing.topImpactScore = clip.impactScore;
        }
      }
    }

    const threads = Array.from(threadMap.values())
      .filter((t) => t.chapterCount >= 2)
      .sort((a, b) => b.latestPublishedAt.getTime() - a.latestPublishedAt.getTime())
      .slice(0, limit);

    return threads;
  }

  async findThread(storyKey: string) {
    return this.prisma.clip.findMany({
      where: {
        published: true,
        storyKey,
      },
      orderBy: { publishedAt: 'asc' },
      select: CLIP_PUBLIC_SELECT,
    });
  }

  async countsByRange() {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);

    const [today, week, all] = await Promise.all([
      this.prisma.clip.count({ where: { published: true, publishedAt: { gte: startOfDay } } }),
      this.prisma.clip.count({ where: { published: true, publishedAt: { gte: weekAgo, lt: startOfDay } } }),
      this.prisma.clip.count({ where: { published: true } }),
    ]);

    return { today, week, all };
  }

  findAll() {
    return this.prisma.clip.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  }

  publish(id: string) {
    return this.prisma.clip.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
    });
  }

  async toggleFeature(id: string) {
    const clip = await this.prisma.clip.findUniqueOrThrow({ where: { id } });
    return this.prisma.clip.update({
      where: { id },
      data: { featured: !clip.featured },
    });
  }

  remove(id: string) {
    return this.prisma.clip.delete({ where: { id } });
  }
}