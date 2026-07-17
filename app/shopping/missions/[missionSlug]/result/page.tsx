import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingResult from "@/components/shopping/ShoppingResult";
import { getShoppingMission, SHOPPING_MISSIONS } from "@/content/shopping";

export const metadata: Metadata = { title: "쇼핑 연습 결과", robots: { index: false, follow: false } };
type Props = { params: Promise<{ missionSlug: string }> };

export function generateStaticParams() {
  return SHOPPING_MISSIONS.map((mission) => ({ missionSlug: mission.slug }));
}

export default async function ShoppingResultPage({ params }: Props) {
  const { missionSlug } = await params;
  const mission = getShoppingMission(missionSlug);
  if (!mission) notFound();
  return <><Header /><ShoppingResult mission={mission} /><Footer /></>;
}
