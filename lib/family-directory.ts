import { getMemberBySlug, members, type FamilyMember } from "@/data/members";

export type FamilyCircleId = "cousins" | "tias" | "tios" | "mama" | "studio";

export type FamilyDirectorySection = {
  id: FamilyCircleId;
  title: string;
  subtitle: string;
  memberSlugs: string[];
};

/** Kitchen-table groupings for /family — every member appears in exactly one section. */
export const FAMILY_DIRECTORY_SECTIONS: FamilyDirectorySection[] = [
  {
    id: "cousins",
    title: "The cousins",
    subtitle: "Boys and girls — little voices, big hearts, and songs that feel like play.",
    memberSlugs: ["kaia", "marceline", "eliana", "solene", "ocean"],
  },
  {
    id: "tias",
    title: "The Tias",
    subtitle: "Auntie warmth, quiet strength, and love planted at the kitchen table.",
    memberSlugs: ["evelyn", "rachel", "huyen", "dieu"],
  },
  {
    id: "tios",
    title: "The Tios",
    subtitle: "Uncles and co-pilots — coaches, creators, and family anthems behind the scenes.",
    memberSlugs: ["tio-chien", "sam-and-josh"],
  },
  {
    id: "mama",
    title: "Mama",
    subtitle: "The cornerstone of the table — love in every meal and warmth in every song.",
    memberSlugs: ["maria"],
  },
  {
    id: "studio",
    title: "Pull up a chair",
    subtitle: "Study lo-fi and background warmth when the cousins need to chill.",
    memberSlugs: ["chilling-with-cousin"],
  },
];

const CIRCLE_BY_SLUG = new Map<string, FamilyCircleId>(
  FAMILY_DIRECTORY_SECTIONS.flatMap((section) =>
    section.memberSlugs.map((slug) => [slug, section.id] as const),
  ),
);

export function getFamilyCircle(member: FamilyMember): FamilyCircleId {
  return CIRCLE_BY_SLUG.get(member.slug) ?? "cousins";
}

export function getMemberCircleLabel(member: FamilyMember): string {
  const circle = getFamilyCircle(member);
  switch (circle) {
    case "cousins":
      return "Cousin";
    case "tias":
      return "Tia";
    case "tios":
      return "Tio";
    case "mama":
      return "Mama";
    case "studio":
      return "Cousin Radio";
    default: {
      const _exhaustive: never = circle;
      return _exhaustive;
    }
  }
}

export type FamilyDirectorySectionWithMembers = FamilyDirectorySection & {
  members: FamilyMember[];
};

export function getFamilyDirectorySections(): FamilyDirectorySectionWithMembers[] {
  return FAMILY_DIRECTORY_SECTIONS.map((section) => ({
    ...section,
    members: section.memberSlugs
      .map((slug) => getMemberBySlug(slug))
      .filter((member): member is FamilyMember => member !== undefined),
  })).filter((section) => section.members.length > 0);
}

/** Smoke / catalog guard — every roster member belongs to one family circle. */
export function getUnassignedFamilyMemberSlugs(): string[] {
  const assigned = new Set(CIRCLE_BY_SLUG.keys());
  return members.filter((member) => !assigned.has(member.slug)).map((member) => member.slug);
}
