export interface ScryfallCard {
  id: string;
  oracle_id: string;
  name: string;
  set: string;
  set_name: string;
  collector_number: string;
  released_at: string;
  frame: string; // "1993", "1997", "2003", "2015", "future"
  border_color: string;
  finishes: string[]; // "nonfoil", "foil", "etched", "glossy"
  prices: {
    usd: string | null;
    usd_foil: string | null;
    usd_etched: string | null;
  };
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
  };
  card_faces?: Array<{
    name: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
    };
  }>;
  prints_search_uri: string;
  scryfall_uri: string;
  purchase_uris?: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };
  promo_types?: string[];
  security_stamp?: string;
  layout: string;
  type_line: string;
  full_art: boolean;
  keywords?: string[];
}

export interface ScryfallList {
  object: "list";
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

export interface ScryfallCollectionRequest {
  identifiers: Array<
    | { name: string }
    | { set: string; collector_number: string }
  >;
}

export interface ScryfallCollectionResponse {
  object: "list";
  data: ScryfallCard[];
  not_found: Array<{ name?: string; set?: string; collector_number?: string }>;
}

export interface ParsedCard {
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: string;
  section: string; // "main", "sideboard", "commander", "companion"
}

export interface BlingResult {
  card: ParsedCard;
  original: ScryfallCard;
  blinged: ScryfallCard;
  originalPrice: number | null;
  blingedPrice: number | null;
  selectedFinish: "usd" | "usd_foil" | "usd_etched";
}
