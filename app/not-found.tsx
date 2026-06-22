import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-3 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-3xl bg-white/[0.08] text-[var(--family-pink)]">
        <Music2 className="size-8" aria-hidden />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">This track isn&apos;t here yet</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--jb-muted)]">
        The link may be from a newer release that hasn&apos;t finished deploying, or the page moved.
        Head home and try again in a moment.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-family-accent px-5 py-3 text-sm font-black text-[#1a0812]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to {BRAND_NAME}
      </Link>
    </main>
  );
}
