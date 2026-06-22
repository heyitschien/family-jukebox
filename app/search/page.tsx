import { Suspense } from "react";

import { SearchScreen } from "@/components/search-screen";
import { members } from "@/data/members";
import { getAllTags } from "@/data/songs";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("Search"),
  description: "Find songs, albums, and family artists on Cousin Radio.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl pb-4">
      <Suspense fallback={<div className="p-4 text-[var(--jb-muted)]">Loading search…</div>}>
        <SearchScreen tags={getAllTags()} members={members} />
      </Suspense>
    </main>
  );
}
