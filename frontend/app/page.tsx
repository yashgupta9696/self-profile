"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { GithubCta } from "@/components/sections/github-cta";
import { Hero } from "@/components/sections/hero";
import { Schedule } from "@/components/sections/schedule";
import { Skills } from "@/components/sections/skills";
import { useProfile } from "@/lib/use-profile";

export default function HomePage() {
  const profile = useProfile();

  return (
    <>
      <Header profile={profile} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills profile={profile} />
        <Experience profile={profile} />
        <Education profile={profile} />
        <GithubCta href={profile.socials.github} />
        <Schedule profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
