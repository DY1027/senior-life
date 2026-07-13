import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RetirementCalculatorPreview from "@/components/home/RetirementCalculatorPreview";

export const metadata: Metadata = {
  title: "노후자금 계산기 — 준비 상태 진단",
  description:
    "목표 노후자금과 현재 저축을 입력하면 준비 상태를 진단해드립니다. 회원가입 없이 바로 사용하는 참고용 노후자금 계산기입니다.",
  alternates: { canonical: "/finance/retirement" },
};

export default function RetirementCalculatorPage() {
  return (
    <>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 0" }}>
        <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "노후재정", href: "/finance" }, { label: "노후자금 계산기" }]} />
      </div>
      <RetirementCalculatorPreview />
    </>
  );
}
