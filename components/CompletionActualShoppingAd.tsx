"use client";

import { useEffect, useState } from "react";
import ActualShoppingAdCard, { type ActualShoppingAdCardProps } from "@/components/ActualShoppingAdCard";

export default function CompletionActualShoppingAd({ adKey }: { adKey?: string }) {
  const [ad, setAd] = useState<ActualShoppingAdCardProps | null>(null);

  useEffect(() => {
    if (!adKey) return;
    const controller = new AbortController();
    fetch(`/api/affiliate/completion-ad?key=${encodeURIComponent(adKey)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (value?.affiliateUrl) setAd(value);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [adKey]);

  return ad ? <ActualShoppingAdCard {...ad} /> : null;
}
