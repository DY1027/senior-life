import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seniordeundun.com";
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/welfare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/welfare/basic-pension`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/welfare/long-term-care`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/health`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/health/insurance-copay`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/health/checkup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/health/hospital-checklist`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/finance`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/finance/national-pension`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/finance/living-cost`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/finance/retirement`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/life-tips`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/life-tips/senior-discount`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/life-tips/family-care`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kiosk`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/kiosk/cafe`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kiosk/hospital`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kiosk/fastfood`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kiosk/civil`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/stories`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/stories/phishing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // /brain, /making 은 완성돼 있으나 보류 중 — 공개 시 여기와 홈 타일·헤더 nav 를 되돌릴 것
  ];
}
