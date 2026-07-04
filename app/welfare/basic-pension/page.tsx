import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "기초연금 수급자격과 신청방법 완벽 가이드 (2024년)",
  description:
    "기초연금이란 만 65세 이상 소득 하위 70% 어르신에게 지급되는 연금입니다. 수급자격 조건, 신청 절차, 2024년 지급액을 단계별로 안내합니다.",
  openGraph: {
    title: "기초연금 수급자격과 신청방법 (2024년)",
    description: "65세 이상 소득 하위 70%에게 지급되는 기초연금, 신청 방법을 확인하세요.",
  },
};

const faqItems = [
  {
    question: "기초연금 수급자격은 어떻게 되나요?",
    answer:
      "만 65세 이상이며, 대한민국 국적을 보유하고 국내에 거주하는 어르신 중 가구의 소득인정액이 선정기준액 이하인 분에게 지급됩니다. 2024년 기준 단독가구 월 213만 원, 부부가구 월 340만 8,000원 이하면 신청 대상입니다.",
  },
  {
    question: "기초연금 신청은 어디서 하나요?",
    answer:
      "주소지 관할 읍·면·동 주민센터 또는 국민연금공단 지사에서 신청할 수 있습니다. 복지로(bokjiro.go.kr) 홈페이지나 복지로 앱에서 온라인 신청도 가능합니다.",
  },
  {
    question: "기초연금 2024년 지급액은 얼마인가요?",
    answer:
      "2024년 기준 최대 월 334,810원이 지급됩니다. 소득인정액과 국민연금 수령 여부에 따라 금액이 달라질 수 있으며, 부부가 모두 수급자인 경우 각 20% 감액됩니다.",
  },
  {
    question: "기초연금과 국민연금을 동시에 받을 수 있나요?",
    answer:
      "네, 동시에 받을 수 있습니다. 단, 국민연금 수령액이 기준연금액(2024년 기준 월 약 334,810원)의 150%인 약 50만 원을 초과하면 기초연금이 일부 감액될 수 있습니다.",
  },
  {
    question: "기초연금 신청 시 필요한 서류는 무엇인가요?",
    answer:
      "신분증(주민등록증, 운전면허증 등), 통장 사본이 기본 서류입니다. 금융정보 제공 동의서는 현장에서 작성하며, 경우에 따라 임대차계약서 등 추가 서류가 필요할 수 있습니다.",
  },
];

const steps = [
  { title: "자격 사전 확인", desc: "복지로 모의계산 또는 국민연금공단 ☎ 1355 문의로 수급 가능 여부 확인" },
  { title: "신청 방법 선택", desc: "방문(주민센터·공단 지사) 또는 복지로 앱 온라인 신청 중 선택" },
  { title: "서류 준비", desc: "신분증, 통장 사본 준비. 금융정보 동의서는 현장 작성" },
  { title: "신청서 제출", desc: "복지로 앱으로 15분 내 온라인 완료 가능" },
  { title: "심사 후 수령", desc: "약 30일 내 결과 통보. 지급 대상이면 신청 월부터 지급 시작" },
];

const contacts = [
  { label: "복지로 (온라인 신청)", value: "bokjiro.go.kr", icon: "ti-world" },
  { label: "국민연금공단", value: "☎ 1355", icon: "ti-phone" },
  { label: "보건복지상담센터", value: "☎ 129", icon: "ti-headset" },
  { label: "읍·면·동 주민센터", value: "방문 신청 가능", icon: "ti-building" },
];

