export type MemberRole = "girl" | "boy" | "tio" | "family";

export type FamilyMember = {
  slug: string;
  name: string;
  age: number;
  role: MemberRole;
  description: string;
  emoji: string;
};

export const members: FamilyMember[] = [
  {
    slug: "kaia",
    name: "Kaia",
    age: 2,
    role: "girl",
    emoji: "💗",
    description:
      "Kaia is two — soft wonder, big feelings, and a heart that fills the room. Her growing album starts with The Smallest Heart.",
  },
  {
    slug: "marceline",
    name: "Marceline",
    age: 3,
    role: "girl",
    emoji: "🌸",
    description:
      "Marceline brings pure silly energy — fast feet, big laughs, and songs that feel like a game you never want to stop.",
  },
  {
    slug: "eliana",
    name: "Eliana",
    age: 6,
    role: "girl",
    emoji: "💖",
    description:
      "Eliana sees the world in color. Sweet, playful, and always a little extra — especially when pink glasses are involved.",
  },
  {
    slug: "solene",
    name: "Solene",
    age: 8,
    role: "girl",
    emoji: "🎨",
    description:
      "Solene is our artist storyteller. She loves painted trails, secret gardens, foxes, and turning little ideas into whole worlds.",
  },
  {
    slug: "ocean",
    name: "Ocean",
    age: 10,
    role: "boy",
    emoji: "🌊",
    description:
      "Ocean is our guy in the crew — cool, creative, and always up for an adventure song. Gravity shifts, mountain journeys, and big imagination.",
  },
  {
    slug: "tio-chien",
    name: "Tio Chien",
    age: 35,
    role: "tio",
    emoji: "✨",
    description:
      "Tio Chien is uncle, co-pilot, and family music-day ringleader. Helps turn pixels, prompts, and cousin chaos into songs everyone replays.",
  },
  {
    slug: "evelyn",
    name: "Tia Evelyn",
    age: 35,
    role: "family",
    emoji: "💛",
    description:
      "Tia Evelyn — heart of the home. Her album Gold in the Tile is a growing collection of songs made with love, one release at a time.",
  },
  {
    slug: "maria",
    name: "Mama",
    age: 55,
    role: "family",
    emoji: "🏡",
    description:
      "Mama — warmth at the kitchen table, love in every meal, and songs that feel like home. Her growing album starts with Cornerstone at the Kitchen Table.",
  },
  {
    slug: "sam-and-josh",
    name: "Tio Sam & Tio Josh",
    age: 40,
    role: "family",
    emoji: "🏀",
    description:
      "Real superheroes who lace up sneakers, not capes — coaches on the court, dads in the lane, and the heart behind Legacy in the Lane.",
  },
  {
    slug: "chilling-with-cousin",
    name: "Chilling with Cousin",
    age: 35,
    role: "family",
    emoji: "☕",
    description:
      "Calm lo-fi for study, focus, and late-night background — pull up a chair and chill with the cousins.",
  },
];

export function getMemberBySlug(slug: string): FamilyMember | undefined {
  return members.find((member) => member.slug === slug);
}

/** Kids show age in UI; family and tio artists are featured by name only. */
export function shouldShowMemberAge(member: FamilyMember): boolean {
  return member.role === "girl" || member.role === "boy";
}

/** Family and tio artists count as grown-up catalog (Mama, Evelyn, Tio Chien, etc.). */
export function isAdultFamilyMember(member: FamilyMember): boolean {
  return member.role === "family" || member.role === "tio";
}

export function getMemberLabel(member: FamilyMember): string {
  if (shouldShowMemberAge(member)) {
    return `${member.name}, ${member.age}`;
  }
  return member.name;
}

export function getAllAges(): number[] {
  return getFilterableAges();
}

/** Age chips for search — kid ages plus grown-up buckets (35, 40), never private adult ages like 55. */
export function getFilterableAges(): number[] {
  const ages = new Set<number>();
  for (const member of members) {
    if (shouldShowMemberAge(member)) {
      ages.add(member.age);
    }
  }
  ages.add(35);
  ages.add(40);
  return [...ages].sort((a, b) => a - b);
}

export function getRoleLabel(role: MemberRole): string {
  switch (role) {
    case "girl":
      return "Our girls";
    case "boy":
      return "Our guy";
    case "tio":
      return "Tio";
    case "family":
      return "Family";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}
