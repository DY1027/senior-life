import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { parkingCatalog, parkingScenarios, getParkingScenario } from "@/content/kiosk-v2/parking";

export function generateStaticParams() {
  return parkingScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getParkingScenario(scenarioId);
  if (!scenario) return { title: "주차요금 정산기 연습" };
  return {
    title: `${scenario.title} — 주차요금 정산기 연습`,
    description: scenario.missionText ?? "든든주차 정산기에서 주차요금 정산을 연습해 보세요. 실제 결제는 되지 않습니다.",
    alternates: { canonical: `/kiosk/parking/${scenario.id}` },
  };
}

export default async function ParkingScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getParkingScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={parkingCatalog} scenario={scenario} />;
}
