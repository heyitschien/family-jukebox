"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { MemberFilter } from "@/components/member-filter";
import { SongCard } from "@/components/song-card";
import { SongsByAuthor } from "@/components/songs-by-author";
import { TagFilter } from "@/components/tag-filter";
import { Input } from "@/components/ui/input";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import type { FamilyMember } from "@/data/members";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { isMemberVisibleForAudience, isSongVisibleForAudience } from "@/lib/audience";

type SongGridProps = {
  songs: Song[];
  tags: string[];
  members: FamilyMember[];
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
  groupByAuthor = true,
}: SongGridProps) {
  const { audienceId } = useFamilyAudienceContext();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<string | null>(null);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return songs.filter((song) => {
      const author = getMemberBySlug(song.authorSlug);
      const matchesAudience = isSongVisibleForAudience(song, audienceId);
      const matchesTag = activeTag ? song.tags.includes(activeTag) : true;
      const matchesMember = activeMember ? song.authorSlug === activeMember : true;
      const matchesSearch = normalizedQuery ? matchesQuery(song, normalizedQuery) : true;
      return matchesAudience && matchesTag && matchesMember && matchesSearch;
    });
  }, [activeMember, activeTag, audienceId, query, songs]);

  const visibleMembers = useMemo(
    () => members.filter((member) => isMemberVisibleForAudience(member, audienceId)),
    [audienceId, members],
  );
  const visibleTags = useMemo(
    () => tags.filter((tag) => filteredSongs.some((song) => song.tags.includes(tag))),
    [filteredSongs, tags],
  );
  const hasFilters = Boolean(query || activeTag || activeMember);

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
          members={visibleMembers}
          activeMember={activeMember}
          onMemberChange={setActiveMember}
        />
        <TagFilter tags={visibleTags} activeTag={activeTag} onTagChange={setActiveTag} />
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
