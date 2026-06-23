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
    slug: "marceline",
    name: "Marceline",
    age: 3,
    role: "girl",
    emoji: "🌸",
    description:
      "Our littlest cousin and the youngest in the jukebox. Marceline brings pure silly energy — fast feet, big laughs, and songs that feel like a game you never want to stop.",
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
    slug: "sam-and-josh",
    name: "Tio Sam & Tio Josh",
    age: 40,
    role: "family",
    emoji: "🏀",
    description:
      "Real superheroes who lace up sneakers, not capes — coaches on the court, dads in the lane, and the heart behind Legacy in the Lane.",
  },
];

export function getMemberBySlug(slug: string): FamilyMember | undefined {
  return members.find((member) => member.slug === slug);
}

export function getMemberLabel(member: FamilyMember): string {
  if (member.role === "tio" || member.role === "family") {
    return member.name;
  }
  return `${member.name}, ${member.age}`;
}

export function getAllAges(): number[] {
  return [...new Set(members.map((member) => member.age))].sort((a, b) => a - b);
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