export default function BasicPensionPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "기초연금 신청방법",
    description: "65세 이상 어르신이 기초연금을 신청하는 단계별 방법",
    step: steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.desc,
    })),
  };

  return (
    <>
      <ArticleSchema
        title="기초연금 수급자격과 신청방법 완벽 가이드 (2024년)"
        description="기초연금이란 만 65세 이상 소득 하위 70% 어르신에게 지급되는 연금입니다."
        datePublished="2024-01-01"
        dateModified="2024-11-01"
        url="https://senior-life.kr/welfare/basic-pension"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* 아티클 헤더 */}
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav
            items={[
              { label: "홈", href: "/" },
              { label: "복지혜택", href: "/welfare" },
              { label: "기초연금 신청방법" },
            ]}
          />

          {/* 태그 */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FEF3E8", color: "#C4621A", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #FDDFC0", marginBottom: 14 }}>
            <i className="ti ti-building-bank" style={{ fontSize: 11 }} aria-hidden="true" />
            복지혜택
          </div>

          <h1 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>
            기초연금 수급자격과 신청방법<br />완벽 가이드
          </h1>

          {/* 메타 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />
              2024년 11월 업데이트
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />
              읽는 시간 5분
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <i className="ti ti-file-check" style={{ fontSize: 12 }} aria-hidden="true" />
              보건복지부 자료 기준
            </span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* 핵심 요약 */}
        <div style={{ background: "#FEF3E8", border: "0.5px solid #FDDFC0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#C4621A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#7C3415", lineHeight: 1.65 }}>
            기초연금은 만 65세 이상 소득 하위 70% 어르신에게 국가가 지급하는 연금으로,
            2024년 기준 최대 월 334,810원을 받을 수 있습니다.
            주민센터 방문 또는 복지로 앱에서 신청 가능합니다.
          </p>
        </div>

        {/* 수급자격 */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>
            기초연금 수급자격 조건은 무엇인가요?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "만 65세 이상",
              "대한민국 국적 보유 + 국내 거주",
              "소득인정액이 선정기준액 이하 (2024년: 단독가구 월 213만 원 / 부부가구 월 340만 8,000원)",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1A1A1A", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: "#9B9890" }}>
            * 공무원·사학·군인·별정우체국 연금 수급자는 원칙적으로 대상 제외
          </p>
        </section>

        {/* 신청 절차 */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>
            기초연금 신청방법 — 5단계
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1A1A1A", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: "#6B6860", lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 지급액 */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>
            2024년 기초연금 지급액
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "16px 18px", background: "#FAFAF8", borderRadius: 12, border: "0.5px solid #EEECE6" }}>
              <p style={{ fontSize: 11, color: "#9B9890", marginBottom: 6 }}>단독가구</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.4px" }}>
                월 <span style={{ color: "#E67E3F" }}>334,810</span>원
              </p>
              <p style={{ fontSize: 11, color: "#9B9890", marginTop: 4 }}>최대 지급액</p>
            </div>
            <div style={{ padding: "16px 18px", background: "#FAFAF8", borderRadius: 12, border: "0.5px solid #EEECE6" }}>
              <p style={{ fontSize: 11, color: "#9B9890", marginBottom: 6 }}>부부 각각</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.4px" }}>
                월 <span style={{ color: "#E67E3F" }}>267,850</span>원
              </p>
              <p style={{ fontSize: 11, color: "#9B9890", marginTop: 4 }}>부부 모두 수급 시 20% 감액</p>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>
            신청 관련 기관 연락처
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
            {contacts.map((c) => (
              <div key={c.label} style={{ padding: "14px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <i className={`ti ${c.icon}`} style={{ fontSize: 16, color: "#9B9890", marginTop: 1, flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <p style={{ fontSize: 12, color: "#9B9890", marginBottom: 2 }}>{c.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#E67E3F" }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FAQAccordion items={faqItems} />

        {/* 출처 */}
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860", lineHeight: 1.6 }}>
            출처: <strong style={{ color: "#1A1A1A" }}>보건복지부</strong> · <strong style={{ color: "#1A1A1A" }}>국민연금공단</strong> · <strong style={{ color: "#1A1A1A" }}>복지로</strong> 공식 자료 기반.
            정확한 수급 여부는 주민센터 또는 국민연금공단(1355)에 문의하세요.
          </p>
        </div>
      </article>
    </>
  );
}
