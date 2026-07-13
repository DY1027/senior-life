import type { Metadata } from "next";
import KioskPlayer from "@/components/kiosk/KioskPlayer";
import type { KioskScenario } from "@/lib/kiosk/types";
import civilData from "@/content/kiosk/civil.json";

export const metadata: Metadata = {
  title: "무인민원발급기 연습 — 등본·가족관계증명서 미리 눌러보기",
  description:
    "주민센터·지하철역 무인민원발급기를 집에서 미리 연습하세요. 주민등록등본, 초본, 가족관계증명서 발급과 지문 본인 확인까지 큰 버튼과 음성 안내로 따라 하면 됩니다. 실제 발급은 되지 않습니다.",
  alternates: { canonical: "/kiosk/civil" },
};

// content/kiosk/civil.json 은 KioskScenario 형태를 따른다.
const scenario = civilData as unknown as KioskScenario;

export default function CivilKioskPage() {
  return <KioskPlayer scenario={scenario} />;
}
