"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { SongCard } from "@/components/song-card";
import { TagFilter } from "@/components/tag-filter";
import { Input } from "@/components/ui/input";
import type { Song } from "@/data/songs";

type SongGridProps = {
  songs: Song[];
  tags: string[];
};

function matchesQuery(song: Song, query: string): boolean {
  const haystack = [
    song.title,
    song.subtitle ?? "",
    ...song.people,
    ...song.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function SongGrid({ songs, tags }: SongGridProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return songs.filter((song) => {
      const matchesTag = activeTag ? song.tags.includes(activeTag) : true;
      const matchesSearch = normalizedQuery ? matchesQuery(song, normalizedQuery) : true;
      return matchesTag && matchesSearch;
    });
  }, [activeTag, query, songs]);

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-amber-700/60" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, person, or tag..."
            className="rounded-full border-amber-200 bg-white pl-10"
          />
        </div>
        <TagFilter tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
      </div>

      {filteredSongs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <SongCard key={song.slug} song={song} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
