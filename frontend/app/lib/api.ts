import { ExplainerClip } from '../types/schema';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export type FeedRange = 'today' | 'week' | 'all';

interface ApiClip {
  id: string;
  title: string;
  hook: string;
  takeaway: string;
  category?: string;
  publishedAt?: string;
  autoPublished?: boolean;
  scenes: unknown;
}

export async function fetchClips(range: FeedRange = 'today'): Promise<ExplainerClip[]> {
  const res = await fetch(`${BASE}/clips?range=${range}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load clips: ${res.status}`);

  const data: ApiClip[] = await res.json();

  return data.map((c) => ({
    id: c.id,
    title: c.title,
    hook: c.hook,
    takeaway: c.takeaway,
    category: c.category,
    publishedAt: c.publishedAt,
    autoPublished: c.autoPublished,
    scenes: c.scenes as ExplainerClip['scenes'],
  }));
}

export async function fetchClipCounts(): Promise<{ today: number; week: number; all: number }> {
  try {
    const res = await fetch(`${BASE}/clips/counts`, { cache: 'no-store' });
    if (!res.ok) return { today: 0, week: 0, all: 0 };
    return await res.json();
  } catch {
    return { today: 0, week: 0, all: 0 };
  }
}