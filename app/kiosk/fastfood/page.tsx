import type { Metadata } from "next";
import KioskHub from "@/components/kiosk-engine/KioskHub";
import { burgerCatalog, burgerScenarios } from "@/content/kiosk-v2/burger";

export const metadata: Metadata = {
  title: "햄버거 주문 연습 — 임무 고르기",
  description:
    "든든버거에서 실제처럼 주문을 연습하세요. 세트 음료 바꾸기, 잘못 담은 메뉴 삭제, 카드 오류 해결까지 — 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/fastfood" },
};

export default function BurgerMissionHubPage() {
  return <KioskHub catalog={burgerCatalog} scenarios={burgerScenarios} />;
}
