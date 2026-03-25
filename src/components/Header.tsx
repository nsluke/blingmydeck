"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gold/20 bg-navy-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">✨</span>
          <span className="text-xl font-bold text-gold group-hover:text-gold-light transition-colors">
            Bling My Deck
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/about"
            className="text-gray-400 hover:text-gold transition-colors"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-gray-400 hover:text-gold transition-colors"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}
