"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type CSSProperties } from "react";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { useSongPlayback } from "@/hooks/use-song-playback";
import type { Album } from "@/lib/albums";
import { cn } from "@/lib/utils";

type AlbumHeroProps = {
  albums: Album[];
  featuredAlbumSlug: string;
  familyQueue: Song[];
};

type AlbumTrackButtonProps = {
  song: Song;
  playlist: Song[];
  index: number;
};

function getVisualOffset(index: number, selectedIndex: number, total: number): number {
  if (total === 0) return 0;
  let offset = index - selectedIndex;
  const half = total / 2;
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

function AlbumTrackButton({ song, playlist, index }: AlbumTrackButtonProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist });

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "grid min-h-14 grid-cols-[32px_1fr_auto] items-center gap-3 rounded-2xl border px-3 py-2 text-left transition",
        isCurrent
          ? "border-[rgba(255,111,177,0.38)] bg-white/[0.09]"
          : "border-white/[0.06] bg-white/[0.045] hover:bg-white/[0.08]",
      )}
    >
      <span className="text-center text-sm font-black text-[var(--jb-muted)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate text-sm font-extrabold",
            isCurrent && "text-[var(--family-pink)]",
          )}
        >
          {song.title}
        </span>
        <span className="block truncate text-xs text-[var(--jb-muted)]">
          {song.tags.slice(0, 3).join(" · ")}
        </span>
      </span>
      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-white">
        {playing ? "Pause" : "Play"}
      </span>
    </button>
  );
}

function AlbumCover({ album, className }: { album: Album; className?: string }) {
  if (!album.coverSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[#2a3545] to-[#121820] text-6xl",
          className,
        )}
      >
        {album.member.emoji}
      </div>
    );
  }

  return <CoverImage src={album.coverSrc} alt="" className={className} />;
}

