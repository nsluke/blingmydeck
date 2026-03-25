"use client";

import { useState, useCallback } from "react";
import type { BlingResult, ScryfallCard } from "@/lib/scryfall/types";
import { formatPrice, getTcgPlayerUrl } from "@/lib/scryfall/priceUtils";
import CardPreview from "./CardPreview";

interface CardRowProps {
  result: BlingResult;
  index: number;
}

function finishLabel(finish: string): string {
  switch (finish) {
    case "usd_foil":
      return "Foil";
    case "usd_etched":
      return "Etched";
    default:
      return "";
  }
}

function setLabel(card: ScryfallCard): string {
  return `${card.set_name} (#${card.collector_number})`;
}

export default function CardRow({ result, index }: CardRowProps) {
  const [preview, setPreview] = useState<{
    card: ScryfallCard;
    pos: { x: number; y: number };
  } | null>(null);

  const handleMouseEnter = useCallback(
    (card: ScryfallCard, e: React.MouseEvent) => {
      setPreview({ card, pos: { x: e.clientX, y: e.clientY } });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setPreview(null);
  }, []);

  const { card, original, blinged, originalPrice, blingedPrice, selectedFinish } = result;
  const isUpgrade = original.id !== blinged.id;
  const tcgUrl = getTcgPlayerUrl(blinged);
  const finish = finishLabel(selectedFinish);

  return (
    <>
      <tr
        className={`border-b border-gray-800/50 ${
          index % 2 === 0 ? "bg-navy-dark/30" : "bg-navy-dark/60"
        } hover:bg-gold/5 transition-colors`}
      >
        {/* Quantity */}
        <td className="px-3 py-2 text-center text-gray-400 text-sm tabular-nums">
          {card.quantity}
        </td>

        {/* Card Name — clickable to Scryfall */}
        <td className="px-3 py-2">
          <a
            href={blinged.scryfall_uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 font-medium hover:text-gold transition-colors"
            onMouseEnter={(e) => handleMouseEnter(blinged, e)}
            onMouseLeave={handleMouseLeave}
          >
            {card.name}
          </a>
        </td>

        {/* Original Printing */}
        <td className="px-3 py-2 text-sm text-gray-500 hidden md:table-cell">
          <span
            className="cursor-help"
            onMouseEnter={(e) => handleMouseEnter(original, e)}
            onMouseLeave={handleMouseLeave}
          >
            {setLabel(original)}
          </span>
        </td>

        {/* Blinged Printing */}
        <td className="px-3 py-2 text-sm">
          <span
            className={`cursor-help ${isUpgrade ? "text-gold" : "text-gray-400"}`}
            onMouseEnter={(e) => handleMouseEnter(blinged, e)}
            onMouseLeave={handleMouseLeave}
          >
            {setLabel(blinged)}
            {finish && (
              <span className="ml-1 text-xs text-gold/60">({finish})</span>
            )}
          </span>
        </td>

        {/* Price */}
        <td className="px-3 py-2 text-right text-sm tabular-nums">
          <span className="text-gray-500">{formatPrice(originalPrice)}</span>
          <span className="text-gray-600 mx-1">→</span>
          <span className={isUpgrade ? "text-gold font-medium" : "text-gray-400"}>
            {formatPrice(blingedPrice)}
          </span>
        </td>

        {/* Buy Link */}
        <td className="px-3 py-2 text-center">
          {tcgUrl ? (
            <a
              href={tcgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Buy
            </a>
          ) : (
            <span className="text-xs text-gray-600">—</span>
          )}
        </td>
      </tr>

      {preview && (
        <CardPreview
          card={preview.card}
          position={preview.pos}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
