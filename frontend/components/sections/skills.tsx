import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function Skills({ profile }: { profile: Profile }) {
  return (
    <section id="skills" className="py-24 px-4 bg-ink-900/60">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">Skills & expertise</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-10">Technical toolkit</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={i * 70}>
              <article className="rounded-2xl border border-white/10 bg-ink-800/60 p-5 h-full">
                <h3 className="font-medium mb-4 text-white">{g.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
