import type { Profile } from "@/lib/types";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-xl font-semibold mb-2">
            {profile.name}
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">{profile.tagline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Links</p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>
              <a className="hover:text-accent" href="/#about">
                About
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href="/#experience">
                Experience
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href="/#schedule">
                Schedule
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href={profile.socials.github} target="_blank" rel="noreferrer">
                Projects (GitHub)
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Connect</p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>
              <a className="hover:text-accent" href={profile.socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href={profile.socials.twitter} target="_blank" rel="noreferrer">
                Twitter / X
              </a>
            </li>
            <li className="text-zinc-500">YouTube — in progress</li>
            <li>
              <a className="hover:text-accent" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 text-center text-xs text-zinc-600 py-4">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
      </div>
    </footer>
  );
}
