"use client";

import { cn } from "@/lib/utils";

type TagFilterProps = {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
};

export function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#b3b3b3]">Tags</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onTagChange(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activeTag === null
              ? "bg-white text-black"
              : "bg-[#282828] text-white hover:bg-[#3e3e3e]",
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
                ? "bg-white text-black"
                : "bg-[#282828] text-white hover:bg-[#3e3e3e]",
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
