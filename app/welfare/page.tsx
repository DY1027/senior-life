import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import BenefitFinder from "@/components/welfare/BenefitFinder";

export const metadata: Metadata = {
  title: "내 혜택 찾아보기 — 기초연금·장기요양·복지혜택 안내",
  description: "나이, 소득, 거동 상태를 선택하면 받을 수 있는 복지혜택을 바로 확인할 수 있습니다. 기초연금, 장기요양, 의료급여, 노인일자리 등 8가지 혜택을 안내합니다.",
  alternates: { canonical: "/welfare" },
};

const articles = [
  { title: "기초연금 수급자격과 신청방법 완벽 가이드", desc: "2026년 기준 기초연금 대상자 조건, 신청 절차, 수령 금액을 상세히 안내합니다.", href: "/welfare/basic-pension", tag: "기초연금", icon: "ti-building-bank" },
  { title: "장기요양보험 등급 신청 방법", desc: "국민건강보험공단에 장기요양 등급을 신청하는 전체 과정을 단계별로 설명합니다.", href: "/welfare/long-term-care", tag: "장기요양", icon: "ti-heart-handshake" },
];

export default function WelfarePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "복지혜택" }]} />

      {/* 혜택 찾기 도구 */}
      <BenefitFinder />

      {/* 구분선 */}
      <div style={{ borderTop: "1px solid #EEECE6", margin: "8px 0 32px" }} />

      {/* 복지혜택 정보 글 */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 4, letterSpacing: "-0.3px" }}>복지혜택 자세히 알아보기</h2>
      <p style={{ fontSize: 13, color: "#9B9890", marginBottom: 20 }}>기초연금·장기요양·정부지원금 상세 안내</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {articles.map((a) => (
          <Link key={a.href} href={a.href} style={{ display: "block", padding: "20px", border: "0.5px solid #EEECE6", borderRadius: 12, background: "#fff", textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#FEF3E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${a.icon}`} style={{ fontSize: 14, color: "#C4621A" }} aria-hidden="true" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#C4621A" }}>{a.tag}</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 4, letterSpacing: "-0.2px" }}>{a.title}</p>
            <p style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.55 }}>{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
