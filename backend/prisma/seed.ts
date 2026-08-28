import { PrismaClient, Category } from '@prisma/client';
import { MOCK_FEED } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  for (const clip of MOCK_FEED) {
    const article = await prisma.article.create({
      data: {
        title: clip.title,
        source: 'Seed',
        content: clip.hook,
      },
    });

    await prisma.clip.create({
      data: {
        articleId: article.id,
        title: clip.title,
        hook: clip.hook,
        takeaway: clip.takeaway,
        category: clip.category as Category,
        scenes: clip.scenes as any,
        published: true,
        publishedAt: new Date(),
        model: 'seed',
        promptVersion: 'seed',
      },
    });
  }
  console.log(`seeded ${MOCK_FEED.length} clips`);
}

main().finally(() => prisma.$disconnect());