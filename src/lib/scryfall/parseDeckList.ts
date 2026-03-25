import type { ParsedCard } from "./types";

const SECTION_HEADERS: Record<string, string> = {
  sideboard: "sideboard",
  sb: "sideboard",
  commander: "commander",
  companion: "companion",
  deck: "main",
  maindeck: "main",
  "main deck": "main",
};

// Arena format: "4 Lightning Bolt (STA) 62"
const ARENA_RE = /^(\d+)\s+(.+?)\s+\((\w+)\)\s+(\S+)$/;

// MTGO / plain: "4 Lightning Bolt" or "4x Lightning Bolt"
const SIMPLE_RE = /^(\d+)x?\s+(.+)$/;

export function parseDeckList(input: string): ParsedCard[] {
  const lines = input.split(/\r?\n/);
  const cards: ParsedCard[] = [];
  let currentSection = "main";

  for (const raw of lines) {
    const line = raw.trim();

    // Skip empty lines
    if (!line) continue;

    // Check for section headers
    const lower = line.toLowerCase().replace(/:$/, "");
    if (SECTION_HEADERS[lower] !== undefined) {
      currentSection = SECTION_HEADERS[lower];
      continue;
    }

    // Try Arena format first (more specific)
    const arenaMatch = line.match(ARENA_RE);
    if (arenaMatch) {
      cards.push({
        quantity: parseInt(arenaMatch[1], 10),
        name: arenaMatch[2],
        set: arenaMatch[3].toLowerCase(),
        collectorNumber: arenaMatch[4],
        section: currentSection,
      });
      continue;
    }

    // Try simple format
    const simpleMatch = line.match(SIMPLE_RE);
    if (simpleMatch) {
      cards.push({
        quantity: parseInt(simpleMatch[1], 10),
        name: simpleMatch[2],
        section: currentSection,
      });
      continue;
    }

    // Skip unrecognized lines (comments, etc.)
  }

  return cards;
}
