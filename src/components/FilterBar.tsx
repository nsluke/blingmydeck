"use client";

import { FilterMode, FILTER_LABELS, FILTER_DESCRIPTIONS } from "@/lib/constants";

interface FilterBarProps {
  value: FilterMode;
  onChange: (filter: FilterMode) => void;
  disabled: boolean;
}

const FILTERS = [
  FilterMode.NONE,
  FilterMode.NO_SERIALIZED,
  FilterMode.PREFER_OLD_BORDER,
  FilterMode.NO_FOIL,
  FilterMode.PREFER_OLDEST,
];

export default function FilterBar({
  value,
  onChange,
  disabled,
}: FilterBarProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Bling Mode
      </label>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            disabled={disabled}
            title={FILTER_DESCRIPTIONS[filter]}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              value === filter
                ? "bg-gold/20 text-gold border-gold/40"
                : "bg-navy-dark text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {FILTER_LABELS[filter]}
          </button>
        ))}
      </div>
    </div>
  );
}
