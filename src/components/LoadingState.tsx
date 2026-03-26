"use client";

import type { BlingProgress } from "@/hooks/useBling";
import { formatPrice } from "@/lib/scryfall/priceUtils";

interface LoadingStateProps {
  progress: BlingProgress;
}

export default function LoadingState({ progress }: LoadingStateProps) {
  const {
    current,
    total,
    cardName,
    originalImageUri,
    blingedImageUri,
    originalPrice,
    blingedPrice,
    phase,
  } = progress;
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-navy-dark border border-gray-800 rounded-xl p-6 space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            {phase === "lookup"
              ? "Looking up cards..."
              : `Blinging card ${current} of ${total}`}
          </span>
          <span className="text-gold">{Math.round(pct)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        {cardName && (
          <p className="text-sm text-gray-300 truncate font-medium">
            {cardName}
          </p>
        )}
      </div>

      {/* Card images — show original → blinged */}
      {phase === "blinging" && originalImageUri && (
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Original card */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Original
            </p>
            <img
              src={originalImageUri}
              alt={`Original ${cardName}`}
              className="w-32 md:w-44 rounded-lg shadow-lg border border-gray-700 opacity-60"
            />
            {originalPrice != null && (
              <p className="text-sm text-gray-400">
                {formatPrice(originalPrice)}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="text-gold text-2xl md:text-3xl flex-shrink-0">→</div>

          {/* Blinged card */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gold uppercase tracking-wider font-semibold">
              Blinged
            </p>
            {blingedImageUri ? (
              <img
                src={blingedImageUri}
                alt={`Blinged ${cardName}`}
                className="w-32 md:w-44 rounded-lg shadow-lg shadow-gold/20 border border-gold/30 ring-1 ring-gold/20"
              />
            ) : (
              <div className="w-32 md:w-44 h-44 md:h-60 bg-gray-800 rounded-lg animate-pulse" />
            )}
            {blingedPrice != null ? (
              <p className="text-sm text-gold font-semibold">
                {formatPrice(blingedPrice)}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Finding...</p>
            )}
          </div>
        </div>
      )}

      {/* Informative label about rate limiting */}
      <p className="text-xs text-gray-600 text-center leading-relaxed">
        We check every printing of each card to find the most expensive version.
        To be respectful to the{" "}
        <a
          href="https://scryfall.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-400 underline"
        >
          Scryfall API
        </a>
        , we space out requests — thanks for your patience!
      </p>
    </div>
  );
}
