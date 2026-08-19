import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function Experience({ profile }: { profile: Profile }) {
  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">Experience</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-12">Professional journey</h2>
        </Reveal>
        <ol className="space-y-10">
          {profile.experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 90}>
              <li className="relative pl-6 border-l border-white/10">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent" />
                <h3 className="text-xl font-semibold">{job.company}</h3>
                <p className="text-zinc-500 text-sm mb-4">{job.location}</p>
                {job.roles.map((role) => (
                  <div key={role.title + role.start} className="mb-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-accent">{role.title}</p>
                      <p className="text-xs text-zinc-500">
                        {role.start} — {role.end}
                      </p>
                    </div>
                    <ul className="mt-3 space-y-2 text-zinc-400 text-sm leading-relaxed">
                      {role.highlights.map((h) => (
                        <li key={h}>• {h}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {role.tech.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
