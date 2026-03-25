"use client";

interface DeckInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const EXAMPLE_DECK = `4 Lightning Bolt
4 Goblin Guide
4 Monastery Swiftspear
4 Eidolon of the Great Revel
4 Lava Spike
4 Rift Bolt
4 Searing Blaze
4 Skullcrack
2 Light Up the Stage
2 Shard Volley
4 Inspiring Vantage
4 Sacred Foundry
2 Sunbaked Canyon
10 Mountain`;

export default function DeckInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: DeckInputProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="decklist"
        className="block text-sm font-medium text-gray-300"
      >
        Paste your decklist
      </label>
      <textarea
        id="decklist"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste your decklist here...\n\nSupported formats:\n4 Lightning Bolt\n4 Lightning Bolt (STA) 62\n4x Lightning Bolt`}
        className="w-full h-56 bg-navy-dark border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 font-mono placeholder-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 resize-y"
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="bling-button px-8 py-3 rounded-lg font-bold text-lg text-navy-dark bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {disabled ? "Blinging..." : "✨ Bling It ✨"}
        </button>
        {!value.trim() && (
          <button
            onClick={() => onChange(EXAMPLE_DECK)}
            className="text-sm text-gray-500 hover:text-gold transition-colors underline underline-offset-2"
          >
            Try an example deck
          </button>
        )}
      </div>
      <p className="text-xs text-gray-600">
        Supports MTGO, Arena, and plain text formats. Cmd/Ctrl+Enter to submit.
      </p>
    </div>
  );
}
