"use client";

import { useEffect, useState } from "react";
import { fallbackProfile, loadProfile } from "@/lib/profile";
import type { Profile } from "@/lib/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  return profile;
}
