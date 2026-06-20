"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import type { FamilyMember } from "@/data/members";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type SearchScreenProps = {
  songs: Song[];
  tags: string[];
  members: FamilyMember[];
  ages: number[];
};

function matchesQuery(song: Song, query: string): boolean {
  const author = getMemberBySlug(song.authorSlug);
  const haystack = [
    song.title,
    song.subtitle ?? "",
    author?.name ?? "",
    author ? String(author.age) : "",
    ...song.tags,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function SearchScreen({ songs, tags, members, ages }: SearchScreenProps) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [activeAge, setActiveAge] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return songs.filter((song) => {
      const author = getMemberBySlug(song.authorSlug);
      if (activeTag && !song.tags.includes(activeTag)) return false;
      if (activeMember && song.authorSlug !== activeMember) return false;
      if (activeAge && author?.age !== activeAge) return false;
      if (q && !matchesQuery(song, q)) return false;
      return true;
    });
  }, [activeAge, activeMember, activeTag, query, songs]);

  return (
    <div className="min-w-0 space-y-5 px-3 lg:px-0">
      <Topbar />
      <h1 className="text-2xl font-extrabold">Search</h1>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--jb-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, kids, ages, tags..."
          className="w-full rounded-full border border-white/[0.07] bg-white/[0.08] py-3 pr-4 pl-11 text-[var(--jb-text)] outline-none placeholder:text-[var(--jb-muted-2)] focus:border-[rgba(255,111,177,0.45)]"
        />
      </div>

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
        <p className="text-sm font-bold text-[var(--jb-muted)]">Age</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!activeAge} onClick={() => setActiveAge(null)} label="All ages" />
          {ages.map((age) => (
            <FilterChip
              key={age}
              active={activeAge === age}
              onClick={() => setActiveAge(activeAge === age ? null : age)}
              label={String(age)}
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
        {filtered.length > 0 ? (
          filtered.map((song, i) => <SongRow key={song.slug} song={song} index={i} showIndex />)
        ) : (
          <EmptyState />
        )}
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
