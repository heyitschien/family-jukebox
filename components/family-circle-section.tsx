import { MemberCircle } from "@/components/member-circle";
import type { FamilyDirectorySectionWithMembers } from "@/lib/family-directory";

type FamilyCircleSectionProps = {
  section: FamilyDirectorySectionWithMembers;
};

export function FamilyCircleSection({ section }: FamilyCircleSectionProps) {
  return (
    <section className="jb-float-panel p-4 sm:p-5">
      <h2 className="text-xl font-bold">{section.title}</h2>
      <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{section.subtitle}</p>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {section.members.map((member) => (
          <MemberCircle key={member.slug} member={member} />
        ))}
      </div>
    </section>
  );
}
