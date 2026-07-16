import type { Metadata } from "next";
import KioskHub from "@/components/kiosk-engine/KioskHub";
import { parkingCatalog, parkingScenarios } from "@/content/kiosk-v2/parking";

export const metadata: Metadata = {
  title: "주차요금 정산기 연습 — 임무 고르기",
  description:
    "든든주차 정산기에서 차량 번호 입력, 내 차 찾기, 할인 적용, 카드 결제까지 실제처럼 연습하세요. 카드 인식 오류 해결도 연습할 수 있어요. 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/parking" },
};

export default function ParkingMissionHubPage() {
  return <KioskHub catalog={parkingCatalog} scenarios={parkingScenarios} />;
}
