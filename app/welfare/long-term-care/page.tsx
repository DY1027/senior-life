import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "장기요양보험 등급 신청 방법 — 1~5등급 판정 기준 (2026년)",
  description: "장기요양보험 등급 신청 방법, 1~5등급 판정 기준, 신청 절차를 단계별로 안내합니다. 국민건강보험공단 방문 또는 전화로 신청 가능합니다.",
  alternates: { canonical: "/welfare/long-term-care" },
};

const grades = [
  { grade: "1등급", condition: "심신기능이 저하되어 일상생활 전적으로 타인 도움 필요", score: "95점 이상" },
  { grade: "2등급", condition: "일상생활 상당 부분 타인 도움 필요", score: "75~94점" },
  { grade: "3등급", condition: "일상생활 일부 타인 도움 필요", score: "60~74점" },
  { grade: "4등급", condition: "일상생활 일정 부분 타인 도움 필요", score: "51~59점" },
  { grade: "5등급", condition: "치매 어르신 (특정 점수 기준 충족)", score: "45점 이상 + 치매" },
  { grade: "인지지원등급", condition: "치매 증상이 있으나 신체기능 양호", score: "45점 미만 + 치매" },
];

const steps = [
  { title: "신청서 접수", desc: "국민건강보험공단 ☎ 1577-1000 전화 또는 가까운 지사 방문. 복지로 앱 온라인 신청도 가능" },
  { title: "방문 조사", desc: "공단 직원이 가정 방문해 신체·인지 기능 52개 항목 조사 (약 1시간 소요)" },
  { title: "의사 소견서 제출", desc: "신청 후 30일 이내 의사 소견서 제출 필요 (내과·신경과·정신건강의학과 등)" },
  { title: "등급 판정", desc: "등급판정위원회에서 심의 후 등급 결정. 신청일로부터 약 30일 내 결과 통보" },
  { title: "서비스 이용 시작", desc: "등급 받은 달부터 요양보호사 방문, 주야간 보호, 요양원 입소 등 서비스 이용 가능" },
];

const faqItems = [
  { question: "장기요양보험료는 따로 내야 하나요?", answer: "별도로 내지 않습니다. 건강보험료에 장기요양보험료가 포함되어 함께 부과됩니다. 2026년 기준 건강보험료의 13.14%(소득 대비 보험료율 0.9448%)가 장기요양보험료로 책정됩니다." },
  { question: "등급 결과가 마음에 안 들면 어떻게 하나요?", answer: "등급 결과 통보 후 90일 이내에 이의신청을 할 수 있습니다. 국민건강보험공단 지사에 이의신청서를 제출하면 재심사를 받을 수 있습니다." },
  { question: "장기요양 서비스를 받으면 얼마나 내야 하나요?", answer: "서비스 비용의 15%(시설 급여) 또는 15%(재가 급여)를 본인이 부담합니다. 기초생활수급자·차상위계층은 0~6%로 감경됩니다." },
  { question: "치매 진단을 받았는데 등급이 안 나올 수 있나요?", answer: "치매 진단을 받아도 장기요양 인정 점수가 45점 미만이면 일반 등급은 받기 어렵습니다. 이 경우 인지지원등급을 받을 수 있으며, 치매안심센터의 프로그램을 이용할 수 있습니다." },
];

export default function LongTermCarePage() {
  return (
    <>
      <ArticleSchema title="장기요양보험 등급 신청 방법" description="장기요양보험 등급 신청 방법과 1~5등급 판정 기준을 안내합니다." datePublished="2024-01-01" dateModified="2026-07-06" url="https://seniordeundun.com/welfare/long-term-care" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "복지혜택", href: "/welfare" }, { label: "장기요양보험 등급 신청" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FEF3E8", color: "#C4621A", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #FDDFC0", marginBottom: 14 }}>
            <i className="ti ti-heart-handshake" style={{ fontSize: 11 }} aria-hidden="true" />장기요양
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>장기요양보험 등급 신청 방법<br />— 1~5등급 판정 기준</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2026년 7월 업데이트</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />읽는 시간 4분</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-file-check" style={{ fontSize: 12 }} aria-hidden="true" />국민건강보험공단 자료 기준</span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ background: "#FEF3E8", border: "0.5px solid #FDDFC0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#C4621A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#7C3415", lineHeight: 1.65 }}>장기요양보험은 노인성 질환으로 혼자 일상생활이 어려운 어르신에게 요양 서비스를 제공하는 제도입니다. 국민건강보험공단(☎ 1577-1000)에 신청하면 방문 조사 후 1~5등급 또는 인지지원등급을 받을 수 있습니다.</p>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>신청 절차 — 5단계</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1A1A1A", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <div><p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>{s.title}</p><p style={{ fontSize: 12, color: "#6B6860", lineHeight: 1.55 }}>{s.desc}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>등급별 판정 기준</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {grades.map((g) => (
              <div key={g.grade} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <span style={{ minWidth: 60, fontSize: 12, fontWeight: 700, color: "#E67E3F" }}>{g.grade}</span>
                <span style={{ flex: 1, fontSize: 13, color: "#1A1A1A" }}>{g.condition}</span>
                <span style={{ fontSize: 11, color: "#9B9890", whiteSpace: "nowrap" }}>{g.score}</span>
              </div>
            ))}
          </div>
        </section>

        <FAQAccordion items={faqItems} />

        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860", lineHeight: 1.6 }}>출처: <strong style={{ color: "#1A1A1A" }}>국민건강보험공단</strong> · <strong style={{ color: "#1A1A1A" }}>보건복지부</strong> 공식 자료 기반. 문의: ☎ 1577-1000</p>
        </div>
      </article>
    </>
  );
}
