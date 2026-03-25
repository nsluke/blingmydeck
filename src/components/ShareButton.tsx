"use client";

import { useState } from "react";
import { encodeDeckList } from "@/lib/sharing";
import { FilterMode } from "@/lib/constants";

interface ShareButtonProps {
  decklist: string;
  filter: FilterMode;
}

export default function ShareButton({ decklist, filter }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const queryString = encodeDeckList(decklist, filter);
    const url = `${window.location.origin}${window.location.pathname}${queryString}`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleCopy}
        className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-300 hover:border-gold/40 hover:text-gold transition-all"
      >
        {copied ? "Copied!" : "Copy Share Link"}
      </button>
    </div>
  );
}
