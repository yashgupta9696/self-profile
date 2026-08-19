"use client";

import Link from "next/link";
import { useState } from "react";
import type { Profile } from "@/lib/types";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-semibold tracking-tight text-lg">
          Life's Shake<span className="text-accent">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition">
              {l.label}
            </Link>
          ))}
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="text-ink-950 bg-accent hover:bg-accent-dim font-medium px-3 py-1.5 rounded-full transition"
          >
            Projects
          </a>
        </nav>
        <button
          className="md:hidden text-zinc-300"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-zinc-300 border-t border-white/5 bg-ink-950">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            Projects on GitHub
          </a>
        </div>
      )}
    </header>
  );
}
