import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MissionList from "@/components/kiosk-engine/MissionList";
import { cafeCatalog, cafeScenarios } from "@/content/kiosk-v2/cafe";

export const metadata: Metadata = {
  title: "카페 주문 연습 — 임무 고르기",
  description:
    "든든카페에서 실제처럼 주문을 연습하세요. 천천히 배우기, 혼자 연습하기, 실제처럼 도전까지 — 잘못 담은 메뉴 삭제, 카드 오류 해결 같은 실제 상황도 연습할 수 있어요. 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/cafe" },
};

export default function CafeMissionHubPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-5 pb-14 pt-8">
        <div className="mb-7 text-center">
          <p className="text-[44px]" aria-hidden="true">{cafeCatalog.emoji}</p>
          <h1 className="mt-1 text-[clamp(24px,5vw,32px)] font-extrabold leading-tight tracking-[-0.5px] text-[#3B3226]">
            {cafeCatalog.brand} 주문 연습
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[#4A5568]">
            오늘은 어떤 임무에 도전해 볼까요?<br />
            같은 카페라도 임무마다 상황이 달라요. 실제 결제는 되지 않아요.
          </p>
        </div>
        <MissionList kioskType="cafe" scenarios={cafeScenarios} />
      </main>
      <Footer />
    </>
  );
}
