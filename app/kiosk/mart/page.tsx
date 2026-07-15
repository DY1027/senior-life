import type { Metadata } from "next";
import KioskHub from "@/components/kiosk-engine/KioskHub";
import { martCatalog, martScenarios } from "@/content/kiosk-v2/mart";

export const metadata: Metadata = {
  title: "마트 셀프계산대 연습 — 임무 고르기",
  description:
    "든든마트 셀프계산대에서 상품 스캔, 봉투 선택, 회원 적립 건너뛰기, 카드 결제까지 실제처럼 연습하세요. 바코드 인식 실패도 연습할 수 있어요. 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/mart" },
};

export default function MartMissionHubPage() {
  return (
    <KioskHub
      catalog={martCatalog}
      scenarios={martScenarios}
      heading={`${martCatalog.brand} 셀프계산 연습`}
      intro={"마트 셀프계산대를 미리 연습해요. 상품을 누르는 게 곧 '스캔'이에요.\n같은 상품을 두 번 누르면 수량이 늘어나요. 실제 결제는 되지 않아요."}
    />
  );
}
