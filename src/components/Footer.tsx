"use client";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-navy-dark/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="text-center md:text-left space-y-1">
            <p>
              Card data provided by{" "}
              <a
                href="https://scryfall.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold underline underline-offset-2"
              >
                Scryfall
              </a>
              . Prices are estimates updated daily.
            </p>
            <p>
              Bling Out My Deck is not affiliated with Wizards of the Coast.
              Magic: The Gathering is a trademark of Wizards of the Coast LLC.
            </p>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p>
              Card purchase links may include affiliate tags.
            </p>
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} Bling Out My Deck
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
