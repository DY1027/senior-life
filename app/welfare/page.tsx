import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "복지혜택 정보 — 기초연금·장기요양·돌봄 서비스",
  description: "65세 이상 시니어를 위한 복지혜택 정보. 기초연금 수급자격과 신청방법, 장기요양보험 등급, 노인 맞춤 돌봄 서비스를 안내합니다.",
};

const articles = [
  { title: "기초연금 수급자격과 신청방법 완벽 가이드", desc: "2024년 기준 기초연금 대상자 조건, 신청 절차, 수령 금액을 상세히 안내합니다.", href: "/welfare/basic-pension", tag: "기초연금", icon: "ti-building-bank" },
  { title: "장기요양보험 등급 신청 방법", desc: "국민건강보험공단에 장기요양 등급을 신청하는 전체 과정을 단계별로 설명합니다.", href: "/welfare/long-term-care", tag: "장기요양", icon: "ti-heart-handshake" },
];

export default function WelfarePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "복지혜택" }]} />
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", marginBottom: 4, letterSpacing: "-0.4px" }}>복지혜택 정보</h1>
      <p style={{ fontSize: 13, color: "#9B9890", marginBottom: 24 }}>기초연금·장기요양·정부지원금 안내</p>
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
