import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function Education({ profile }: { profile: Profile }) {
  return (
    <section id="education" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">Education</p>
          <h2 className="font-display text-3xl font-semibold mb-8">Schooling</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {profile.education.map((ed, i) => (
            <Reveal key={ed.school} delay={i * 100}>
              <article className="rounded-2xl border border-white/10 p-5 bg-ink-900/40 h-full">
                <p className="text-xs text-zinc-500 mb-1">{ed.dates}</p>
                <h3 className="font-semibold">{ed.school}</h3>
                <p className="text-accent text-sm mb-3">{ed.credential}</p>
                <ul className="text-sm text-zinc-400 space-y-1">
                  {ed.notes.map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
