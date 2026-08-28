import { ClipFeed } from '../components/feed/ClipFeed';
import { fetchClips, fetchClipCounts, FeedRange } from '../lib/api';
import { MOCK_FEED } from '../data/mockExplainer';

export const dynamic = 'force-dynamic';

interface FeedPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams;
  const rawRange = params?.range;
  const range: FeedRange =
    rawRange === 'week' || rawRange === 'all' || rawRange === 'today'
      ? rawRange
      : 'today';

  let clips = MOCK_FEED;
  let counts = { today: 0, week: 0, all: 0 };

  try {
    const [liveClips, liveCounts] = await Promise.all([
      fetchClips(range),
      fetchClipCounts(),
    ]);
    clips = liveClips;
    counts = liveCounts;
  } catch {
    // If backend is unreachable, fallback to MOCK_FEED and default counts
  }

  return <ClipFeed clips={clips} range={range} counts={counts} />;
}