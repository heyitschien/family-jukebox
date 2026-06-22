"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { getAlbumAuthor } from "@/data/albums";
import { getMemberBySlug } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";
import {
  flattenGroupedResults,
  getInlineSearchResults,
  highlightMatch,
  type SearchResult,
} from "@/lib/search";
import { cn } from "@/lib/utils";

type InlineSearchProps = {
  variant?: "default" | "embedded";
  className?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  initialQuery?: string;
};

export function InlineSearch({
  variant = "default",
  className,
  placeholder = "Search songs, kids, tags, memories...",
  value,
  onValueChange,
  initialQuery = "",
}: InlineSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalQuery, setInternalQuery] = useState(initialQuery);
  const query = value ?? internalQuery;

  const setQuery = useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternalQuery(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, value],
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const embedded = variant === "embedded";
  const trimmed = query.trim();
  const grouped = useMemo(() => getInlineSearchResults(query), [query]);
  const flatResults = useMemo(() => flattenGroupedResults(grouped), [grouped]);
  const indexedSections = useMemo(() => {
    let index = 0;
    const withIndex = <T extends SearchResult>(items: T[]) =>
      items.map((result) => ({ result, index: index++ }));

    return {
      members: withIndex(grouped.members),
      albums: withIndex(grouped.albums),
      songs: withIndex(grouped.songs),
    };
  }, [grouped]);
  const hasResults = flatResults.length > 0;
  const showPanel = open && (trimmed.length > 0 || hasResults);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setActiveIndex(0);
      router.push(href);
    },
    [router, setQuery],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const target = flatResults[activeIndex];
    if (target) {
      navigateTo(target.href);
      return;
    }
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setOpen(false);
    }
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel || flatResults.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % flatResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + flatResults.length) % flatResults.length);
    } else if (event.key === "Enter" && flatResults[activeIndex]) {
      event.preventDefault();
      navigateTo(flatResults[activeIndex].href);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={onSubmit}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-full px-4 py-3 text-[var(--jb-muted)] transition",
          embedded
            ? "border border-white/15 bg-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
            : "flex-1 border border-white/[0.07] bg-white/[0.08]",
          showPanel && "border-[rgba(255,111,177,0.45)] ring-2 ring-[rgba(255,111,177,0.18)]",
        )}
        role="search"
      >
        <Search className="size-[18px] shrink-0 opacity-80" strokeWidth={2.25} aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          aria-label="Search Cousin Radio"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listboxId : undefined}
          aria-autocomplete="list"
          role="combobox"
          className="w-full border-0 bg-transparent text-[15px] text-[var(--jb-text)] outline-none placeholder:text-white/55"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveIndex(0);
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--jb-muted)] transition hover:bg-white/10 hover:text-white"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </form>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute top-[calc(100%+10px)] z-[80] w-full overflow-hidden rounded-[22px] border border-white/10 bg-[rgba(9,13,18,0.96)] shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
            embedded ? "left-0" : "left-0 lg:left-0",
          )}
        >
          <div className="max-h-[min(440px,62vh)] overflow-y-auto overscroll-contain p-2">
            {!trimmed && hasResults ? (
              <p className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--jb-muted)]">
                Browse family
              </p>
            ) : null}

            {trimmed && !hasResults ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-bold text-[var(--jb-text)]">No matches for “{trimmed}”</p>
                <p className="mt-1 text-xs text-[var(--jb-muted)]">Try a song title, cousin name, or tag</p>
              </div>
            ) : null}

            {indexedSections.members.length > 0 ? (
              <ResultSection title="Artists">
                {indexedSections.members.map(({ result, index }) => (
                  <ResultRow
                    key={result.href}
                    result={result}
                    query={trimmed}
                    active={activeIndex === index}
                    onHover={() => setActiveIndex(index)}
                    onSelect={() => navigateTo(result.href)}
                  />
                ))}
              </ResultSection>
            ) : null}

            {indexedSections.albums.length > 0 ? (
              <ResultSection title="Albums">
                {indexedSections.albums.map(({ result, index }) => (
                  <ResultRow
                    key={result.href}
                    result={result}
                    query={trimmed}
                    active={activeIndex === index}
                    onHover={() => setActiveIndex(index)}
                    onSelect={() => navigateTo(result.href)}
                  />
                ))}
              </ResultSection>
            ) : null}

            {indexedSections.songs.length > 0 ? (
              <ResultSection title="Songs">
                {indexedSections.songs.map(({ result, index }) => (
                  <ResultRow
                    key={result.href}
                    result={result}
                    query={trimmed}
                    active={activeIndex === index}
                    onHover={() => setActiveIndex(index)}
                    onSelect={() => navigateTo(result.href)}
                  />
                ))}
              </ResultSection>
            ) : null}
          </div>

          {trimmed && hasResults && pathname !== "/search" ? (
            <div className="border-t border-white/[0.06] px-3 py-2.5">
              <Link
                href={`/search?q=${encodeURIComponent(trimmed)}`}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-center text-xs font-extrabold text-[var(--family-pink)] transition hover:bg-white/[0.06]"
              >
                See all results for “{trimmed}”
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--jb-muted)]">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ResultRow({
  result,
  query,
  active,
  onHover,
  onSelect,
}: {
  result: SearchResult;
  query: string;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  if (result.kind === "member") {
    const songCount = getSongsByAuthor(result.member.slug).length;
    return (
      <button
        type="button"
        role="option"
        aria-selected={active}
        onMouseEnter={onHover}
        onClick={onSelect}
        className={resultRowClass(active)}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.08] text-lg">
          {result.member.emoji}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <ResultTitle text={result.member.name} query={query} />
          <span className="mt-0.5 block truncate text-xs text-[var(--jb-muted)]">
            Artist · {songCount} {songCount === 1 ? "song" : "songs"}
          </span>
        </span>
        <KindPill label="Artist" />
      </button>
    );
  }

  if (result.kind === "album") {
    const author = getAlbumAuthor(result.album);
    return (
      <button
        type="button"
        role="option"
        aria-selected={active}
        onMouseEnter={onHover}
        onClick={onSelect}
        className={resultRowClass(active)}
      >
        <CoverImage src={result.album.coverSrc} alt="" className="size-10 shrink-0 rounded-[10px]" />
        <span className="min-w-0 flex-1 text-left">
          <ResultTitle text={result.album.title} query={query} />
          <span className="mt-0.5 block truncate text-xs text-[var(--jb-muted)]">
            {author?.name ?? "Family"} · {result.album.songSlugs.length}{" "}
            {result.album.songSlugs.length === 1 ? "track" : "tracks"}
          </span>
        </span>
        <KindPill label="Album" />
      </button>
    );
  }

  const author = getMemberBySlug(result.song.authorSlug);
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={resultRowClass(active)}
    >
      <CoverImage src={result.song.coverSrc} alt="" className="size-10 shrink-0 rounded-[10px]" />
      <span className="min-w-0 flex-1 text-left">
        <ResultTitle text={result.song.title} query={query} />
        <span className="mt-0.5 block truncate text-xs text-[var(--jb-muted)]">
          {author?.name ?? "Family"}
          {result.song.subtitle ? ` · ${result.song.subtitle}` : ""}
        </span>
      </span>
      <KindPill label="Song" />
    </button>
  );
}

function ResultTitle({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  if (!parts) {
    return <span className="block truncate text-sm font-bold text-[var(--jb-text)]">{text}</span>;
  }
  return (
    <span className="block truncate text-sm font-bold text-[var(--jb-text)]">
      {parts.before}
      <span className="text-[var(--family-pink)]">{parts.match}</span>
      {parts.after}
    </span>
  );
}

function KindPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--jb-muted)]">
      {label}
    </span>
  );
}

function resultRowClass(active: boolean): string {
  return cn(
    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition [-webkit-tap-highlight-color:transparent]",
    active ? "bg-[rgba(255,111,177,0.14)]" : "hover:bg-white/[0.06]",
  );
}
