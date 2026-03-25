import { FilterMode, LandFilter, BASIC_LAND_NAMES } from "../constants";
import type { ScryfallCard, BlingResult, ParsedCard } from "./types";
import { getBestPrice, getNonFoilPrice, type Finish } from "./priceUtils";

function isSerialized(card: ScryfallCard): boolean {
  if (card.promo_types?.includes("serialized")) return true;
  if (card.security_stamp === "triangle") return true;
  return false;
}

function isOldBorder(card: ScryfallCard): boolean {
  return card.frame === "1993" || card.frame === "1997";
}

function hasNonFoilFinish(card: ScryfallCard): boolean {
  return card.finishes.includes("nonfoil");
}

function isGuruLand(card: ScryfallCard): boolean {
  return card.set.toLowerCase() === "pgru";
}

function isFullArt(card: ScryfallCard): boolean {
  return card.full_art === true;
}

interface ScoredPrinting {
  card: ScryfallCard;
  price: number;
  finish: Finish;
}

export function selectBlingPrinting(
  printings: ScryfallCard[],
  filter: FilterMode
): { card: ScryfallCard; price: number; finish: Finish } | null {
  let scored: ScoredPrinting[] = [];

  if (filter === FilterMode.NO_FOIL) {
    for (const p of printings) {
      if (!hasNonFoilFinish(p)) continue;
      const price = getNonFoilPrice(p);
      if (price != null && price > 0) {
        scored.push({ card: p, price, finish: "usd" });
      }
    }
  } else {
    for (const p of printings) {
      const best = getBestPrice(p);
      if (best) {
        scored.push({ card: p, price: best.price, finish: best.finish });
      }
    }
  }

  if (filter === FilterMode.NO_SERIALIZED) {
    scored = scored.filter((s) => !isSerialized(s.card));
  }

  if (scored.length === 0) return null;

  if (filter === FilterMode.PREFER_OLD_BORDER) {
    const oldBorder = scored.filter((s) => isOldBorder(s.card));
    if (oldBorder.length > 0) {
      oldBorder.sort((a, b) => b.price - a.price);
      return oldBorder[0];
    }
  }

  if (filter === FilterMode.PREFER_OLDEST) {
    scored.sort((a, b) => b.price - a.price);
    const topPrice = scored[0].price;
    const threshold = topPrice * 0.9;

    const topTier = scored.filter((s) => s.price >= threshold);
    topTier.sort(
      (a, b) =>
        new Date(a.card.released_at).getTime() -
        new Date(b.card.released_at).getTime()
    );
    return topTier[0];
  }

  scored.sort((a, b) => b.price - a.price);
  return scored[0];
}

/**
 * Select bling printings for basic lands, respecting land-specific filters.
 * When ALL_DIFFERENT is active, picks a unique printing per copy.
 */
function selectLandBlingPrintings(
  printings: ScryfallCard[],
  quantity: number,
  filter: FilterMode,
  landFilters: Set<LandFilter>
): Array<{ card: ScryfallCard; price: number; finish: Finish }> {
  let scored: ScoredPrinting[] = [];

  if (filter === FilterMode.NO_FOIL) {
    for (const p of printings) {
      if (!hasNonFoilFinish(p)) continue;
      const price = getNonFoilPrice(p);
      if (price != null && price > 0) {
        scored.push({ card: p, price, finish: "usd" });
      }
    }
  } else {
    for (const p of printings) {
      const best = getBestPrice(p);
      if (best) {
        scored.push({ card: p, price: best.price, finish: best.finish });
      }
    }
  }

  // Apply main filter exclusions
  if (filter === FilterMode.NO_SERIALIZED) {
    scored = scored.filter((s) => !isSerialized(s.card));
  }

  // Apply land-specific filters
  if (landFilters.has(LandFilter.NO_GURU)) {
    scored = scored.filter((s) => !isGuruLand(s.card));
  }

  if (scored.length === 0) return [];

  if (landFilters.has(LandFilter.PREFER_FULL_ART)) {
    const fullArt = scored.filter((s) => isFullArt(s.card));
    if (fullArt.length > 0) {
      scored = fullArt;
    }
  }

  // Sort by price descending
  scored.sort((a, b) => b.price - a.price);

  if (landFilters.has(LandFilter.ALL_DIFFERENT)) {
    // Pick unique printings for each copy, most expensive first
    const selected: ScoredPrinting[] = [];
    const usedIds = new Set<string>();

    for (const s of scored) {
      if (selected.length >= quantity) break;
      if (!usedIds.has(s.card.id)) {
        usedIds.add(s.card.id);
        selected.push(s);
      }
    }

    // If we don't have enough unique printings, repeat from the top
    while (selected.length < quantity && scored.length > 0) {
      selected.push(scored[selected.length % scored.length]);
    }

    return selected;
  }

  // Default: return the single most expensive for all copies
  return Array(quantity).fill(scored[0]);
}

