"use client";

import { useEffect, useState } from "react";
import ActualShoppingAdCard, { type ActualShoppingAdCardProps } from "@/components/ActualShoppingAdCard";
import ShoppingActualShoppingSection from "@/components/shopping/ShoppingActualShoppingSection";
import { resolveCoupangPartnersUrl } from "@/lib/affiliate-config";

export default function CompletionActualShoppingAd({ adKey, variant = "kiosk" }: { adKey?: string; variant?: "kiosk" | "shopping" }) {
  const [ad, setAd] = useState<ActualShoppingAdCardProps | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!adKey) return;
    const controller = new AbortController();
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const variant = randomValues[0] % 10;
    fetch(`/api/affiliate/completion-ad?key=${encodeURIComponent(adKey)}&variant=${variant}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (value?.affiliateUrl) setAd(value);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
    return () => controller.abort();
  }, [adKey]);

  if (!loaded) return null;
  const affiliateUrl = resolveCoupangPartnersUrl(ad?.affiliateUrl);
  if (!affiliateUrl) return null;

  return variant === "shopping" ? (
    <ShoppingActualShoppingSection
      affiliateUrl={affiliateUrl}
      affiliateTitle={ad?.title ?? "쿠팡 실제 쇼핑"}
      affiliateDescription={ad?.description}
      imagePath={ad?.imagePath}
    />
  ) : ad ? (
    <ActualShoppingAdCard {...ad} affiliateUrl={affiliateUrl} />
  ) : (
    null
  );
}
