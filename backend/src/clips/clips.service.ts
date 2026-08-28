import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class ClipsService {
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

    return this.prisma.clip.create({
      data: {
        articleId: article.id,
        title: result.explainer.title,
        hook: result.explainer.hook,
        takeaway: result.explainer.takeaway,
        category: result.explainer.category as Category,
        scenes: result.explainer.scenes as unknown as Prisma.InputJsonValue,
        model: result.model,
        promptVersion: result.promptVersion,
      },
    });
  }

  async findPublished(range: 'today' | 'week' | 'all' = 'today') {
    const since = new Date();
    if (range === 'today') since.setHours(0, 0, 0, 0);
    else if (range === 'week') since.setDate(since.getDate() - 7);

    const where =
      range === 'all'
        ? { published: true }
        : { published: true, publishedAt: { gte: since } };

    const clips = await this.prisma.clip.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      take: 30,
      select: {
        id: true, title: true, hook: true, takeaway: true,
        category: true, scenes: true, publishedAt: true,
        autoPublished: true,
      },
    });

    // Never return a near-empty feed — widen to all-time as a fallback.
    if (clips.length < 3 && range !== 'all') {
      return this.prisma.clip.findMany({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
        take: 30,
        select: {
          id: true, title: true, hook: true, takeaway: true,
          category: true, scenes: true, publishedAt: true,
          autoPublished: true,
        },
      });
    }

    return clips;
  }

  async countsByRange() {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);

    const [today, week, all] = await Promise.all([
      this.prisma.clip.count({ where: { published: true, publishedAt: { gte: startOfDay } } }),
      this.prisma.clip.count({ where: { published: true, publishedAt: { gte: weekAgo } } }),
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