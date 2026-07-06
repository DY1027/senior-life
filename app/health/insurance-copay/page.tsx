import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "건강보험 본인부담금 계산 방법 — 외래·입원·약국별 정리 (2024년)",
  description: "건강보험 본인부담금이란 진료비 중 환자가 직접 부담하는 금액입니다. 외래·입원·약국별 본인부담률과 본인부담상한제 혜택을 쉽게 안내합니다.",
  alternates: { canonical: "/health/insurance-copay" },
};

const copayTable = [
  { type: "외래 (의원)", rate: "30%", note: "65세 이상: 1,500원 정액 또는 30%" },
  { type: "외래 (병원·종합병원)", rate: "40~50%", note: "상급종합병원 60%" },
  { type: "입원", rate: "20%", note: "식대 별도 (1식 약 2,000원)" },
  { type: "약국 (처방전)", rate: "30%", note: "65세 이상 노인: 1,200원 또는 30%" },
  { type: "CT·MRI", rate: "30~80%", note: "비급여 항목은 전액 본인 부담" },
];

const faqItems = [
  { question: "본인부담상한제란 무엇인가요?", answer: "연간 본인부담금 총액이 소득에 따라 정해진 상한액을 초과하면 초과분을 건강보험공단에서 돌려주는 제도입니다. 2024년 기준 저소득층(1분위)은 연 87만 원이 상한액으로, 초과분은 자동으로 환급됩니다." },
  { question: "65세 이상은 진료비가 얼마인가요?", answer: "65세 이상 노인은 의원 외래 진료 시 본인부담금이 1,500원 정액(진료비 15,000원 이하 시)으로 경감됩니다. 약국 처방조제료도 1,200원 정액이 적용됩니다." },
  { question: "건강보험이 적용되지 않는 비급여 항목은 무엇인가요?", answer: "미용·성형, 라식·라섹, 건강검진 일부, 한방 첩약, 상급 병실료(1~2인실) 등은 비급여로 전액 본인 부담입니다. 비급여 진료비는 병원마다 다르므로 미리 확인이 필요합니다." },
  { question: "진료비 영수증은 왜 꼭 받아야 하나요?", answer: "진료비 영수증에는 급여·비급여 항목이 구분되어 있어 추후 의료비 세액공제나 실손보험 청구 시 반드시 필요합니다. 분실 시 해당 병원에서 재발급을 요청하세요." },
];

export default function InsuranceCopayPage() {
  return (
    <>
      <ArticleSchema title="건강보험 본인부담금 계산 방법" description="외래·입원·약국별 본인부담률과 본인부담상한제 혜택을 안내합니다." datePublished="2024-01-01" dateModified="2024-11-01" url="https://seniordeundun.com/health/insurance-copay" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "건강·병원", href: "/health" }, { label: "건강보험 본인부담금" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#ECFDF5", color: "#065F46", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #A7F3D0", marginBottom: 14 }}>
            <i className="ti ti-stethoscope" style={{ fontSize: 11 }} aria-hidden="true" />건강보험
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>건강보험 본인부담금<br />계산 방법</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2024년 11월 업데이트</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />읽는 시간 4분</span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ background: "#ECFDF5", border: "0.5px solid #A7F3D0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#065F46", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#064E3B", lineHeight: 1.65 }}>본인부담금이란 전체 진료비에서 건강보험이 지원되고 남은 금액으로, 환자가 직접 내는 비용입니다. 외래 기준 진료비의 30~60%이며, 65세 이상 노인은 의원 방문 시 1,500원 정액 혜택을 받을 수 있습니다.</p>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>진료 유형별 본인부담률</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#1A1A1A", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", borderRadius: "8px 0 0 0", fontWeight: 600 }}>구분</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>본인부담률</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", borderRadius: "0 8px 0 0", fontWeight: 600 }}>비고</th>
                </tr>
              </thead>
              <tbody>
                {copayTable.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "0.5px solid #EEECE6", background: i % 2 === 0 ? "#fff" : "#FAFAF8" }}>
                    <td style={{ padding: "10px 14px", color: "#1A1A1A", fontWeight: 500 }}>{row.type}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#E67E3F", fontWeight: 700 }}>{row.rate}</td>
                    <td style={{ padding: "10px 14px", color: "#6B6860" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>본인부담상한제 — 연간 초과분 환급</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
            {[
              { tier: "1분위 (저소득)", limit: "연 87만원" },
              { tier: "2~3분위", limit: "연 108만원" },
              { tier: "4~5분위", limit: "연 162만원" },
              { tier: "6~7분위", limit: "연 303만원" },
              { tier: "8분위", limit: "연 414만원" },
              { tier: "9~10분위 (고소득)", limit: "연 780만원" },
            ].map((item) => (
              <div key={item.tier} style={{ padding: "14px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <p style={{ fontSize: 11, color: "#9B9890", marginBottom: 4 }}>{item.tier}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>{item.limit}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: "#9B9890" }}>* 상한액 초과분은 다음 해 8월 건강보험공단에서 자동 환급</p>
        </section>

        <FAQAccordion items={faqItems} />
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860" }}>출처: <strong style={{ color: "#1A1A1A" }}>국민건강보험공단</strong> · <strong style={{ color: "#1A1A1A" }}>건강보험심사평가원</strong> 공식 자료 기반. 문의: ☎ 1577-1000</p>
        </div>
      </article>
    </>
  );
}
