import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Yash Gupta | Backend Engineer",
  description:
    "Backend engineer in Bengaluru. APIs, data pipelines, storage, and systems that stay fast when traffic spikes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${syne.variable}`}>
      <body className="font-sans antialiased bg-ink-950 min-h-screen">{children}</body>
    </html>
  );
}
