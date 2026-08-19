export type SkillGroup = { title: string; items: string[] };

export type Role = {
  title: string;
  start: string;
  end: string;
  highlights: string[];
  tech: string[];
};

export type Experience = {
  company: string;
  location: string;
  roles: Role[];
};

export type Education = {
  school: string;
  credential: string;
  dates: string;
  notes: string[];
};

export type Profile = {
  name: string;
  headline: string;
  tagline: string;
  location: string;
  summary: string;
  about: string[];
  email: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    youtube: string | null;
    cal: string;
  };
  calUsername: string;
  calEventSlug: string;
  skillGroups: SkillGroup[];
  experience: Experience[];
  education: Education[];
};
