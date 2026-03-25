import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Bling Out My Deck",
  description:
    "Learn how Bling Out My Deck helps you find the most expensive printings of every card in your MTG deck.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-gold">About Bling Out My Deck</h1>

      <div className="space-y-4 text-gray-300 leading-relaxed">
        <p>
          <strong className="text-gray-100">Bling Out My Deck</strong> is a free
          tool for Magic: The Gathering players who want to see what it would
          cost to &ldquo;bling out&rdquo; their deck — replacing every card with its
          most expensive available printing.
        </p>

        <h2 className="text-xl font-semibold text-gray-100 pt-4">
          What does &ldquo;blinging&rdquo; mean?
        </h2>
        <p>
          In the MTG community, &ldquo;blinging&rdquo; (also called &ldquo;pimping&rdquo;)
          means upgrading your deck with premium versions of cards. This could
          mean foil printings, old-border reprints, extended art, showcase
          frames, serialized collector editions, or simply the rarest and most
          expensive version available.
        </p>

        <h2 className="text-xl font-semibold text-gray-100 pt-4">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Paste your decklist in any common format (MTGO, Arena, or plain text)</li>
          <li>Choose a filter mode to customize your bling preferences</li>
          <li>Click &ldquo;Bling It&rdquo; and we search every printing of every card</li>
          <li>See the most expensive version of each card with before/after pricing</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-100 pt-4">
          Filter modes
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>No Serialized Cards</strong> — Excludes ultra-rare serialized
            printings that most people can&apos;t realistically buy
          </li>
          <li>
            <strong>Prefer Old Border</strong> — Prioritizes the classic pre-2003
            card frame when available
          </li>
          <li>
            <strong>No Foil Cards</strong> — Only considers non-foil printings for
            players who prefer flat cards
          </li>
          <li>
            <strong>Prefer Oldest Printing</strong> — Among similarly-priced options,
            picks the earliest release date
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100 pt-4">
          Data source
        </h2>
        <p>
          All card data and pricing is provided by{" "}
          <a
            href="https://scryfall.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-light underline underline-offset-2"
          >
            Scryfall
          </a>
          , the most comprehensive Magic: The Gathering database. Prices are
          estimates updated daily and should not be used for storefront or
          sales purposes.
        </p>
      </div>
    </div>
  );
}
