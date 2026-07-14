import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "노후재정 정보 — 국민연금·노후자금·생활비 계산",
  description: "시니어를 위한 노후재정 정보. 국민연금 예상 수령액 조회 방법, 노후 생활비 계산기, 퇴직 후 절세 방법을 안내합니다.",
  alternates: { canonical: "/finance" },
};

const articles = [
  { title: "노후자금 계산기 — 준비 상태 진단", desc: "목표 금액과 현재 저축을 입력하면 노후 준비 상태를 진단하고 다음 확인할 것을 알려드립니다.", href: "/finance/retirement", tag: "계산기", icon: "ti-calculator", tagBg: "#FDF0E0", tagColor: "#C4621A", tagBorder: "#FDDFC0" },
  { title: "국민연금 예상 수령액 조회 방법", desc: "국민연금공단 앱과 홈페이지에서 예상 연금액을 조회하는 방법을 단계별로 안내합니다.", href: "/finance/national-pension", tag: "국민연금", icon: "ti-chart-line", tagBg: "#FDF0E0", tagColor: "#C4621A", tagBorder: "#FDDFC0" },
  { title: "노후 생활비 계산기 — 얼마가 필요할까?", desc: "부부·개인별 적정 노후 생활비와 현재 준비 상태를 점검하는 방법을 안내합니다.", href: "/finance/living-cost", tag: "노후준비", icon: "ti-calculator", tagBg: "#FDF0E0", tagColor: "#C4621A", tagBorder: "#FDDFC0" },
];

export default function FinancePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 56px" }}>
      <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "노후재정" }]} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FDF0E0", color: "#C4621A", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #FDDFC0", marginBottom: 14 }}>
        <i className="ti ti-coin" style={{ fontSize: 11 }} aria-hidden="true" />노후재정
      </div>
      <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 8 }}>노후재정 정보</h1>
      <p style={{ fontSize: 14, color: "#6B6860", marginBottom: 28 }}>국민연금·노후자금·생활비 계산 안내</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {articles.map((a) => (
          <Link key={a.href} href={a.href} style={{ display: "block", padding: "18px 20px", background: "#FAFAF8", borderRadius: 14, border: "0.5px solid #EEECE6", textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: a.tagBg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${a.icon}`} style={{ fontSize: 14, color: a.tagColor }} aria-hidden="true" />
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: a.tagColor, background: a.tagBg, padding: "2px 8px", borderRadius: 999, border: `0.5px solid ${a.tagBorder}` }}>{a.tag}</span>
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{a.title}</h2>
            <p style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.55 }}>{a.desc}</p>
            <p style={{ fontSize: 11, color: "#E67E3F", fontWeight: 600, marginTop: 8 }}>자세히 보기 →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
