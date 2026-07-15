import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaygroundHero from "@/components/home/PlaygroundHero";
import TodayMission from "@/components/home/TodayMission";
import PracticeGrid from "@/components/home/PracticeGrid";
import PlayCorner from "@/components/home/PlayCorner";
import ContinueCard from "@/components/home/ContinueCard";
import NewPracticeBanner from "@/components/home/NewPracticeBanner";
import FAQSection from "@/components/home/FAQSection";
import ClosingScene from "@/components/home/ClosingScene";

// 계절 배경과 '오늘의 연습' 임무가 하루 안에 갱신되도록 매일 재생성한다
export const revalidate = 86400;

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: "시니어 든든 — 실제처럼 눌러보는 디지털 생활 놀이터",
  description:
    "카페 주문, 햄버거 주문, 주차요금 정산, 서류 발급까지 생활 속 디지털 기기를 실제처럼 연습하세요. 실제 결제 없이 큰 글씨와 음성 안내로, 회원가입 없이 무료입니다.",
  alternates: { canonical: "/" },
  keywords: ["시니어든든", "시니어 놀이터", "키오스크 연습", "주차요금 정산기 연습", "무인민원발급기 연습", "어르신 디지털 교육"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 실제처럼 눌러보는 디지털 생활 놀이터",
    description: "카페 주문부터 주차요금 정산까지. 실제 결제 없이 마음껏 연습하세요.",
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <PlaygroundHero />
      <TodayMission />
      <PracticeGrid />
      <PlayCorner />
      <ContinueCard />
      <NewPracticeBanner />
      <FAQSection />
      <ClosingScene />
      <Footer />
    </>
  );
}
