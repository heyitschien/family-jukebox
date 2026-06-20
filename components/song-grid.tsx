"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { AgeFilter } from "@/components/age-filter";
import { EmptyState } from "@/components/empty-state";
import { MemberFilter } from "@/components/member-filter";
import { SongCard } from "@/components/song-card";
import { SongsByAuthor } from "@/components/songs-by-author";
import { TagFilter } from "@/components/tag-filter";
import { Input } from "@/components/ui/input";
import type { FamilyMember } from "@/data/members";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";

type SongGridProps = {
  songs: Song[];
  tags: string[];
  members: FamilyMember[];
  ages: number[];
  groupByAuthor?: boolean;
};

function matchesQuery(song: Song, query: string): boolean {
  const author = getMemberBySlug(song.authorSlug);
  const haystack = [
    song.title,
    song.subtitle ?? "",
    author?.name ?? "",
    author?.description ?? "",
    author ? String(author.age) : "",
    author ? `age ${author.age}` : "",
    ...song.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function SongGrid({
  songs,
  tags,
  members,
  ages,
  groupByAuthor = true,
}: SongGridProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [activeAge, setActiveAge] = useState<number | null>(null);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return songs.filter((song) => {
      const author = getMemberBySlug(song.authorSlug);
      const matchesTag = activeTag ? song.tags.includes(activeTag) : true;
      const matchesMember = activeMember ? song.authorSlug === activeMember : true;
      const matchesAge = activeAge ? author?.age === activeAge : true;
      const matchesSearch = normalizedQuery ? matchesQuery(song, normalizedQuery) : true;
      return matchesTag && matchesMember && matchesAge && matchesSearch;
    });
  }, [activeAge, activeMember, activeTag, query, songs]);

  const hasFilters = Boolean(query || activeTag || activeMember || activeAge);

  return (
    <section className="space-y-6">
      <div className="space-y-5">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-amber-700/60" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by song, family member, age, or tag..."
            className="rounded-full border-amber-200 bg-white pl-10"
          />
        </div>
        <MemberFilter
          members={members}
          activeMember={activeMember}
          onMemberChange={setActiveMember}
        />
        <AgeFilter ages={ages} activeAge={activeAge} onAgeChange={setActiveAge} />
        <TagFilter tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
      </div>

      {filteredSongs.length > 0 ? (
        groupByAuthor && !hasFilters ? (
          <SongsByAuthor songs={filteredSongs} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <SongCard key={song.slug} song={song} />
            ))}
          </div>
        )
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
