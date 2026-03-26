import type {
  ScryfallCard,
  ScryfallCollectionResponse,
  ScryfallList,
} from "./types";

const BASE_URL = "https://api.scryfall.com";
const MIN_DELAY_MS = 150; // Conservative to account for CORS preflights

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// Sequential queue ensures only one request at a time with proper spacing
let requestPromise: Promise<void> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const result = requestPromise.then(async () => {
    await sleep(MIN_DELAY_MS);
    return fn();
  });
  // Update the chain so next request waits for this one
  requestPromise = result.then(() => {}, () => {});
  return result;
}

const MAX_RETRIES = 3;

async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, init);

      if (res.status === 429) {
        const backoff = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
        await sleep(backoff);
        continue;
      }

      return res;
    } catch (err) {
      // Network error — retry with backoff
      if (attempt < MAX_RETRIES - 1) {
        const backoff = Math.pow(2, attempt + 1) * 1000;
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded for Scryfall request");
}

async function scryfallGet<T>(url: string): Promise<T> {
  return enqueue(async () => {
    // No Content-Type on GET to avoid CORS preflight
    const res = await fetchWithRetry(url);
    if (!res.ok) throw new Error(`Scryfall error: ${res.status}`);
    return res.json();
  });
}

async function scryfallPost<T>(url: string, body: unknown): Promise<T> {
  return enqueue(async () => {
    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Scryfall error: ${res.status}`);
    return res.json();
  });
}

/**
 * Look up cards by name or set+collector_number in batches of up to 75.
 */
export async function fetchCollection(
  identifiers: Array<
    { name: string } | { set: string; collector_number: string }
  >
): Promise<ScryfallCollectionResponse> {
  if (identifiers.length <= 75) {
    return scryfallPost<ScryfallCollectionResponse>(
      `${BASE_URL}/cards/collection`,
      { identifiers }
    );
  }

  // Batch into groups of 75
  const allData: ScryfallCard[] = [];
  const allNotFound: ScryfallCollectionResponse["not_found"] = [];

  for (let i = 0; i < identifiers.length; i += 75) {
    const batch = identifiers.slice(i, i + 75);
    const res = await scryfallPost<ScryfallCollectionResponse>(
      `${BASE_URL}/cards/collection`,
      { identifiers: batch }
    );
    allData.push(...res.data);
    allNotFound.push(...res.not_found);
  }

  return { object: "list", data: allData, not_found: allNotFound };
}

/**
 * Fetch all printings for a card using its prints_search_uri.
 * Handles pagination automatically.
 * For basic lands (hundreds of printings), caps to maxPages to avoid excessive requests.
 */
export async function fetchAllPrintings(
  printSearchUri: string,
  maxPages: number = 0 // 0 = unlimited
): Promise<ScryfallCard[]> {
  const cards: ScryfallCard[] = [];
  let url: string | undefined = printSearchUri;
  let page = 0;

  while (url) {
    page++;
    if (maxPages > 0 && page > maxPages) break;
    const res: ScryfallList = await scryfallGet<ScryfallList>(url);
    cards.push(...res.data);
    url = res.has_more ? res.next_page : undefined;
  }

  return cards;
}

/**
 * Fetch printings for basic lands using Scryfall search ordered by price desc.
 * This avoids fetching all 800+ printings and gets the most expensive ones first.
 */
export async function fetchLandPrintings(
  cardName: string
): Promise<ScryfallCard[]> {
  const query = encodeURIComponent(`!"${cardName}" unique:prints`);
  const url = `${BASE_URL}/cards/search?q=${query}&order=usd&dir=desc`;

  // Just fetch first 2 pages (up to 350 printings) — more than enough for bling selection
  const cards: ScryfallCard[] = [];
  let currentUrl: string | undefined = url;
  let page = 0;

  while (currentUrl && page < 2) {
    page++;
    const res: ScryfallList = await scryfallGet<ScryfallList>(currentUrl);
    cards.push(...res.data);
    currentUrl = res.has_more ? res.next_page : undefined;
  }

  return cards;
}
