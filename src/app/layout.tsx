import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bling My Deck — Find the Most Expensive MTG Card Printings",
  description:
    "Paste your Magic: The Gathering decklist and instantly find the most expensive printing of every card. Bling out your deck with foils, old borders, and rare printings.",
  keywords: [
    "MTG",
    "Magic: The Gathering",
    "bling",
    "pimp my deck",
    "most expensive printing",
    "foil",
    "old border",
    "deck upgrade",
  ],
  openGraph: {
    title: "Bling My Deck — Find the Most Expensive MTG Card Printings",
    description:
      "Paste your decklist and instantly see the most blinged-out version of every card.",
    type: "website",
    siteName: "Bling My Deck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bling My Deck",
    description:
      "Paste your decklist and instantly find the most expensive printing of every card.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
