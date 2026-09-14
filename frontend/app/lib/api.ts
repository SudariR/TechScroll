import { ExplainerClip, StoryThread } from '../types/schema';

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
  impactScore?: number;
  impactScope?: string;
  impactHorizon?: string;
  impactReasoning?: string;
  storyKey?: string | null;
  storyLabel?: string | null;
  chapterNumber?: number;
  entities?: string[];
  bridgeScene?: any;
  scenes: unknown;
}

function mapClip(c: ApiClip): ExplainerClip {
  return {
    id: c.id,
    title: c.title,
    hook: c.hook,
    takeaway: c.takeaway,
    category: c.category,
    publishedAt: c.publishedAt,
    autoPublished: c.autoPublished,
    impactScore: c.impactScore,
    impactScope: c.impactScope,
    impactHorizon: c.impactHorizon,
    impactReasoning: c.impactReasoning,
    storyKey: c.storyKey,
    storyLabel: c.storyLabel,
    chapterNumber: c.chapterNumber,
    entities: c.entities,
    bridgeScene: c.bridgeScene,
    scenes: c.scenes as ExplainerClip['scenes'],
  };
}

export async function fetchClips(range: FeedRange = 'today'): Promise<ExplainerClip[]> {
  const res = await fetch(`${BASE}/clips?range=${range}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load clips: ${res.status}`);

  const data: ApiClip[] = await res.json();
  return data.map(mapClip);
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

export async function fetchThreads(): Promise<StoryThread[]> {
  try {
    const res = await fetch(`${BASE}/clips/threads`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchThread(storyKey: string): Promise<ExplainerClip[] | null> {
  try {
    const res = await fetch(`${BASE}/clips/threads/${encodeURIComponent(storyKey)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: ApiClip[] = await res.json();
    if (!data || data.length === 0) return null;
    return data.map(mapClip);
  } catch {
    return null;
  }
}