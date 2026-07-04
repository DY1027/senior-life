import type { Metadata } from "next";
import HomeHeader from "@/components/home/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import QuickServices from "@/components/home/QuickServices";
import RetirementCalculatorPreview from "@/components/home/RetirementCalculatorPreview";
import HealthHospitalSection from "@/components/home/HealthHospitalSection";
import LifeInfoSection from "@/components/home/LifeInfoSection";
import GuideSteps from "@/components/home/GuideSteps";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import HomeFooter from "@/components/home/HomeFooter";

export const metadata: Metadata = {
  title: "시니어 든든 — 더 쉽고 든든한 시니어 생활",
  description: "노후자금부터 건강, 병원 방문, 복약 기록, 생활정보까지 시니어의 일상을 편리하고 안전하게 도와드립니다. 기초연금, 건강보험, 복지혜택을 한 번에.",
  keywords: ["시니어", "노인복지", "기초연금", "노후자금 계산기", "건강보험", "복약 관리", "시니어든든"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 더 쉽고 든든한 시니어 생활",
    description: "노후자금부터 건강, 병원 방문, 복약 기록, 생활정보까지 한 번에",
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <HeroSection />
      <QuickServices />
      <RetirementCalculatorPreview />
      <HealthHospitalSection />
      <LifeInfoSection />
      <GuideSteps />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <HomeFooter />
    </>
  );
}
