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

  findPublished() {
    return this.prisma.clip.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });
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

  remove(id: string) {
    return this.prisma.clip.delete({ where: { id } });
  }
}