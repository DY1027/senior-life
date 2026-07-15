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
  return (
    <KioskHub
      catalog={burgerCatalog}
      scenarios={burgerScenarios}
      heading={`${burgerCatalog.brand} 주문 연습`}
      intro={"오늘은 어떤 임무에 도전해 볼까요?\n세트 음료 바꾸기 같은 실제 상황을 연습해요. 실제 결제는 되지 않아요."}
    />
  );
}
