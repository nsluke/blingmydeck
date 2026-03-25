"use client";

import type { BlingResult } from "@/lib/scryfall/types";
import PriceSummary from "./PriceSummary";
import CardRow from "./CardRow";
import AddToCartButton from "./AddToCartButton";

interface BlingResultsProps {
  results: BlingResult[];
}

export default function BlingResults({ results }: BlingResultsProps) {
  // Group by section
  const sections = new Map<string, BlingResult[]>();
  for (const r of results) {
    const section = r.card.section;
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(r);
  }

  const sectionOrder = ["commander", "companion", "main", "sideboard"];
  const sortedSections = [...sections.entries()].sort(
    (a, b) => sectionOrder.indexOf(a[0]) - sectionOrder.indexOf(b[0])
  );

  const sectionLabels: Record<string, string> = {
    main: "Main Deck",
    sideboard: "Sideboard",
    commander: "Commander",
    companion: "Companion",
  };

  return (
    <div className="space-y-6">
      <PriceSummary results={results} />

      <div className="flex justify-center">
        <AddToCartButton results={results} />
      </div>

      {sortedSections.map(([section, sectionResults]) => (
        <div key={section}>
          {sortedSections.length > 1 && (
            <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              {sectionLabels[section] ?? section}
            </h3>
          )}
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-navy-dark/80 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-3 py-2 w-12 text-center">#</th>
                  <th className="px-3 py-2">Card</th>
                  <th className="px-3 py-2 hidden md:table-cell">Original</th>
                  <th className="px-3 py-2">Blinged</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 w-12 text-center">Buy</th>
                </tr>
              </thead>
              <tbody>
                {sectionResults.map((result, i) => (
                  <CardRow key={`${result.card.name}-${result.blinged.id}-${i}`} result={result} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
