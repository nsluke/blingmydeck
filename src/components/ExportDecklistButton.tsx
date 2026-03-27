"use client";

import { useState } from "react";
import type { BlingResult } from "@/lib/scryfall/types";

interface ExportDecklistButtonProps {
  results: BlingResult[];
}

function buildDecklistText(results: BlingResult[]): string {
  const sections = new Map<string, BlingResult[]>();
  for (const r of results) {
    const section = r.card.section;
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(r);
  }

  const sectionOrder = ["commander", "companion", "main", "sideboard"];
  const sectionLabels: Record<string, string> = {
    main: "Deck",
    sideboard: "Sideboard",
    commander: "Commander",
    companion: "Companion",
  };

  const lines: string[] = [];
  const sortedSections = [...sections.entries()].sort(
    (a, b) => sectionOrder.indexOf(a[0]) - sectionOrder.indexOf(b[0])
  );

  for (const [section, sectionResults] of sortedSections) {
    if (sortedSections.length > 1) {
      if (lines.length > 0) lines.push("");
      lines.push(`// ${sectionLabels[section] ?? section}`);
    }
    for (const r of sectionResults) {
      const set = r.blinged.set.toUpperCase();
      const num = r.blinged.collector_number;
      lines.push(`${r.card.quantity} ${r.blinged.name} (${set}) ${num}`);
    }
  }

  return lines.join("\n");
}

export default function ExportDecklistButton({ results }: ExportDecklistButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const decklistText = buildDecklistText(results);

  const handleCopy = () => {
    navigator.clipboard.writeText(decklistText).then(() => {
      setCopied(true);
      setShowDropdown(false);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([decklistText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blinged-decklist.txt";
    a.click();
    URL.revokeObjectURL(url);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-700 text-gray-300 hover:border-gold/40 hover:text-gold transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {copied ? "Copied!" : "Export Decklist"}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
          <div className="absolute top-full mt-1 right-0 z-20 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-[180px]">
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2.5 text-sm text-left text-gray-300 hover:bg-gray-800 hover:text-gold transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to Clipboard
            </button>
            <button
              onClick={handleDownload}
              className="w-full px-4 py-2.5 text-sm text-left text-gray-300 hover:bg-gray-800 hover:text-gold transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download .txt
            </button>
          </div>
        </>
      )}
    </div>
  );
}
