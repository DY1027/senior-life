import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { ticketCatalog, ticketScenarios, getTicketScenario } from "@/content/kiosk-v2/ticket";

export function generateStaticParams() {
  return ticketScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getTicketScenario(scenarioId);
  if (!scenario) return { title: "기차표 예매 연습" };
  return {
    title: `${scenario.title} — 기차표 예매 연습`,
    description: scenario.missionText ?? "든든기차 발매기에서 표 예매를 연습해 보세요. 실제 예매는 되지 않습니다.",
    alternates: { canonical: `/kiosk/ticket/${scenario.id}` },
  };
}

export default async function TicketScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getTicketScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={ticketCatalog} scenario={scenario} />;
}
