import type { Metadata } from "next";
import HomeHeader from "@/components/home/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import QuickServices from "@/components/home/QuickServices";
import RetirementCalculatorPreview from "@/components/home/RetirementCalculatorPreview";
import HospitalChecklistPreview from "@/components/home/HospitalChecklistPreview";
import CategorySections from "@/components/home/CategorySections";
import GuideSteps from "@/components/home/GuideSteps";
import UseCasesSection from "@/components/home/UseCasesSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import HomeFooter from "@/components/home/HomeFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: "시니어 든든 — 노후자금 계산, 병원 준비, 복지혜택을 한 번에",
  description: "기초연금, 병원 방문 체크리스트, 노후자금 계산기까지. 어르신과 가족이 바로 활용할 수 있는 시니어 생활도구 서비스입니다. 회원가입 없이 바로 사용하세요.",
  alternates: { canonical: "/" },
  keywords: ["시니어든든", "노후자금 계산기", "병원 체크리스트", "기초연금", "시니어 복지혜택", "노인 건강보험"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 노후자금 계산, 병원 준비, 복지혜택을 한 번에",
    description: "어르신과 가족이 바로 활용할 수 있는 시니어 생활도구. 회원가입 없이 바로 사용하세요.",
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <HeroSection />
      <QuickServices />
      <RetirementCalculatorPreview />
      <HospitalChecklistPreview />
      <CategorySections />
      <GuideSteps />
      <UseCasesSection />
      <FAQSection />
      <CTASection />
      <HomeFooter />
    </>
  );
}
