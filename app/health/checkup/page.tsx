import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "노인 무료 건강검진 항목 총정리 — 66세 생애전환기 검진 (2024년)",
  description: "66세 이상 생애전환기 건강검진과 국가암검진 대상 항목을 안내합니다. 무료로 받을 수 있는 검진 종류와 신청 방법을 확인하세요.",
};

const checkups = [
  { name: "일반 건강검진", age: "짝수 연도 출생자 (매 2년)", items: "혈압·혈당·콜레스테롤·간기능·신장기능·흉부X선 등", cost: "무료" },
  { name: "생애전환기 건강검진", age: "만 66세", items: "골밀도·노인신체기능·인지기능·우울증·정서상태 등 추가", cost: "무료" },
  { name: "위암 검진", age: "만 40세 이상 (2년마다)", items: "위내시경 또는 위장조영술", cost: "무료 (내시경 10% 본인부담)" },
  { name: "대장암 검진", age: "만 50세 이상 (1년마다)", items: "분변잠혈검사 → 양성 시 대장내시경", cost: "무료" },
  { name: "유방암 검진", age: "만 40세 이상 여성 (2년마다)", items: "유방촬영술", cost: "무료" },
  { name: "자궁경부암 검진", age: "만 20세 이상 여성 (2년마다)", items: "자궁경부세포검사", cost: "무료" },
  { name: "폐암 검진", age: "만 54~74세 고위험군", items: "저선량 CT (흡연자 우선)", cost: "10% 본인부담" },
];

const faqItems = [
  { question: "건강검진 대상자인지 어떻게 확인하나요?", answer: "국민건강보험공단 홈페이지(nhis.or.kr) 또는 The건강보험 앱에서 로그인 후 '건강검진 대상조회'를 통해 확인할 수 있습니다. 매년 1월 검진 대상자에게 안내문이 발송됩니다." },
  { question: "건강검진은 어디서 받나요?", answer: "국민건강보험공단 검진기관으로 지정된 병·의원에서 받을 수 있습니다. The건강보험 앱 또는 nhis.or.kr에서 가까운 검진기관을 검색할 수 있습니다." },
  { question: "검진을 미루면 어떻게 되나요?", answer: "해당 연도에 받지 않으면 다음 해에 받을 기회가 다시 주어집니다. 단, 암검진의 경우 조기 발견이 중요하므로 가능한 제때 받는 것이 좋습니다." },
  { question: "66세 생애전환기 검진에서 추가되는 항목은 무엇인가요?", answer: "골밀도 검사(골다공증 확인), 노인신체기능검사(낙상 위험도), 인지기능장애 검사, 우울증 검사 등이 일반 건강검진에 추가됩니다. 검진 후 의사 상담도 포함됩니다." },
];

export default function CheckupPage() {
  return (
    <>
      <ArticleSchema title="노인 무료 건강검진 항목 총정리" description="66세 이상 생애전환기 건강검진과 국가암검진 대상 항목을 안내합니다." datePublished="2024-01-01" dateModified="2024-11-01" url="https://senior-life.kr/health/checkup" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "건강·병원", href: "/health" }, { label: "노인 무료 건강검진" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#ECFDF5", color: "#065F46", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #A7F3D0", marginBottom: 14 }}>
            <i className="ti ti-stethoscope" style={{ fontSize: 11 }} aria-hidden="true" />건강검진
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>노인 무료 건강검진 항목<br />총정리 (2024년)</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2024년 기준</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-file-check" style={{ fontSize: 12 }} aria-hidden="true" />국민건강보험공단 자료</span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ background: "#ECFDF5", border: "0.5px solid #A7F3D0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#065F46", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#064E3B", lineHeight: 1.65 }}>국가건강검진은 2년마다 무료로 받을 수 있으며, 만 66세에는 골밀도·인지기능·우울증 검사 등이 추가되는 생애전환기 건강검진을 받습니다. 암검진은 종류에 따라 매년 또는 2년마다 무료 제공됩니다.</p>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>무료 건강검진 종류와 대상</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checkups.map((c) => (
              <div key={c.name} style={{ padding: "14px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</p>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#ECFDF5", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap", marginLeft: 8 }}>{c.cost}</span>
                </div>
                <p style={{ fontSize: 11, color: "#E67E3F", fontWeight: 600, marginBottom: 3 }}>{c.age}</p>
                <p style={{ fontSize: 12, color: "#6B6860" }}>{c.items}</p>
              </div>
            ))}
          </div>
        </section>

        <FAQAccordion items={faqItems} />
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860" }}>출처: <strong style={{ color: "#1A1A1A" }}>국민건강보험공단</strong> · <strong style={{ color: "#1A1A1A" }}>국립암센터</strong> 공식 자료. 문의: ☎ 1577-1000</p>
        </div>
      </article>
    </>
  );
}
