"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AlbumCard } from "@/components/album-card";
import { EmptyState } from "@/components/empty-state";
import { InlineSearch } from "@/components/inline-search";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import type { FamilyMember } from "@/data/members";
import type { Song } from "@/data/songs";
import { filterAlbums, filterSongs } from "@/lib/search";
import { cn } from "@/lib/utils";

type SearchScreenProps = {
  songs: Song[];
  tags: string[];
  members: FamilyMember[];
};

export function SearchScreen({ tags, members }: SearchScreenProps) {
  const { audienceId, audience } = useFamilyAudienceContext();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      memberSlug: activeMember,
      tag: activeTag,
      audienceId,
    }),
    [activeMember, activeTag, audienceId],
  );

  const filteredAlbums = useMemo(() => filterAlbums(query, filters), [filters, query]);
  const filtered = useMemo(() => filterSongs(query, filters), [filters, query]);

  return (
    <div className="min-w-0 space-y-5 px-3 lg:px-0">
      <Topbar />
      <h1 className="text-2xl font-extrabold">Search</h1>
      <p className="-mt-3 text-sm font-bold text-[var(--jb-muted)]">
        {audience
          ? `Showing songs, playlists, and artists for ${audience.label} (${audience.age}).`
          : "Choose a family audience to shape search results."}
      </p>

      <InlineSearch
        value={query}
        onValueChange={setQuery}
        placeholder="Songs, kids, ages, tags..."
        className="[&_form]:border-white/[0.07] [&_form]:bg-white/[0.08]"
      />

      <div className="space-y-2">
        <p className="text-sm font-bold text-[var(--jb-muted)]">Family member</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!activeMember} onClick={() => setActiveMember(null)} label="Everyone" />
          {members.map((m) => (
            <FilterChip
              key={m.slug}
              active={activeMember === m.slug}
              onClick={() => setActiveMember(activeMember === m.slug ? null : m.slug)}
              label={`${m.emoji} ${m.name}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-[var(--jb-muted)]">Tags</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!activeTag} onClick={() => setActiveTag(null)} label="All" />
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              label={tag}
            />
          ))}
        </div>
      </div>

      <div className="pt-2">
        {filteredAlbums.length > 0 ? (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold">Albums</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.slug} album={album} />
              ))}
            </div>
          </div>
        ) : null}

        {filtered.length > 0 ? (
          <>
            <h2 className="mb-3 text-lg font-bold">Songs</h2>
            {filtered.map((song, i) => (
              <SongRow key={song.slug} song={song} index={i} showIndex playlist={filtered} />
            ))}
          </>
        ) : filteredAlbums.length === 0 ? (
          <EmptyState />
        ) : null}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-[13px] font-extrabold whitespace-nowrap transition",
        active
          ? "border-transparent bg-family-accent text-[#1a0812]"
          : "border-white/[0.09] bg-white/[0.07] text-[var(--jb-muted)]",
      )}
    >
      {label}
    </button>
  );
}
