import Link from "next/link";
import { Music4 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-sm transition-transform group-hover:scale-105">
            <Music4 className="size-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-amber-950">
              Family Jukebox
            </p>
            <p className="text-xs text-amber-800/70">Cousin Radio · Little Anthems</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
