import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskRunner from "@/components/kiosk-engine/KioskRunner";
import { burgerCatalog, burgerScenarios, getBurgerScenario } from "@/content/kiosk-v2/burger";

export function generateStaticParams() {
  return burgerScenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getBurgerScenario(scenarioId);
  if (!scenario) return { title: "햄버거 주문 연습" };
  return {
    title: `${scenario.title} — 햄버거 주문 연습`,
    description: scenario.missionText ?? "든든버거에서 실제처럼 주문을 연습해 보세요. 실제 결제는 되지 않습니다.",
    alternates: { canonical: `/kiosk/fastfood/${scenario.id}` },
  };
}

export default async function BurgerScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getBurgerScenario(scenarioId);
  if (!scenario) notFound();
  return <KioskRunner catalog={burgerCatalog} scenario={scenario} />;
}
