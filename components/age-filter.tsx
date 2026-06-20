"use client";

import { cn } from "@/lib/utils";

type AgeFilterProps = {
  ages: number[];
  activeAge: number | null;
  onAgeChange: (age: number | null) => void;
};

export function AgeFilter({ ages, activeAge, onAgeChange }: AgeFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-amber-900/80">Age</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAgeChange(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activeAge === null
              ? "bg-rose-400 text-rose-950 shadow-sm"
              : "bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50",
          )}
        >
          All ages
        </button>
        {ages.map((age) => (
          <button
            key={age}
            type="button"
            onClick={() => onAgeChange(age === activeAge ? null : age)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeAge === age
                ? "bg-rose-400 text-rose-950 shadow-sm"
                : "bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50",
            )}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
}
