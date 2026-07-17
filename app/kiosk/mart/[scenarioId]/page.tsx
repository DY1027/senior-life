import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { martCatalog, martScenarios, getMartScenario } from "@/content/kiosk-v2/mart";

export function generateStaticParams() {
  return martScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getMartScenario(scenarioId);
  if (!scenario) return { title: "마트 셀프계산대 연습", robots: { index: false, follow: false } };
  return {
    title: `${scenario.title} — 마트 셀프계산대 연습`,
    description: scenario.missionText ?? "든든마트 셀프계산대에서 계산을 연습해 보세요. 실제 결제는 되지 않습니다.",
    alternates: { canonical: `/kiosk/mart/${scenario.id}` },
    robots: { index: false, follow: false },
  };
}

export default async function MartScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getMartScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={martCatalog} scenario={scenario} />;
}
