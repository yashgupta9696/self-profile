"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "@/components/reveal";
import type { Profile } from "@/lib/types";

export function Contact({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setError(body.error || "Could not send");
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
      setError("Network error");
    }
  }

  return (
    <section id="contact" className="py-24 px-4 bg-ink-900/60">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        <Reveal direction="left">
          <div>
            <p className="text-accent text-sm tracking-[0.2em] uppercase mb-2">Get in touch</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Let&apos;s connect</h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Tell me the bottleneck — a slow pipeline, a brittle service, or a launch you need to
              hit. I usually reply within a business day.
            </p>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd>
                  <a className="text-accent hover:underline" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Location</dt>
                <dd className="text-zinc-200">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Calendar</dt>
                <dd>
                  <a className="text-accent hover:underline" href="/#schedule">
                    Jump to calendar
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal direction="right" delay={100}>
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 p-6 bg-ink-800/40">
            <label className="block text-sm">
              Name
              <input
                name="name"
                required
                className="mt-1 w-full rounded-lg bg-ink-950 border border-white/10 px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg bg-ink-950 border border-white/10 px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              Message
              <textarea
                name="message"
                required
                rows={5}
                className="mt-1 w-full rounded-lg bg-ink-950 border border-white/10 px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 rounded-full bg-accent text-ink-950 font-medium hover:bg-white transition disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "ok" && <p className="text-accent text-sm">Thanks — I will get back to you.</p>}
            {status === "err" && <p className="text-red-400 text-sm">{error}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