export function blingDeck(
  cards: ParsedCard[],
  originals: Map<string, ScryfallCard>,
  allPrintings: Map<string, ScryfallCard[]>,
  filter: FilterMode,
  landFilters: Set<LandFilter> = new Set()
): BlingResult[] {
  const results: BlingResult[] = [];

  for (const card of cards) {
    const original = originals.get(card.name);
    if (!original) continue;

    const printings = allPrintings.get(original.oracle_id ?? card.name);
    const isBasicLand = BASIC_LAND_NAMES.has(card.name);
    const hasLandFilters = isBasicLand && landFilters.size > 0;

    if (!printings || printings.length === 0) {
      const origBest = getBestPrice(original);
      results.push({
        card,
        original,
        blinged: original,
        originalPrice: origBest?.price ?? null,
        blingedPrice: origBest?.price ?? null,
        selectedFinish: origBest?.finish ?? "usd",
      });
      continue;
    }

    if (hasLandFilters && landFilters.has(LandFilter.ALL_DIFFERENT)) {
      // Special path: expand each land copy into separate results
      const landResults = selectLandBlingPrintings(
        printings,
        card.quantity,
        filter,
        landFilters
      );

      const origBest =
        filter === FilterMode.NO_FOIL
          ? getNonFoilPrice(original)
            ? { price: getNonFoilPrice(original)!, finish: "usd" as Finish }
            : null
          : getBestPrice(original);

      if (landResults.length > 0) {
        // Create one result per copy with quantity 1
        for (let i = 0; i < card.quantity; i++) {
          const blinged = landResults[i] ?? landResults[0];
          results.push({
            card: { ...card, quantity: 1 },
            original,
            blinged: blinged.card,
            originalPrice: origBest?.price ?? null,
            blingedPrice: blinged.price,
            selectedFinish: blinged.finish,
          });
        }
      } else {
        results.push({
          card,
          original,
          blinged: original,
          originalPrice: origBest?.price ?? null,
          blingedPrice: origBest?.price ?? null,
          selectedFinish: origBest?.finish ?? "usd",
        });
      }
      continue;
    }

    // Standard path (non-land or no land filters)
    let blingedResult: { card: ScryfallCard; price: number; finish: Finish } | null;

    if (hasLandFilters) {
      // Land with filters but not ALL_DIFFERENT
      const landResults = selectLandBlingPrintings(
        printings,
        card.quantity,
        filter,
        landFilters
      );
      blingedResult = landResults.length > 0 ? landResults[0] : null;
    } else {
      blingedResult = selectBlingPrinting(printings, filter);
    }

    const origBest =
      filter === FilterMode.NO_FOIL
        ? getNonFoilPrice(original)
          ? { price: getNonFoilPrice(original)!, finish: "usd" as Finish }
          : null
        : getBestPrice(original);

    if (blingedResult) {
      results.push({
        card,
        original,
        blinged: blingedResult.card,
        originalPrice: origBest?.price ?? null,
        blingedPrice: blingedResult.price,
        selectedFinish: blingedResult.finish,
      });
    } else {
      results.push({
        card,
        original,
        blinged: original,
        originalPrice: origBest?.price ?? null,
        blingedPrice: origBest?.price ?? null,
        selectedFinish: origBest?.finish ?? "usd",
      });
    }
  }

  return results;
}
