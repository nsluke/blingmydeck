"use client";

import { useState } from "react";
import JSZip from "jszip";
import type { BlingResult } from "@/lib/scryfall/types";

interface DownloadImagesButtonProps {
  results: BlingResult[];
}

function getCardImageUrl(card: BlingResult["blinged"]): string | null {
  if (card.image_uris?.large) return card.image_uris.large;
  if (card.card_faces?.[0]?.image_uris?.large) return card.card_faces[0].image_uris.large;
  if (card.image_uris?.normal) return card.image_uris.normal;
  if (card.card_faces?.[0]?.image_uris?.normal) return card.card_faces[0].image_uris.normal;
  return null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, "_");
}

export default function DownloadImagesButton({ results }: DownloadImagesButtonProps) {
  const [status, setStatus] = useState<"idle" | "downloading" | "zipping" | "error">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleDownload = async () => {
    setStatus("downloading");
    const zip = new JSZip();

    // Deduplicate by blinged card id to avoid fetching the same image twice
    const uniqueCards = new Map<string, { name: string; url: string }>();
    for (const r of results) {
      if (uniqueCards.has(r.blinged.id)) continue;
      const url = getCardImageUrl(r.blinged);
      if (url) {
        uniqueCards.set(r.blinged.id, { name: r.blinged.name, url });
      }
    }

    const entries = [...uniqueCards.values()];
    setProgress({ current: 0, total: entries.length });

    // Track filenames to handle duplicates (e.g. same card name, different printings)
    const usedNames = new Map<string, number>();

    try {
      for (let i = 0; i < entries.length; i++) {
        const { name, url } = entries[i];
        const response = await fetch(url);
        if (!response.ok) continue;
        const blob = await response.blob();
        const ext = ".jpg";

        let filename = sanitizeFilename(name);
        const count = usedNames.get(filename) ?? 0;
        usedNames.set(filename, count + 1);
        if (count > 0) filename = `${filename} (${count})`;

        zip.file(`${filename}${ext}`, blob);
        setProgress({ current: i + 1, total: entries.length });
      }

      setStatus("zipping");
      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "blinged-cards.zip";
      a.click();
      URL.revokeObjectURL(downloadUrl);
      setStatus("idle");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const label =
    status === "downloading"
      ? `Downloading ${progress.current}/${progress.total}...`
      : status === "zipping"
        ? "Creating zip..."
        : status === "error"
          ? "Download failed"
          : "Download Images";

  return (
    <button
      onClick={handleDownload}
      disabled={status !== "idle"}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-700 text-gray-300 hover:border-gold/40 hover:text-gold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {label}
    </button>
  );
}
