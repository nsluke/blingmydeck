"use client";

import type { BlingResult } from "@/lib/scryfall/types";

interface AddToCartButtonProps {
  results: BlingResult[];
}

/**
 * Generates a TCGPlayer mass entry URL with all blinged cards.
 * TCGPlayer mass entry accepts a text list in the format:
 *   quantity card_name [set_name]
 */
function buildTcgMassEntryList(results: BlingResult[]): string {
  const lines: string[] = [];

  for (const r of results) {
    const qty = r.card.quantity;
    const name = r.blinged.name;
    // Include set info for specific printing match
    lines.push(`${qty} ${name}`);
  }

  return lines.join("||");
}

export default function AddToCartButton({ results }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    const cardList = buildTcgMassEntryList(results);
    const encoded = encodeURIComponent(cardList);
    const url = `https://www.tcgplayer.com/massentry?productline=magic&c=${encoded}&partner=6033214&utm_campaign=affiliate&utm_source=blingoutmydeck`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      Buy All on TCGPlayer
    </button>
  );
}
