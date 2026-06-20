import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MemberCard } from "@/components/member-card";
import { SiteHeader } from "@/components/site-header";
import { SongCard } from "@/components/song-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getMemberBySlug, getRoleLabel, members } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";
import { cn } from "@/lib/utils";

type MemberPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) {
    return { title: "Member not found · Family Jukebox" };
  }

  return {
    title: `${member.name} · Family Jukebox`,
    description: member.description,
  };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const memberSongs = getSongsByAuthor(member.slug);

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

        <section className="rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm">
              {member.emoji}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-bold text-amber-950">{member.name}</h1>
                <Badge className="rounded-full bg-white/80 text-amber-900">
                  age {member.age}
                </Badge>
                <Badge className="rounded-full bg-amber-400/40 text-amber-950">
                  {getRoleLabel(member.role)}
                </Badge>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-amber-900/80">
                {member.description}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-5">
          <h2 className="text-2xl font-bold text-amber-950">
            {memberSongs.length} {memberSongs.length === 1 ? "song" : "songs"}
          </h2>
          {memberSongs.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {memberSongs.map((song) => (
                <SongCard key={song.slug} song={song} />
              ))}
            </div>
          ) : (
            <p className="text-amber-900/70">No songs yet — check back after the next music day.</p>
          )}
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold text-amber-950">More family</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {members
              .filter((other) => other.slug !== member.slug)
              .map((other) => (
                <MemberCard key={other.slug} member={other} compact />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}
