import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "건강·병원 정보 — 건강보험·검진·약 복용 관리",
  description: "시니어를 위한 건강·병원 정보. 건강보험 본인부담금 계산, 노인 무료 건강검진 항목, 약 복용 관리 방법을 안내합니다.",
};

const articles = [
  { title: "건강보험 본인부담금 계산 방법", desc: "외래·입원·약국별 본인부담금 계산 방법과 본인부담상한제 혜택을 안내합니다.", href: "/health/insurance-copay", tag: "건강보험", icon: "ti-receipt", tagBg: "#ECFDF5", tagColor: "#065F46", tagBorder: "#A7F3D0" },
  { title: "노인 무료 건강검진 항목 총정리", desc: "66세 이상 생애전환기 검진 및 국가암검진 대상 항목과 신청 방법을 안내합니다.", href: "/health/checkup", tag: "건강검진", icon: "ti-stethoscope", tagBg: "#ECFDF5", tagColor: "#065F46", tagBorder: "#A7F3D0" },
];

export default function HealthPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 56px" }}>
      <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "건강·병원" }]} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#ECFDF5", color: "#065F46", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #A7F3D0", marginBottom: 14 }}>
        <i className="ti ti-heart-rate-monitor" style={{ fontSize: 11 }} aria-hidden="true" />건강·병원
      </div>
      <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 8 }}>건강·병원 정보</h1>
      <p style={{ fontSize: 14, color: "#6B6860", marginBottom: 28 }}>건강보험·검진·약 복용 관리 안내</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {articles.map((a) => (
          <Link key={a.href} href={a.href} style={{ display: "block", padding: "18px 20px", background: "#FAFAF8", borderRadius: 14, border: "0.5px solid #EEECE6", textDecoration: "none", transition: "border-color 0.15s" }}>
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
