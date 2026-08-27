import { ClipFeed } from "./components/feed/ClipFeed";
import { MOCK_FEED } from "./data/mockExplainer";

export default function Home() {
  return <ClipFeed clips={MOCK_FEED} />;
}
