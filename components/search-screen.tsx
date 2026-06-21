"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { AlbumCard } from "@/components/album-card";
import { EmptyState } from "@/components/empty-state";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import {
  getAlbumCreator,
  getAlbumSongs,
  getAlbumTags,
  type Album,
} from "@/data/albums";
import type { FamilyMember } from "@/data/members";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type SearchScreenProps = {
  songs: Song[];
  albums: Album[];
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

function matchesAlbumQuery(album: Album, query: string): boolean {
  const creator = getAlbumCreator(album);
  const haystack = [
    album.title,
    album.subtitle,
    album.description,
    creator?.name ?? "",
    ...getAlbumSongs(album).map((song) => song.title),
    ...getAlbumTags(album),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function SearchScreen({ songs, albums, tags, members, ages }: SearchScreenProps) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [activeAge, setActiveAge] = useState<number | null>(null);

  const filteredSongs = useMemo(() => {
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

  const filteredAlbums = useMemo(() => {
    const q = query.trim().toLowerCase();
    return albums.filter((album) => {
      const creator = getAlbumCreator(album);
      const albumTags = getAlbumTags(album);
      if (activeTag && !albumTags.includes(activeTag)) return false;
      if (activeMember && album.memberSlug !== activeMember) return false;
      if (activeAge && creator?.age !== activeAge) return false;
      if (q && !matchesAlbumQuery(album, q)) return false;
      return true;
    });
  }, [activeAge, activeMember, activeTag, albums, query]);

  const hasResults = filteredAlbums.length > 0 || filteredSongs.length > 0;

  return (
    <div className="min-w-0 space-y-5 px-3 lg:px-0">
      <Topbar />
      <h1 className="text-2xl font-extrabold">Search</h1>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--jb-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, albums, kids, ages, tags..."
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

      {filteredAlbums.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold">Albums</h2>
            <p className="text-sm text-[var(--jb-muted)]">
              Search now matches creator collections as well as songs.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAlbums.map((album) => (
              <AlbumCard key={album.slug} album={album} compact />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3 pt-2">
        <div>
          <h2 className="text-lg font-bold">Songs</h2>
          <p className="text-sm text-[var(--jb-muted)]">Keep searching by track, tag, age, or creator.</p>
        </div>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, i) => (
            <SongRow key={song.slug} song={song} index={i} showIndex playlist={filteredSongs} />
          ))
        ) : hasResults ? (
          <EmptyState
            title="No songs match those filters"
            description="Albums may still match even when individual tracks do not."
          />
        ) : (
          <EmptyState title="Nothing matched" description="Try a different creator, tag, or album title." />
        )}
      </section>
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
