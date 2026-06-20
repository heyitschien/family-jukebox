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
      <p className="text-sm font-medium text-[#b3b3b3]">Age</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAgeChange(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activeAge === null
              ? "bg-white text-black"
              : "bg-[#282828] text-white hover:bg-[#3e3e3e]",
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
                ? "bg-white text-black"
                : "bg-[#282828] text-white hover:bg-[#3e3e3e]",
            )}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
}
