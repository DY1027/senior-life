import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { atmCatalog, atmScenarios, getAtmScenario } from "@/content/kiosk-v2/atm";

export function generateStaticParams() {
  return atmScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getAtmScenario(scenarioId);
  if (!scenario) return { title: "은행 ATM 연습" };
  return {
    title: `${scenario.title} — 은행 ATM 연습`,
    description: scenario.missionText ?? "든든은행 ATM에서 출금과 잔액 확인을 연습해 보세요. 실제 거래는 되지 않습니다.",
    alternates: { canonical: `/kiosk/atm/${scenario.id}` },
  };
}

export default async function AtmScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getAtmScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={atmCatalog} scenario={scenario} />;
}
