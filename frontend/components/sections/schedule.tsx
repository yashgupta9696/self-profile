import { CalInline } from "@/components/cal-inline";
import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function Schedule({ profile }: { profile: Profile }) {
  return (
    <section id="schedule" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">Scheduler</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">Book time</h2>
          <p className="text-zinc-400 max-w-2xl mb-8">
            Pick a slot here — the calendar stays on this page. Email still works if you would
            rather skip booking.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-2xl border border-white/10 bg-ink-900 overflow-hidden min-h-[720px] shadow-glow">
            <CalInline username={profile.calUsername} eventSlug={profile.calEventSlug} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
