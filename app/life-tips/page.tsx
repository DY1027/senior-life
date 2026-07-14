import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "시니어 생활팁 — 할인혜택·절약·가족 돌봄 가이드",
  description: "50대 이상 시니어를 위한 생활팁. 시니어 할인 카드 총정리, 절약 정보, 부모님 스마트폰 설정 가이드, 가족 돌봄 체크리스트를 안내합니다.",
  alternates: { canonical: "/life-tips" },
};

const articles = [
  { title: "시니어 할인 카드 총정리 — 교통·문화·쇼핑", desc: "65세 이상이 받을 수 있는 교통·문화시설·쇼핑 할인 혜택을 한눈에 정리했습니다.", href: "/life-tips/senior-discount", tag: "할인혜택", icon: "ti-ticket", tagBg: "#FDF0E0", tagColor: "#C4621A", tagBorder: "#FDDFC0" },
  { title: "부모님 돌봄 가족을 위한 체크리스트", desc: "재가 돌봄 시 확인해야 할 항목, 위급 상황 대처 방법, 돌봄 번아웃 예방 가이드입니다.", href: "/life-tips/family-care", tag: "가족돌봄", icon: "ti-heart", tagBg: "#FDF0E0", tagColor: "#C4621A", tagBorder: "#FDDFC0" },
];

export default function LifeTipsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 56px" }}>
      <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "생활팁" }]} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FDF0E0", color: "#C4621A", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #FDDFC0", marginBottom: 14 }}>
        <i className="ti ti-bulb" style={{ fontSize: 11 }} aria-hidden="true" />생활팁
      </div>
      <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 8 }}>시니어 생활팁</h1>
      <p style={{ fontSize: 14, color: "#6B6860", marginBottom: 28 }}>할인혜택·절약·가족 돌봄 정보</p>
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
