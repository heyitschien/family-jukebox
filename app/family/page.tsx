import Link from "next/link";

import { BrandAccentIcon } from "@/components/brand/brand-accent-icon";
import { FamilyCircleSection } from "@/components/family-circle-section";
import { Topbar } from "@/components/topbar";
import { members, shouldShowMemberAge } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";
import { getFamilyDirectorySections, getMemberCircleLabel } from "@/lib/family-directory";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("Family"),
  description:
    "Meet the kitchen table — the cousins, the Tias, the Tios, and Mama who make Cousin Radio.",
  path: "/family",
});

export default function FamilyPage() {
  const sections = getFamilyDirectorySections();

  return (
    <main className="min-w-0 space-y-6 px-3 pb-4 lg:px-0">
      <Topbar />
      <header className="px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Cousin Radio</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[var(--jb-muted)]">
          <BrandAccentIcon icon="users" />
          Cousins, Tias, Tios, and Mama — everyone at the table
        </p>
      </header>

      {sections.map((section) => (
        <FamilyCircleSection key={section.id} section={section} />
      ))}

      <section className="jb-float-panel p-2 sm:p-3">
        <h2 className="px-2 pt-2 text-xl font-bold">Everyone</h2>
        <p className="px-2 pb-1 text-sm font-bold text-[var(--jb-muted)]">
          Tap anyone to hear their songs
        </p>
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
                  {getMemberCircleLabel(member)}
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
