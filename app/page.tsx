import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaygroundHero from "@/components/home/PlaygroundHero";
import TodayMission from "@/components/home/TodayMission";
import PracticeGrid from "@/components/home/PracticeGrid";
import PlayCorner from "@/components/home/PlayCorner";
import WeeklyChallenge from "@/components/home/WeeklyChallenge";
import ContinueCard from "@/components/home/ContinueCard";
import NewPracticeBanner from "@/components/home/NewPracticeBanner";
import FAQSection from "@/components/home/FAQSection";
import ClosingScene from "@/components/home/ClosingScene";

// 계절 배경과 '오늘의 연습' 임무가 하루 안에 갱신되도록 매일 재생성한다
export const revalidate = 86400;

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: { absolute: "시니어든든 | 실제처럼 눌러보는 디지털 생활 놀이터" },
  description:
    "카페 주문, 기차표 예매, 주차 정산, 마트 셀프계산대와 ATM까지 실제처럼 눌러보며 연습하는 무료 시니어 디지털 놀이터입니다.",
  alternates: { canonical: "/" },
  keywords: [
    "시니어 키오스크 연습",
    "키오스크 사용법",
    "디지털 기기 연습",
    "시니어 디지털 교육",
    "무인기기 연습",
    "ATM 연습",
    "셀프계산대 연습",
    "주차정산기 연습",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어든든",
    title: "시니어든든 – 실제처럼 눌러보는 디지털 생활 놀이터",
    description: "실제 결제나 발급 없이 생활 속 디지털 기기를 마음껏 눌러보고 반복해서 연습하세요.",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://seniordeundun.com/#organization",
      name: "시니어든든",
      url: "https://seniordeundun.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://seniordeundun.com/#website",
      name: "시니어든든",
      url: "https://seniordeundun.com",
      description:
        "카페 주문, 기차표 예매, 주차 정산, 마트 셀프계산대와 ATM까지 실제처럼 눌러보며 연습하는 무료 시니어 디지털 놀이터입니다.",
      inLanguage: "ko-KR",
      publisher: { "@id": "https://seniordeundun.com/#organization" },
    },
    {
      "@type": "WebApplication",
      "@id": "https://seniordeundun.com/#application",
      name: "시니어든든 디지털 생활 놀이터",
      url: "https://seniordeundun.com",
      applicationCategory: "EducationalApplication",
      operatingSystem: "웹 브라우저",
      description:
        "실제 주문, 결제, 송금 또는 발급 없이 생활 속 디지털 기기 사용을 연습하는 교육용 시뮬레이션입니다.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Header />
      <PlaygroundHero />
      <TodayMission />
      <PracticeGrid />
      <PlayCorner />
      <WeeklyChallenge />
      <ContinueCard />
      <NewPracticeBanner />
      <FAQSection />
      <ClosingScene />
      <Footer />
    </>
  );
}
