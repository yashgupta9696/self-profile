import { Reveal } from "@/components/reveal";

export function GithubCta({ href }: { href: string }) {
  return (
    <section className="py-16 px-4">
      <Reveal>
        <div className="max-w-6xl mx-auto rounded-3xl border border-accent/20 bg-gradient-to-br from-ink-800 to-ink-950 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-glow">
          <div>
            <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">Projects</p>
            <h2 className="font-display text-3xl font-semibold mb-2">Work lives on GitHub</h2>
            <p className="text-zinc-400 max-w-xl">
              I am not listing a project gallery here. Repos, experiments, and older university work
              are on GitHub — that is the source of truth.
            </p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-accent text-ink-950 font-medium hover:bg-white transition whitespace-nowrap"
          >
            Open GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}
