import type { Profile } from "./types";
import data from "../data/profile.json";

export const fallbackProfile = data as Profile;

export async function loadProfile(): Promise<Profile> {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) return fallbackProfile;
    return (await res.json()) as Profile;
  } catch {
    return fallbackProfile;
  }
}
