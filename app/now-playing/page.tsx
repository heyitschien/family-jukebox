import { NowPlayingScreen } from "@/components/now-playing-screen";
import { Topbar } from "@/components/topbar";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("Now Playing"),
  description: "See what is playing and browse the current queue.",
  path: "/now-playing",
});

export default function NowPlayingPage() {
  return (
    <div className="min-w-0">
      <Topbar />
      <NowPlayingScreen />
    </div>
  );
}
