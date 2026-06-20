"use client";

import { cn } from "@/lib/utils";

type TagFilterProps = {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
};

export function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onTagChange(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition",
          activeTag === null
            ? "bg-amber-500 text-amber-950 shadow-sm"
            : "bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50",
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onTagChange(tag === activeTag ? null : tag)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium capitalize transition",
            activeTag === tag
              ? "bg-amber-500 text-amber-950 shadow-sm"
              : "bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50",
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
