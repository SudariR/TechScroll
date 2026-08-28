import { ClipFeed } from "./components/feed/ClipFeed";
import { fetchClips } from "./lib/api";
import { MOCK_FEED } from "./data/mockExplainer";

export const dynamic = "force-dynamic";

export default async function Home() {
  let clips = MOCK_FEED;

  try {
    const live = await fetchClips();
    if (live.length > 0) clips = live;
  } catch {
    // backend unavailable — fall back to mock feed
  }

  return <ClipFeed clips={clips} />;
}
