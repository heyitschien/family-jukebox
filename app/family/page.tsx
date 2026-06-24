import Link from "next/link";

import { BrandAccentIcon } from "@/components/brand/brand-accent-icon";
import { MemberCircle } from "@/components/member-circle";
import { Topbar } from "@/components/topbar";
import { getRoleLabel, members, shouldShowMemberAge } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("Family artists"),
  description:
    "Meet the cousins who make the music — Eliana, Solene, Ocean, Marceline, Tia Evelyn, Mama, and the whole crew.",
  path: "/family",
});

export default function FamilyPage() {
  const girls = members.filter((m) => m.role === "girl");
  const others = members.filter((m) => m.role !== "girl");

  return (
    <main className="min-w-0 space-y-6 px-3 pb-4 lg:px-0">
      <Topbar />
      <header className="px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Cousin Radio</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[var(--jb-muted)]">
          <BrandAccentIcon icon="users" />
          Family artists on Cousin Radio
        </p>
      </header>

      <section className="jb-float-panel p-4 sm:p-5">
        <h2 className="text-xl font-bold">Our girls</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {girls.map((member) => (
            <MemberCircle key={member.slug} member={member} />
          ))}
        </div>
      </section>

      <section className="jb-float-panel p-4 sm:p-5">
        <h2 className="text-xl font-bold">Tia Evelyn</h2>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">Gold in the Tile — new album, more songs coming</p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {members
            .filter((m) => m.slug === "evelyn")
            .map((member) => (
              <MemberCircle key={member.slug} member={member} />
            ))}
        </div>
      </section>

      <section className="jb-float-panel p-4 sm:p-5">
        <h2 className="text-xl font-bold">Mama</h2>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">Cornerstone at the Kitchen Table — new album, more songs coming</p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {members
            .filter((m) => m.slug === "maria")
            .map((member) => (
              <MemberCircle key={member.slug} member={member} />
            ))}
        </div>
      </section>

      <section className="jb-float-panel p-4 sm:p-5">
        <h2 className="text-xl font-bold">Ocean & Tio Chien</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {others.map((member) => (
            <MemberCircle key={member.slug} member={member} />
          ))}
        </div>
      </section>

      <section className="jb-float-panel p-2 sm:p-3">
        <h2 className="px-2 pt-2 text-xl font-bold">Everyone</h2>
        {members.map((member) => {
          const count = getSongsByAuthor(member.slug).length;
          return (
            <Link
              key={member.slug}
              href={`/members/${member.slug}`}
              className="flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-white/[0.08] active:bg-white/[0.12]"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#282828] text-2xl">
                {member.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{member.name}</p>
                <p className="text-sm text-[var(--jb-muted)]">
                  {getRoleLabel(member.role)}
                  {shouldShowMemberAge(member) ? ` · age ${member.age}` : ""} · {count}{" "}
                  {count === 1 ? "song" : "songs"}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
