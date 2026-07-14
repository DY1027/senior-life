import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "국민연금 예상 수령액 조회 방법 — 앱·홈페이지 단계별 안내",
  description: "국민연금 예상 수령액을 조회하는 방법을 단계별로 안내합니다. 내 연금 앱과 국민연금공단 홈페이지에서 쉽게 확인할 수 있습니다.",
  alternates: { canonical: "/finance/national-pension" },
};

const steps = [
  { title: "내 연금 앱 설치", desc: "App Store 또는 Google Play에서 '내 연금' 앱 검색 후 설치" },
  { title: "본인 인증", desc: "공동인증서·금융인증서·카카오·PASS 등으로 로그인" },
  { title: "예상 연금액 확인", desc: "'내 연금 알아보기' → '예상연금액 조회' 선택. 가입 이력과 예상 수령액 확인 가능" },
  { title: "상세 시뮬레이션", desc: "수령 시작 나이·추납 여부 등을 조정해 다양한 시나리오 계산 가능" },
];

const faqItems = [
  { question: "국민연금은 몇 살부터 받을 수 있나요?", answer: "현재 출생 연도에 따라 61~65세부터 수령 가능합니다. 1969년생 이후는 만 65세부터 수령하며, 조기 수령을 선택하면 월 수령액이 줄어듭니다. 반대로 연기 수령 시 1년에 7.2% 증액됩니다." },
  { question: "국민연금 최소 가입 기간은 얼마인가요?", answer: "최소 10년(120개월)을 납부해야 노령연금을 받을 수 있습니다. 10년 미만이면 60세 이후 반환일시금으로 원금에 이자를 더해 돌려받습니다." },
  { question: "임의가입이란 무엇인가요?", answer: "전업주부·학생 등 의무 가입 대상이 아닌 분도 자발적으로 국민연금에 가입할 수 있습니다. 월 최저 9만 원부터 납부 가능하며, 노후 연금액을 늘릴 수 있습니다." },
  { question: "추납(추후납부)으로 연금을 늘릴 수 있나요?", answer: "과거 납부 예외 기간(실업·육아 등)에 내지 못한 보험료를 나중에 한꺼번에 납부하는 제도입니다. 추납하면 가입 기간이 늘어나 매월 수령액이 증가합니다. 국민연금공단(☎ 1355)에 문의하세요." },
];

export default function NationalPensionPage() {
  return (
    <>
      <ArticleSchema title="국민연금 예상 수령액 조회 방법" description="국민연금 예상 수령액을 앱·홈페이지에서 조회하는 방법을 안내합니다." datePublished="2024-01-01" dateModified="2026-07-14" url="https://seniordeundun.com/finance/national-pension" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "노후재정", href: "/finance" }, { label: "국민연금 수령액 조회" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FDF0E0", color: "#C4621A", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #FDDFC0", marginBottom: 14 }}>
            <i className="ti ti-chart-line" style={{ fontSize: 11 }} aria-hidden="true" />국민연금
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>국민연금 예상 수령액<br />조회 방법</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2026년 기준</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />읽는 시간 3분</span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ background: "#FDF0E0", border: "0.5px solid #FDDFC0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#C4621A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#1E3A8A", lineHeight: 1.65 }}>국민연금 예상 수령액은 &apos;내 연금&apos; 앱 또는 국민연금공단 홈페이지(nps.or.kr)에서 본인 인증 후 바로 확인할 수 있습니다. 연금액은 가입 기간과 납부 금액에 따라 달라집니다.</p>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>앱으로 조회하는 방법 — 4단계</h2>
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
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>연금 수령 나이별 변화</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
            {[
              { label: "조기 수령 (60세)", desc: "월 수령액 감소", rate: "최대 30% 감액" },
              { label: "정상 수령 (65세)", desc: "기준 수령액", rate: "100%" },
              { label: "연기 수령 (최대 70세)", desc: "월 수령액 증가", rate: "최대 36% 증액" },
            ].map((item) => (
              <div key={item.label} style={{ padding: "14px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6", textAlign: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#9B9890", marginBottom: 6 }}>{item.desc}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#E67E3F" }}>{item.rate}</p>
              </div>
            ))}
          </div>
        </section>

        <FAQAccordion items={faqItems} />
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860" }}>출처: <strong style={{ color: "#1A1A1A" }}>국민연금공단</strong> 공식 자료. 문의: ☎ 1355</p>
        </div>
      </article>
    </>
  );
}
