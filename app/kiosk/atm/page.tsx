import type { Metadata } from "next";
import KioskHub from "@/components/kiosk-engine/KioskHub";
import { atmCatalog, atmScenarios } from "@/content/kiosk-v2/atm";

export const metadata: Metadata = {
  title: "은행 ATM 연습 — 임무 고르기",
  description:
    "든든은행 ATM에서 카드 넣기, 비밀번호(연습 번호), 출금, 잔액 확인, 명세표까지 실제처럼 연습하세요. 보이스피싱 경고와 카드 회수 습관도 함께 배워요. 실제 거래는 되지 않습니다.",
  alternates: { canonical: "/kiosk/atm" },
};

export default function AtmMissionHubPage() {
  return (
    <KioskHub
      catalog={atmCatalog}
      scenarios={atmScenarios}
      heading={`${atmCatalog.brand} 연습`}
      intro={"은행 현금인출기를 미리 연습해요. 비밀번호는 화면이 알려주는\n연습 번호(1234)만 써요 — 진짜 비밀번호는 절대 입력하지 마세요."}
    />
  );
}
