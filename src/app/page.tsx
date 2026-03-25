"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FilterMode, LandFilter } from "@/lib/constants";
import { decodeDeckList } from "@/lib/sharing";
import { useBling } from "@/hooks/useBling";
import DeckInput from "@/components/DeckInput";
import FilterBar from "@/components/FilterBar";
import LandFilterBar from "@/components/LandFilterBar";
import BlingResults from "@/components/BlingResults";
import LoadingState from "@/components/LoadingState";
import ShareButton from "@/components/ShareButton";
import AdSlot from "@/components/AdSlot";

function BlingApp() {
  const searchParams = useSearchParams();
  const [decklist, setDecklist] = useState("");
  const [filter, setFilter] = useState<FilterMode>(FilterMode.NONE);
  const [landFilters, setLandFilters] = useState<Set<LandFilter>>(new Set());
  const { state, runBling, reset } = useBling();

  // Load from URL params on mount
  useEffect(() => {
    const decoded = decodeDeckList(searchParams);
    if (decoded) {
      setDecklist(decoded.decklist);
      setFilter(decoded.filter);
      setTimeout(() => {
        runBling(decoded.decklist, decoded.filter);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (!decklist.trim()) return;
    runBling(decklist, filter, landFilters);
  };

  const isLoading = state.status === "loading";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero text */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-gold">Bling Out</span>{" "}
          <span className="text-gray-200">My Deck</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Paste your MTG decklist and find the most expensive printing of every
          card. Because your deck deserves to shine.
        </p>
      </div>

      {/* Top ad */}
      <AdSlot slot="header-leaderboard" format="horizontal" className="flex justify-center" />

      {/* Input section */}
      <div className="space-y-4">
        <DeckInput
          value={decklist}
          onChange={setDecklist}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
        <FilterBar
          value={filter}
          onChange={setFilter}
          disabled={isLoading}
        />
        <LandFilterBar
          value={landFilters}
          onChange={setLandFilters}
          disabled={isLoading}
        />
      </div>

      {/* Loading state */}
      {state.status === "loading" && state.progress && (
        <LoadingState
          current={state.progress.current}
          total={state.progress.total}
          cardName={state.progress.cardName}
        />
      )}

      {/* Error state */}
      {state.status === "error" && state.error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
          {state.error}
        </div>
      )}

      {/* Results */}
      {state.status === "done" && state.results && (
        <div className="space-y-6">
          <BlingResults results={state.results} />

          <div className="flex items-center justify-between">
            <ShareButton decklist={decklist} filter={filter} />
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Start Over
            </button>
          </div>

          {/* Mid-results ad */}
          <AdSlot slot="mid-results" format="rectangle" className="flex justify-center" />
        </div>
      )}

      {/* Bottom ad */}
      <AdSlot slot="footer-leaderboard" format="horizontal" className="flex justify-center" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500">
          Loading...
        </div>
      }
    >
      <BlingApp />
    </Suspense>
  );
}
