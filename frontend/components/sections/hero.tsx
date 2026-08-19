import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative pt-28 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-70 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.4fr_0.8fr] gap-12 items-center">
        <Reveal immediate direction="left">
          <div>
            <p className="text-accent text-sm tracking-[0.25em] uppercase mb-4">Hello, I&apos;m</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] mb-6">
              {profile.name}
            </h1>
            <p className="text-xl text-zinc-300 mb-3">{profile.headline}</p>
            <p className="text-zinc-400 max-w-xl leading-relaxed mb-8">{profile.summary}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-accent text-ink-950 font-medium hover:bg-white transition"
              >
                View GitHub
              </a>
              <a
                href="/#schedule"
                className="px-5 py-2.5 rounded-full border border-white/15 hover:border-accent/50 transition"
              >
                Book a time
              </a>
              <a
                href="/#contact"
                className="px-5 py-2.5 rounded-full border border-white/15 hover:border-accent/50 transition"
              >
                Contact me
              </a>
            </div>
            <div className="flex gap-5 mt-8 text-sm text-zinc-500">
              <a className="hover:text-accent" href={profile.socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="hover:text-accent" href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="hover:text-accent" href={profile.socials.twitter} target="_blank" rel="noreferrer">
                Twitter
              </a>
              <span className="text-zinc-600">YouTube soon</span>
            </div>
          </div>
        </Reveal>
        <Reveal immediate direction="right" delay={120} className="justify-self-center">
          <div>
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border border-accent/30 shadow-glow overflow-hidden bg-ink-800">
              <Image
                src="/profile.png"
                alt={`Portrait of ${profile.name}`}
                width={288}
                height={288}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
            <p className="text-center text-zinc-500 mt-4 text-sm">{profile.location}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
