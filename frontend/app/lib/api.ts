import { ExplainerClip } from '../types/schema';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface ApiClip {
  id: string;
  title: string;
  hook: string;
  takeaway: string;
  scenes: unknown;
}

export async function fetchClips(): Promise<ExplainerClip[]> {
  const res = await fetch(`${BASE}/clips`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load clips: ${res.status}`);

  const data: ApiClip[] = await res.json();

  return data.map((c) => ({
    id: c.id,
    title: c.title,
    hook: c.hook,
    takeaway: c.takeaway,
    scenes: c.scenes as ExplainerClip['scenes'],
  }));
}