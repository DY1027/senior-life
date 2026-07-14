import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaygroundHero from "@/components/home/PlaygroundHero";
import PlayTiles from "@/components/home/PlayTiles";
import PracticeRow from "@/components/home/PracticeRow";
import StoryBanner from "@/components/home/StoryBanner";
import MakingBanner from "@/components/home/MakingBanner";
import InfoCategories from "@/components/home/InfoCategories";
import FAQSection from "@/components/home/FAQSection";
import ClosingScene from "@/components/home/ClosingScene";

// 계절 배경(PlaygroundHero)이 하루 안에 갱신되도록 매일 재생성한다
export const revalidate = 86400;

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: "시니어 든든 — 눌러보며 배우는 시니어 놀이터",
  description:
    "키오스크 연습, 복지혜택 찾기, 병원 준비, 노후자금 계산까지. 어르신이 눌러보며 배우고 가족이 함께 쓰는 시니어 놀이터입니다. 회원가입 없이 무료로 사용하세요.",
  alternates: { canonical: "/" },
  keywords: ["시니어든든", "시니어 놀이터", "키오스크 연습", "노후자금 계산기", "기초연금", "시니어 복지혜택", "병원 체크리스트"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 눌러보며 배우는 시니어 놀이터",
    description: "키오스크 연습, 복지혜택 찾기, 병원 준비까지. 회원가입 없이 무료로 사용하세요.",
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <PlaygroundHero />
      <PlayTiles />
      <PracticeRow />
      <StoryBanner />
      <MakingBanner />
      <InfoCategories />
      <FAQSection />
      <ClosingScene />
      <Footer />
    </>
  );
}
