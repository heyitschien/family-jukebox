import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Sparkles, Users } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { SiteHeader } from "@/components/site-header";
import { SongPlayer } from "@/components/song-player";
import { SongVideo } from "@/components/song-video";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSongBySlug, songs } from "@/data/songs";
import { cn } from "@/lib/utils";

type SongPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return songs.map((song) => ({ slug: song.slug }));
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    return { title: "Song not found · Family Jukebox" };
  }

  return {
    title: `${song.title} · Family Jukebox`,
    description: song.subtitle ?? "A family song worth replaying.",
    openGraph: {
      title: song.title,
      description: song.subtitle,
      images: song.coverSrc ? [{ url: song.coverSrc }] : undefined,
    },
  };
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mb-6 inline-flex rounded-full text-amber-900 hover:bg-amber-100",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to jukebox
        </Link>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <CoverImage
            src={song.coverSrc}
            alt={`${song.title} cover`}
            className="aspect-square w-full rounded-[2rem] shadow-md"
          />

          <div className="space-y-6">
            <div>
              {song.featured ? (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-400/30 px-3 py-1 text-sm font-medium text-amber-900">
                  <Sparkles className="size-4" />
                  Featured
                </div>
              ) : null}
              <h1 className="text-4xl font-bold tracking-tight text-amber-950">{song.title}</h1>
              {song.subtitle ? (
                <p className="mt-2 text-lg text-amber-900/75">{song.subtitle}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-amber-900/80">
              <span className="inline-flex items-center gap-2">
                <Users className="size-4" />
                {song.people.join(", ")}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {song.dateCreated}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {song.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full bg-amber-100 text-amber-900"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <SongPlayer title={song.title} audioSrc={song.audioSrc} />

            {song.videoSrc ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-amber-950">Music video</h2>
                <SongVideo videoSrc={song.videoSrc} title={song.title} />
              </section>
            ) : null}
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {song.prompt ? (
            <section className="rounded-3xl border border-amber-200/70 bg-white p-6">
              <h2 className="text-lg font-semibold text-amber-950">Prompt</h2>
              <p className="mt-2 leading-relaxed text-amber-900/80">{song.prompt}</p>
            </section>
          ) : null}

          {song.story ? (
            <section className="rounded-3xl border border-amber-200/70 bg-amber-50/60 p-6">
              <h2 className="text-lg font-semibold text-amber-950">Family memory</h2>
              <p className="mt-2 leading-relaxed text-amber-900/80">{song.story}</p>
            </section>
          ) : null}

          {song.lyrics ? (
            <section className="rounded-3xl border border-amber-200/70 bg-white p-6">
              <h2 className="text-lg font-semibold text-amber-950">Lyrics</h2>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-amber-900/80">
                {song.lyrics}
              </pre>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
