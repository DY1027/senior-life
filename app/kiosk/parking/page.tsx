import type { Metadata } from "next";
import KioskPlayer from "@/components/kiosk/KioskPlayer";
import type { KioskScenario } from "@/lib/kiosk/types";
import parkingData from "@/content/kiosk/parking.json";

export const metadata: Metadata = {
  title: "주차요금 정산기 연습 — 집에서 미리 눌러보기",
  description:
    "마트·건물 주차장의 주차요금 정산기를 집에서 미리 연습하세요. 차량 번호 입력, 요금 확인, 할인 적용, 카드 결제까지 큰 버튼과 음성 안내로 따라 하면 됩니다. 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/parking" },
};

// content/kiosk/parking.json 은 KioskScenario 형태를 따른다.
const scenario = parkingData as unknown as KioskScenario;

export default function ParkingKioskPage() {
  return <KioskPlayer scenario={scenario} />;
}
