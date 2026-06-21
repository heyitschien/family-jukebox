import { Suspense } from "react";

import { SearchScreen } from "@/components/search-screen";
import { albums } from "@/data/albums";
import { getAllAges, members } from "@/data/members";
import { getAllTags, songs } from "@/data/songs";

export default function SearchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl pb-4">
      <Suspense fallback={<div className="p-4 text-[var(--jb-muted)]">Loading search…</div>}>
        <SearchScreen
          songs={songs}
          albums={albums}
          tags={getAllTags()}
          members={members}
          ages={getAllAges()}
        />
      </Suspense>
    </main>
  );
}
