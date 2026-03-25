"use client";

import { useState, useCallback, useRef } from "react";
import { FilterMode, LandFilter } from "@/lib/constants";
import { parseDeckList } from "@/lib/scryfall/parseDeckList";
import { fetchCollection, fetchAllPrintings } from "@/lib/scryfall/client";
import { blingDeck } from "@/lib/scryfall/blingAlgorithm";
import type { ScryfallCard, BlingResult } from "@/lib/scryfall/types";

export interface BlingState {
  status: "idle" | "loading" | "done" | "error";
  progress: { current: number; total: number; cardName: string } | null;
  results: BlingResult[] | null;
  error: string | null;
}

// Session-level cache for printings so filter changes don't re-fetch
const printingsCache = new Map<string, ScryfallCard[]>();

export function useBling() {
  const [state, setState] = useState<BlingState>({
    status: "idle",
    progress: null,
    results: null,
    error: null,
  });
  const abortRef = useRef(false);

  const runBling = useCallback(
    async (decklistText: string, filter: FilterMode, landFilters: Set<LandFilter> = new Set()) => {
      abortRef.current = false;
      setState({
        status: "loading",
        progress: { current: 0, total: 0, cardName: "" },
        results: null,
        error: null,
      });

      try {
        // Step 1: Parse decklist
        const cards = parseDeckList(decklistText);
        if (cards.length === 0) {
          setState({
            status: "error",
            progress: null,
            results: null,
            error: "No cards found in decklist. Check the format and try again.",
          });
          return;
        }

        // Step 2: Deduplicate by name for API calls
        const uniqueNames = [...new Set(cards.map((c) => c.name))];
        const identifiers = uniqueNames.map((name) => ({ name }));

        setState((s) => ({
          ...s,
          progress: {
            current: 0,
            total: uniqueNames.length,
            cardName: "Looking up cards...",
          },
        }));

        // Step 3: Fetch default printings via collection endpoint
        const collection = await fetchCollection(identifiers);

        // Build lookup map
        const originals = new Map<string, ScryfallCard>();
        for (const card of collection.data) {
          originals.set(card.name, card);
        }

        // Report not-found cards
        if (collection.not_found.length > 0) {
          const notFoundNames = collection.not_found
            .map((nf) => nf.name ?? "unknown")
            .join(", ");
          console.warn("Cards not found:", notFoundNames);
        }

        // Step 4: Fetch all printings for each unique card
        const allPrintings = new Map<string, ScryfallCard[]>();
        let completed = 0;

        for (const card of collection.data) {
          if (abortRef.current) return;

          const cacheKey = card.oracle_id;

          if (printingsCache.has(cacheKey)) {
            allPrintings.set(cacheKey, printingsCache.get(cacheKey)!);
          } else {
            const printings = await fetchAllPrintings(card.prints_search_uri);
            printingsCache.set(cacheKey, printings);
            allPrintings.set(cacheKey, printings);
          }

          completed++;
          setState((s) => ({
            ...s,
            progress: {
              current: completed,
              total: collection.data.length,
              cardName: card.name,
            },
          }));
        }

        if (abortRef.current) return;

        // Step 5: Run bling algorithm
        const results = blingDeck(cards, originals, allPrintings, filter, landFilters);

        setState({
          status: "done",
          progress: null,
          results,
          error: null,
        });
      } catch (err) {
        setState({
          status: "error",
          progress: null,
          results: null,
          error:
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setState({
      status: "idle",
      progress: null,
      results: null,
      error: null,
    });
  }, []);

  return { state, runBling, reset };
}
