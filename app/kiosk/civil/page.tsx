import type { Metadata } from "next";
import KioskHub from "@/components/kiosk-engine/KioskHub";
import { civilCatalog, civilScenarios } from "@/content/kiosk-v2/civil";

export const metadata: Metadata = {
  title: "무인민원발급기 연습 — 임무 고르기",
  description:
    "든든민원 발급기에서 등본·초본·가족관계증명서 발급을 실제처럼 연습하세요. 주민등록번호 표시 선택, 수수료 결제, 카드 오류 해결까지 — 실제 발급은 되지 않습니다.",
  alternates: { canonical: "/kiosk/civil" },
};

export default function CivilMissionHubPage() {
  return <KioskHub catalog={civilCatalog} scenarios={civilScenarios} />;
}
