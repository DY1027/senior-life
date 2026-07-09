import type { Metadata } from "next";
import KioskPlayer from "@/components/kiosk/KioskPlayer";
import type { KioskScenario } from "@/lib/kiosk/types";
import cafeData from "@/content/kiosk/cafe.json";

export const metadata: Metadata = {
  title: "카페 키오스크 연습 — 집에서 미리 눌러보기",
  description:
    "카페 키오스크 주문을 집에서 미리 연습하세요. 매장·포장 선택부터 메뉴, 온도, 잔 수, 계산까지 큰 버튼과 음성 안내로 따라 하면 됩니다. 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/cafe" },
};

// content/kiosk/cafe.json 은 KioskScenario 형태를 따른다.
const scenario = cafeData as unknown as KioskScenario;

export default function CafeKioskPage() {
  return <KioskPlayer scenario={scenario} />;
}
