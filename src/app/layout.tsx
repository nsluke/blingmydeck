import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Bling Out My Deck — Find the Most Expensive MTG Card Printings",
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
    "bling out my deck",
  ],
  openGraph: {
    title: "Bling Out My Deck — Find the Most Expensive MTG Card Printings",
    description:
      "Paste your decklist and instantly see the most blinged-out version of every card.",
    type: "website",
    url: "https://blingoutmydeck.com",
    siteName: "Bling Out My Deck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bling Out My Deck",
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
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9191648102867518"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
