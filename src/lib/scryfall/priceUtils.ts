import type { ScryfallCard } from "./types";

export type Finish = "usd" | "usd_foil" | "usd_etched";

export function getPrice(card: ScryfallCard, finish: Finish): number | null {
  const val = card.prices[finish];
  if (val == null) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

export function getBestPrice(card: ScryfallCard): {
  price: number;
  finish: Finish;
} | null {
  const options: Array<{ price: number; finish: Finish }> = [];

  for (const finish of ["usd", "usd_foil", "usd_etched"] as Finish[]) {
    const p = getPrice(card, finish);
    if (p != null && p > 0) {
      options.push({ price: p, finish });
    }
  }

  if (options.length === 0) return null;
  options.sort((a, b) => b.price - a.price);
  return options[0];
}

export function getNonFoilPrice(card: ScryfallCard): number | null {
  return getPrice(card, "usd");
}

export function formatPrice(price: number | null): string {
  if (price == null) return "N/A";
  return `$${price.toFixed(2)}`;
}

export function getCardImage(card: ScryfallCard): string | null {
  if (card.image_uris?.normal) return card.image_uris.normal;
  if (card.card_faces?.[0]?.image_uris?.normal) {
    return card.card_faces[0].image_uris.normal;
  }
  return null;
}

export function getTcgPlayerUrl(card: ScryfallCard): string | null {
  const base = card.purchase_uris?.tcgplayer;
  if (!base) return null;
  // Replace Scryfall's affiliate tag with ours
  try {
    const url = new URL(base);
    url.searchParams.set("partner", "6033214");
    url.searchParams.set("utm_campaign", "affiliate");
    url.searchParams.set("utm_source", "blingoutmydeck");
    return url.toString();
  } catch {
    return base;
  }
}
