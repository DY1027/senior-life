import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { cafeCatalog, cafeScenarios, getCafeScenario } from "@/content/kiosk-v2/cafe";

export function generateStaticParams() {
  return cafeScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getCafeScenario(scenarioId);
  if (!scenario) return { title: "카페 주문 연습" };
  return {
    title: `${scenario.title} — 카페 주문 연습`,
    description: scenario.missionText ?? "든든카페에서 실제처럼 주문을 연습해 보세요. 실제 결제는 되지 않습니다.",
    alternates: { canonical: `/kiosk/cafe/${scenario.id}` },
  };
}

export default async function CafeScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getCafeScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={cafeCatalog} scenario={scenario} />;
}
