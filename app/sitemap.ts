import type { MetadataRoute } from "next";

const BASE_URL = "https://seniordeundun.com";

const publicRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/kiosk", changeFrequency: "weekly", priority: 0.9 },
  { path: "/kiosk/cafe", changeFrequency: "weekly", priority: 0.8 },
  { path: "/kiosk/fastfood", changeFrequency: "weekly", priority: 0.8 },
  { path: "/kiosk/ticket", changeFrequency: "weekly", priority: 0.8 },
  { path: "/kiosk/parking", changeFrequency: "weekly", priority: 0.8 },
  { path: "/kiosk/mart", changeFrequency: "weekly", priority: 0.8 },
  { path: "/kiosk/atm", changeFrequency: "weekly", priority: 0.8 },
  { path: "/kiosk/civil", changeFrequency: "weekly", priority: 0.8 },
  { path: "/play", changeFrequency: "weekly", priority: 0.8 },
  { path: "/brain", changeFrequency: "weekly", priority: 0.7 },
  { path: "/brain/matching", changeFrequency: "monthly", priority: 0.7 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/stories/phishing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/making", changeFrequency: "weekly", priority: 0.7 },
  { path: "/making/calendar", changeFrequency: "monthly", priority: 0.7 },
  { path: "/guide", changeFrequency: "monthly", priority: 0.5 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