export function AlbumHero({ albums, featuredAlbumSlug, familyQueue }: AlbumHeroProps) {
  const initialSlug = albums.some((album) => album.slug === featuredAlbumSlug)
    ? featuredAlbumSlug
    : albums[0]?.slug;
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const { currentSong, isPlaying, playQueue, togglePlay } = usePlayer();

  const selectedIndex = Math.max(
    0,
    albums.findIndex((album) => album.slug === selectedSlug),
  );
  const selectedAlbum = albums[selectedIndex] ?? albums[0];

  const activeAlbumSlug = currentSong?.authorSlug;
  const selectedIsCurrent = selectedAlbum?.memberSlug === activeAlbumSlug;
  const selectedIsPlaying = selectedIsCurrent && isPlaying;

  const totalTracks = useMemo(
    () => albums.reduce((total, album) => total + album.trackCount, 0),
    [albums],
  );

  const playSelectedAlbum = useCallback(() => {
    if (!selectedAlbum || selectedAlbum.songs.length === 0) return;
    if (selectedIsCurrent) {
      togglePlay();
      return;
    }
    playQueue(selectedAlbum.songs, 0);
  }, [playQueue, selectedAlbum, selectedIsCurrent, togglePlay]);

  const selectAndPlayAlbum = useCallback(
    (album: Album) => {
      setSelectedSlug(album.slug);
      if (album.songs.length > 0) {
        playQueue(album.songs, 0);
      }
    },
    [playQueue],
  );

  if (!selectedAlbum) {
    return null;
  }

  return (
    <section className="relative -mx-3 overflow-hidden rounded-b-[34px] border border-white/[0.08] bg-[rgba(8,12,18,0.88)] shadow-[0_20px_60px_rgba(0,0,0,0.38)] sm:mx-0 sm:rounded-[34px]">
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background:
            `radial-gradient(circle at 72% 28%, ${selectedAlbum.glow}, transparent 34%), ` +
            `radial-gradient(circle at 12% 12%, rgba(108,183,255,0.17), transparent 30%), ` +
            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        }}
      />
      <div className="relative z-10 grid gap-7 p-5 sm:p-7 lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
        <div className="flex min-h-[390px] flex-col justify-end lg:min-h-[520px]">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
            Album landing · {albums.length} creators · {totalTracks} songs
          </span>
          <h1 className="text-[clamp(46px,10vw,90px)] leading-[0.88] font-black tracking-[-0.075em]">
            Family albums, ready to play.
          </h1>
          <p className="mt-5 max-w-[620px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
            The songs are now grouped into creator albums: tap a cover, hear that family member&apos;s
            queue, and keep the music moving from the landing page.
          </p>

          <div className="mt-6 rounded-[26px] border border-white/[0.08] bg-black/20 p-4 backdrop-blur">
            <p className="text-xs font-black tracking-[0.2em] text-[var(--family-ocean)] uppercase">
              Featured album
            </p>
            <div className="mt-3 flex items-start gap-4">
              <AlbumCover
                album={selectedAlbum}
                className="size-20 shrink-0 rounded-2xl shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl leading-tight font-black tracking-tight">
                  {selectedAlbum.title}
                </h2>
                <p className="mt-1 text-sm font-bold text-[var(--family-pink)]">
                  Made for {selectedAlbum.member.name}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--jb-muted)]">
                  {selectedAlbum.description}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PlayIconButton
                size="xl"
                playing={selectedIsPlaying}
                label={selectedIsPlaying ? `Pause ${selectedAlbum.title}` : `Play ${selectedAlbum.title}`}
                onClick={playSelectedAlbum}
              />
              <button
                type="button"
                onClick={() => playQueue(familyQueue, 0)}
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--jb-text)] px-5 py-3 text-sm font-black text-[#050608] [-webkit-tap-highlight-color:transparent]"
              >
                Play family mix
              </button>
              <Link
                href={`/members/${selectedAlbum.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] [-webkit-tap-highlight-color:transparent] hover:text-white"
              >
                Open album
              </Link>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="relative overflow-x-auto pb-3 scrollbar-none lg:h-[430px] lg:overflow-visible lg:pb-0 [perspective:1200px]">
            <div className="flex min-w-max gap-4 py-4 lg:block lg:min-w-0">
              {albums.map((album, index) => {
                const offset = getVisualOffset(index, selectedIndex, albums.length);
                const isSelected = album.slug === selectedAlbum.slug;
                const isActive = album.slug === activeAlbumSlug;
                const cardStyle: CSSProperties = {
                  left: `calc(50% - 132px + ${offset * 92}px)`,
                  top: `${58 + Math.abs(offset) * 20}px`,
                  zIndex: 20 - Math.abs(offset),
                  transform: isSelected
                    ? "translate3d(0, 0, 78px) rotateY(0deg) rotateZ(0deg) scale(1.04)"
                    : `translate3d(${offset * 6}px, ${Math.abs(offset) * 8}px, ${-Math.abs(offset) * 80}px) rotateY(${offset * -18}deg) rotateZ(${offset * 3}deg) scale(${Math.max(0.78, 0.94 - Math.abs(offset) * 0.055)})`,
                  transformStyle: "preserve-3d",
                  borderColor: isActive ? "rgba(255,111,177,0.62)" : "rgba(255,255,255,0.1)",
                  boxShadow: isSelected
                    ? `0 28px 80px ${album.glow}`
                    : "0 20px 46px rgba(0,0,0,0.34)",
                };

                return (
                  <button
                    key={album.slug}
                    type="button"
                    onClick={() => selectAndPlayAlbum(album)}
                    className={cn(
                      "group relative h-[300px] w-[226px] shrink-0 overflow-hidden rounded-[30px] border bg-[#151d28] p-3 text-left transition duration-300 [-webkit-tap-highlight-color:transparent] lg:absolute lg:h-[340px] lg:w-[264px]",
                      isSelected ? "opacity-100" : "opacity-85 hover:opacity-100",
                    )}
                    style={cardStyle}
                    aria-pressed={isSelected}
                  >
                    <div className="relative h-full overflow-hidden rounded-[24px]">
                      <AlbumCover album={album} className="size-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-white/10" />
                      <div className="absolute top-3 left-3 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                        {album.trackCount} {album.trackCount === 1 ? "song" : "songs"}
                      </div>
                      <div className="absolute right-3 top-3 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                        {album.member.emoji}
                      </div>
                      <div className="absolute right-4 bottom-4 left-4">
                        <p className="text-xs font-black tracking-[0.18em] text-white/65 uppercase">
                          {album.member.name}
                        </p>
                        <h3 className="mt-1 text-2xl leading-none font-black tracking-tight text-white">
                          {album.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed font-bold text-white/72">
                          {album.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 rounded-[26px] border border-white/[0.07] bg-white/[0.055] p-4">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  {selectedAlbum.member.name}&apos;s tracklist
                </h2>
                <p className="text-sm font-bold text-[var(--jb-muted)]">
                  Tap a song to start this album from that track.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-[var(--family-ocean)]">
                {selectedAlbum.trackCount} tracks
              </span>
            </div>
            <div className="grid gap-2">
              {selectedAlbum.songs.length > 0 ? (
                selectedAlbum.songs.map((song, index) => (
                  <AlbumTrackButton
                    key={song.slug}
                    song={song}
                    playlist={selectedAlbum.songs}
                    index={index}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-white/[0.06] bg-white/[0.045] p-4 text-sm font-bold text-[var(--jb-muted)]">
                  No songs yet. This album will fill automatically when new songs are added.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
