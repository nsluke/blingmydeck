import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Bling My Deck",
  description:
    "Frequently asked questions about finding the most expensive MTG card printings and blinging out your deck.",
};

const faqs = [
  {
    q: "What decklist formats are supported?",
    a: 'MTGO format ("4 Lightning Bolt"), Arena format ("4 Lightning Bolt (STA) 62"), and plain text with "x" ("4x Lightning Bolt"). Section headers like "Sideboard" and "Commander" are detected automatically.',
  },
  {
    q: "Where do the prices come from?",
    a: "All prices come from Scryfall, which aggregates pricing data from major card retailers. Prices are estimates updated once per day.",
  },
  {
    q: "What makes a card printing expensive?",
    a: "Several factors: limited print runs, foil treatments (regular foil, etched foil), premium frames (old border, extended art, showcase), promotional printings, and serialized collector editions.",
  },
  {
    q: 'What are "serialized" cards?',
    a: "Serialized cards have a unique number stamped on them (e.g., 042/500). They are extremely rare and expensive. The \"No Serialized Cards\" filter excludes these from results.",
  },
  {
    q: "Why would I prefer old border cards?",
    a: "Old border (pre-2003 frame) cards have a nostalgic charm and are highly sought after by collectors. Wizards of the Coast has reprinted some cards with the old frame, creating premium versions of modern staples.",
  },
  {
    q: "Can I share my blinged deck with others?",
    a: 'Yes! After blinging your deck, click "Copy Share Link" to get a URL that anyone can open to see your results.',
  },
  {
    q: "Are the purchase links affiliate links?",
    a: "Some purchase links may include affiliate tags that help support the site at no extra cost to you. This is disclosed in the footer.",
  },
  {
    q: "How long does it take to bling a deck?",
    a: "A typical 60-card deck takes about 5 seconds. A 100-card Commander deck takes about 10 seconds. We fetch every printing of every card from Scryfall to find the most expensive version.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-gold">
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-100">{faq.q}</h2>
            <p className="text-gray-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
