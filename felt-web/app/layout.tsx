import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// All fonts are self-hosted (latin subset, pulled from Google Fonts / Fontshare)
// so builds are hermetic — no build-time external font fetch, no privacy leak.

// --- Site (marketing) type system: the original warm light pairing ---
const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [{ path: "./fonts/geist/geist-100-900-normal.woff2", weight: "100 900", style: "normal" }],
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [{ path: "./fonts/geist-mono/geist-mono-100-900-normal.woff2", weight: "100 900", style: "normal" }],
});

// Warm humanist serif for emotional headlines and the wordmark.
const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  src: [
    { path: "./fonts/newsreader/newsreader-200-800-normal.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/newsreader/newsreader-200-800-italic.woff2", weight: "200 800", style: "italic" },
  ],
});

// --- felt. night (/app) type system: editorial serif + Switzer UI + Space Mono ---
// Instrument Serif is the big-statement editorial display face.
const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  display: "swap",
  src: [
    { path: "./fonts/instrument/instrument-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument/instrument-400-italic.woff2", weight: "400", style: "italic" },
  ],
});

// Space Mono carries the data labels — distinctive, editorial, not JetBrains.
const spaceMono = localFont({
  variable: "--font-space-mono",
  display: "swap",
  src: [
    { path: "./fonts/space-mono/space-mono-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-mono/space-mono-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

// Switzer (Fontshare) — a clean neo-grotesque for dense UI.
const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "./fonts/switzer/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/switzer/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/switzer/Switzer-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/switzer/Switzer-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "felt. The feedback your people can't give you",
  description:
    "Conversation intelligence for the 1:1s that decide if your best people stay or leave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${switzer.variable} ${instrumentSerif.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
