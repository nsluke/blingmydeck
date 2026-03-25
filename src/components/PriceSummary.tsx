"use client";

import type { BlingResult } from "@/lib/scryfall/types";
import { formatPrice } from "@/lib/scryfall/priceUtils";

interface PriceSummaryProps {
  results: BlingResult[];
}

export default function PriceSummary({ results }: PriceSummaryProps) {
  let originalTotal = 0;
  let blingedTotal = 0;

  for (const r of results) {
    const origPrice = (r.originalPrice ?? 0) * r.card.quantity;
    const blingPrice = (r.blingedPrice ?? 0) * r.card.quantity;
    originalTotal += origPrice;
    blingedTotal += blingPrice;
  }

  const increase = blingedTotal - originalTotal;
  const pctIncrease =
    originalTotal > 0 ? ((increase / originalTotal) * 100).toFixed(0) : "∞";

  return (
    <div className="bg-navy-dark border border-gold/20 rounded-xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-400 mb-1">Original Price</div>
          <div className="text-xl font-bold text-gray-300">
            {formatPrice(originalTotal)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Blinged Price</div>
          <div className="text-xl font-bold text-gold">
            {formatPrice(blingedTotal)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Increase</div>
          <div className="text-xl font-bold text-gold-light">
            +{formatPrice(increase)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Bling Factor</div>
          <div className="text-xl font-bold text-gold-light">
            +{pctIncrease}%
          </div>
        </div>
      </div>
    </div>
  );
}
