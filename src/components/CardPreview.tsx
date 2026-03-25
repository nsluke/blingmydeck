"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getCardImage } from "@/lib/scryfall/priceUtils";
import type { ScryfallCard } from "@/lib/scryfall/types";

interface CardPreviewProps {
  card: ScryfallCard;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export default function CardPreview({
  card,
  position,
  onClose,
}: CardPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imageUrl = getCardImage(card);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!imageUrl || !position) return null;

  // Position the preview to the right of cursor, flip if near right edge
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.min(position.y - 100, window.innerHeight - 380),
    left: position.x + 20,
    zIndex: 100,
  };

  // Flip to left side if too close to right edge
  if (position.x + 280 > window.innerWidth) {
    style.left = position.x - 270;
  }

  return createPortal(
    <div ref={ref} style={style} className="pointer-events-none">
      <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gold/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={card.name}
          width={250}
          height={349}
          className="block"
          loading="eager"
        />
      </div>
    </div>,
    document.body
  );
}
