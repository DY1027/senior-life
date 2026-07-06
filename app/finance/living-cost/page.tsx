import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";
import LivingCostCalculator from "./LivingCostCalculator";

export const metadata: Metadata = {
  title: "노후 생활비 계산기 — 얼마가 필요할까? (2024년 기준)",
  description: "노후에 필요한 생활비를 계산해보세요. 가구 유형·거주 지역·생활 수준에 따른 월 생활비 예상액을 바로 확인할 수 있습니다.",
  alternates: { canonical: "/finance/living-cost" },
};

const faqItems = [
  { question: "노후 생활비에서 가장 큰 비중을 차지하는 항목은 무엇인가요?", answer: "식비·주거비가 약 40~50%로 가장 크며, 의료비가 노령에 따라 급격히 증가합니다. 65세 이후에는 의료비가 전체 생활비의 15~20%를 차지하는 경우가 많아 별도로 준비가 필요합니다." },
  { question: "국민연금만으로 노후 생활이 가능한가요?", answer: "2024년 기준 국민연금 평균 수령액은 월 약 62만 원으로, 1인 최소 생활비(약 133만 원)에도 미치지 못합니다. 국민연금 외에 개인연금·퇴직연금·기초연금 등을 함께 준비하는 것이 좋습니다." },
  { question: "노후 준비를 늦게 시작하면 어떻게 해야 하나요?", answer: "50대에 시작해도 늦지 않습니다. 연금저축·IRP로 세액공제 혜택을 받으며 저축하고, 국민연금 임의가입·추납을 통해 수령액을 늘릴 수 있습니다. 주택 연금(역모기지)도 은퇴 후 현금 흐름을 만드는 좋은 방법입니다." },
  { question: "주택연금이란 무엇인가요?", answer: "보유 주택을 담보로 맡기고 매달 연금처럼 받는 제도입니다. 55세 이상이고 공시가격 12억 원 이하 주택 보유자가 신청 가능합니다. 한국주택금융공사(☎ 1688-8114)에 문의하세요." },
];

export default function LivingCostPage() {
  return (
    <>
      <ArticleSchema title="노후 생활비 계산기" description="가구 유형·거주 지역·생활 수준에 따른 월 생활비 예상액을 계산합니다." datePublished="2024-01-01" dateModified="2024-11-01" url="https://seniordeundun.com/finance/living-cost" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "노후재정", href: "/finance" }, { label: "노후 생활비 계산기" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#EFF6FF", color: "#1D4ED8", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #BFDBFE", marginBottom: 14 }}>
            <i className="ti ti-calculator" style={{ fontSize: 11 }} aria-hidden="true" />노후준비
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>노후 생활비 계산기<br />— 얼마가 필요할까?</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2024년 국민연금공단 기준</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />읽는 시간 3분</span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        <LivingCostCalculator />

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>노후 준비 체크리스트</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "ti-check", label: "국민연금 예상 수령액 확인", href: "/finance/national-pension" },
              { icon: "ti-check", label: "기초연금 수급자격 확인 (65세 이상)", href: "/welfare/basic-pension" },
              { icon: "ti-check", label: "퇴직연금(IRP) 가입 여부 확인", href: null },
              { icon: "ti-check", label: "연금저축 세액공제 활용", href: null },
              { icon: "ti-check", label: "주택연금 신청 가능 여부 검토", href: null },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 16, color: "#059669", flexShrink: 0 }} aria-hidden="true" />
                <span style={{ fontSize: 14, color: "#1A1A1A" }}>{item.label}</span>
                {item.href && (
                  <a href={item.href} style={{ marginLeft: "auto", fontSize: 11, color: "#E67E3F", fontWeight: 600, whiteSpace: "nowrap" }}>
                    바로가기 →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <FAQAccordion items={faqItems} />
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860" }}>출처: <strong style={{ color: "#1A1A1A" }}>국민연금공단</strong> 적정 노후 생활비 조사 기준. 계산 결과는 참고용입니다.</p>
        </div>
      </article>
    </>
  );
}
