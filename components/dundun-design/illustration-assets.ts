import type { KioskId } from "@/lib/kiosk-config";

const base = "/images/dundun";

export const illustrations = {
  homeHero: `${base}/hero-digital-playground.webp`,
  practiceVillage: `${base}/practice-village.webp`,
  cafe: `${base}/kiosk-cafe.webp`,
  fastfood: "/tiles/kiosk-fastfood.webp",
  ticket: `${base}/kiosk-ticket.webp`,
  parking: `${base}/kiosk-parking.webp`,
  mart: `${base}/kiosk-mart.webp`,
  atm: `${base}/kiosk-atm.webp`,
  civil: "/tiles/kiosk-civil.webp",
  mistakeGuide: `${base}/guide-mistake.webp`,
  practiceComplete: `${base}/complete-practice.webp`,
  weeklyChallenge: `${base}/challenge-weekly.webp`,
  playgroundHero: `${base}/hero-playground.webp`,
  safetyHero: `${base}/hero-safety.webp`,
  emptyRecords: `${base}/mascot-cafe-guide.webp`,
  newPractice: `${base}/new-practice.webp`,
  cafeGuide: `${base}/mascot-cafe-guide.webp`,
} as const;

export const kioskIllustrations: Record<KioskId, string> = {
  cafe: illustrations.cafe,
  fastfood: illustrations.fastfood,
  ticket: illustrations.ticket,
  parking: illustrations.parking,
  mart: illustrations.mart,
  atm: illustrations.atm,
  civil: illustrations.civil,
};
