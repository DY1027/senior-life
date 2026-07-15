import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { civilCatalog, civilScenarios, getCivilScenario } from "@/content/kiosk-v2/civil";

export function generateStaticParams() {
  return civilScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getCivilScenario(scenarioId);
  if (!scenario) return { title: "무인민원발급기 연습" };
  return {
    title: `${scenario.title} — 무인민원발급기 연습`,
    description: scenario.missionText ?? "든든민원 발급기에서 서류 발급을 연습해 보세요. 실제 발급은 되지 않습니다.",
    alternates: { canonical: `/kiosk/civil/${scenario.id}` },
  };
}

export default async function CivilScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getCivilScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={civilCatalog} scenario={scenario} />;
}
