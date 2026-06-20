import Link from "next/link";
import { Sparkles } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { SongPlayer } from "@/components/song-player";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type FeaturedSongProps = {
  song: Song;
};

export function FeaturedSong({ song }: FeaturedSongProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm sm:p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-400/30 px-3 py-1 text-sm font-medium text-amber-900">
        <Sparkles className="size-4" />
        Featured family anthem
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
        <CoverImage
          src={song.coverSrc}
          alt={`${song.title} cover`}
          className="aspect-square w-full rounded-3xl shadow-md"
        />

        <div className="space-y-5">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">
              {song.title}
            </h2>
            {song.subtitle ? (
              <p className="mt-2 text-lg text-amber-900/75">{song.subtitle}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {song.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full bg-white/80 text-amber-900"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <SongPlayer title={song.title} audioSrc={song.audioSrc} />

          <Link
            href={`/songs/${song.slug}`}
            className={cn(
              buttonVariants(),
              "rounded-full bg-amber-500 text-amber-950 hover:bg-amber-400",
            )}
          >
            Replay the memory
          </Link>
        </div>
      </div>
    </section>
  );
}
