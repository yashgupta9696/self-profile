import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[0.4fr_1fr] gap-10">
        <Reveal direction="left">
          <div>
            <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">About me</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Building calm systems</h2>
          </div>
        </Reveal>
        <Reveal direction="right" delay={80}>
          <div className="space-y-5 text-zinc-400 leading-relaxed">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
