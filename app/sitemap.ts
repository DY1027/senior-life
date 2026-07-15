import type { MetadataRoute } from "next";
import { cafeScenarios } from "@/content/kiosk-v2/cafe";
import { burgerScenarios } from "@/content/kiosk-v2/burger";
import { civilScenarios } from "@/content/kiosk-v2/civil";
import { parkingScenarios } from "@/content/kiosk-v2/parking";
import { martScenarios } from "@/content/kiosk-v2/mart";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seniordeundun.com";
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    // 생활기기 연습 (핵심)
    { url: `${base}/kiosk`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/kiosk/cafe`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kiosk/fastfood`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kiosk/civil`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kiosk/parking`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kiosk/mart`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...[
      ...cafeScenarios.map((s) => `/kiosk/cafe/${s.id}`),
      ...burgerScenarios.map((s) => `/kiosk/fastfood/${s.id}`),
      ...civilScenarios.map((s) => `/kiosk/civil/${s.id}`),
      ...parkingScenarios.map((s) => `/kiosk/parking/${s.id}`),
      ...martScenarios.map((s) => `/kiosk/mart/${s.id}`),
    ].map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // 오늘의 놀이터 + 생활안전
    { url: `${base}/play`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/brain`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/brain/matching`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/stories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/stories/phishing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/making`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/making/calendar`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // 이용안내
    { url: `${base}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // 생활정보 보관함 — 메뉴에서는 뺐지만 검색 유입이 있어 주소는 유지한다
    { url: `${base}/welfare`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/welfare/basic-pension`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/welfare/long-term-care`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/finance`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/finance/national-pension`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/finance/living-cost`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/finance/retirement`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/life-tips`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/life-tips/senior-discount`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/life-tips/family-care`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
