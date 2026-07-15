import type { Metadata } from "next";
import KioskHub from "@/components/kiosk-engine/KioskHub";
import { ticketCatalog, ticketScenarios } from "@/content/kiosk-v2/ticket";

export const metadata: Metadata = {
  title: "기차표 예매 연습 — 임무 고르기",
  description:
    "든든기차 발매기에서 행선지·시간·좌석 선택부터 결제까지 실제처럼 연습하세요. 매진 대처, 잘못 고른 표 바꾸기, 카드 오류 해결까지 — 실제 예매는 되지 않습니다.",
  alternates: { canonical: "/kiosk/ticket" },
};

export default function TicketMissionHubPage() {
  return (
    <KioskHub
      catalog={ticketCatalog}
      scenarios={ticketScenarios}
      heading={`${ticketCatalog.brand} 표 예매 연습`}
      intro={"기차역·터미널의 표 발매기를 미리 연습해요.\n행선지와 시간, 좌석을 고르는 흐름이에요. 실제 예매는 되지 않아요."}
    />
  );
}
