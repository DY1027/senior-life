import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShoppingPracticeRunner from "@/components/shopping/ShoppingPracticeRunner";
import { getShoppingMission, SHOPPING_MISSIONS } from "@/content/shopping";

export const metadata: Metadata = { title: "쇼핑 연습 진행", robots: { index: false, follow: false } };
type Props = { params: Promise<{ missionSlug: string }> };

export function generateStaticParams() {
  return SHOPPING_MISSIONS.map((mission) => ({ missionSlug: mission.slug }));
}

export default async function ShoppingPracticePage({ params }: Props) {
  const { missionSlug } = await params;
  const mission = getShoppingMission(missionSlug);
  if (!mission) notFound();
  return <ShoppingPracticeRunner mission={mission} />;
}
