import Link from "next/link";
import { CalendarDays, Play, UserRound } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { FavoriteButton } from "@/components/favorite-button";
import { Badge } from "@/components/ui/badge";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  const author = getMemberBySlug(song.authorSlug);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-amber-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <FavoriteButton
        song={song}
        size="sm"
        variant="floating"
        className="absolute right-3 top-3 z-10"
      />
      <Link href={`/songs/${song.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden">
          <CoverImage
            src={song.coverSrc}
            alt={`${song.title} cover`}
            className="size-full transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <span className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/95 text-amber-900 shadow opacity-0 transition group-hover:opacity-100">
            <Play className="size-4 fill-current" />
          </span>
          {song.featured ? (
            <Badge className="absolute left-3 top-3 border-0 bg-amber-400 text-amber-950 hover:bg-amber-400">
              Featured
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="text-lg font-bold leading-tight text-amber-950">{song.title}</h3>
            {song.subtitle ? (
              <p className="mt-1 line-clamp-2 text-sm text-amber-900/70">{song.subtitle}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-800/70">
            {author ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-900 ring-1 ring-amber-200/80">
                <UserRound className="size-3.5" />
                {author.name}, {author.age}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {song.dateCreated}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap gap-1.5">
            {song.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full bg-amber-100 text-amber-900 hover:bg-amber-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
