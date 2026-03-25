"use client";

import {
  LandFilter,
  LAND_FILTER_LABELS,
  LAND_FILTER_DESCRIPTIONS,
} from "@/lib/constants";

interface LandFilterBarProps {
  value: Set<LandFilter>;
  onChange: (filters: Set<LandFilter>) => void;
  disabled: boolean;
}

const LAND_FILTERS = [
  LandFilter.NO_GURU,
  LandFilter.ALL_DIFFERENT,
  LandFilter.PREFER_FULL_ART,
];

export default function LandFilterBar({
  value,
  onChange,
  disabled,
}: LandFilterBarProps) {
  const toggle = (filter: LandFilter) => {
    const next = new Set(value);
    if (next.has(filter)) {
      next.delete(filter);
    } else {
      next.add(filter);
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Basic Land Options
        <span className="ml-2 text-xs text-gray-500 font-normal">
          (select multiple)
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        {LAND_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => toggle(filter)}
            disabled={disabled}
            title={LAND_FILTER_DESCRIPTIONS[filter]}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              value.has(filter)
                ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/50"
                : "bg-navy-dark text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {LAND_FILTER_LABELS[filter]}
          </button>
        ))}
      </div>
    </div>
  );
}
