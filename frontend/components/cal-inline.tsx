"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

type CalInlineProps = {
  username: string;
  eventSlug: string;
};

export function CalInline({ username, eventSlug }: CalInlineProps) {
  const calLink = `${username}/${eventSlug}`;

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "profile" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: "#2dd4bf" } },
      });
    })();
  }, []);

  return (
    <Cal
      namespace="profile"
      calLink={calLink}
      style={{ width: "100%", height: "100%", minHeight: "720px", overflow: "auto" }}
      config={{
        layout: "month_view",
        theme: "dark",
      }}
    />
  );
}
