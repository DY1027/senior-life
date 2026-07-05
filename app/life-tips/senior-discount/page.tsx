import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "시니어 할인 카드 총정리 — 교통·문화·쇼핑 혜택 (2024년)",
  description: "65세 이상 어르신이 받을 수 있는 교통·문화시설·쇼핑 할인 혜택을 한눈에 정리했습니다. 지하철 무임승차부터 국립공원 무료 입장까지 확인하세요.",
};

const discounts = [
  { cat: "교통", icon: "ti-train", color: "#EFF6FF", iconColor: "#2563EB", items: [
    { name: "지하철 무임승차", condition: "만 65세 이상", detail: "전국 도시철도 무료 (수도권·부산·대구·광주·대전 등)" },
    { name: "국내선 항공 할인", condition: "만 65세 이상", detail: "대한항공·아시아나 등 10~30% 할인" },
    { name: "KTX·무궁화 할인", condition: "만 65세 이상", detail: "운임 30% 할인 (주말·공휴일 일부 제외)" },
  ]},
  { cat: "문화·여가", icon: "ti-ticket", color: "#F5F3FF", iconColor: "#7C3AED", items: [
    { name: "국립공원 무료 입장", condition: "만 65세 이상", detail: "국립공원관리공단 운영 전국 공원" },
    { name: "국공립 박물관·미술관", condition: "만 65세 이상", detail: "국립중앙박물관·국립현대미술관 등 무료" },
    { name: "영화 할인", condition: "만 65세 이상", detail: "CGV·메가박스·롯데시네마 평일 할인 (약 6,000원)" },
  ]},
  { cat: "쇼핑·생활", icon: "ti-shopping-cart", color: "#ECFDF5", iconColor: "#059669", items: [
    { name: "통신요금 할인", condition: "만 65세 이상·기초연금 수급자", detail: "월 최대 11,000원 요금 감면 (통신사별 상이)" },
    { name: "전기요금 할인", condition: "만 65세 이상·기초생활수급자", detail: "월 최대 16,000원 할인" },
    { name: "목욕탕·이발소 할인", condition: "지자체별 상이", detail: "주민센터에서 시니어 목욕 쿠폰 제공 지역 있음" },
  ]},
];

const faqItems = [
  { question: "시니어 할인은 어디서 신청하나요?", answer: "지하철 무임승차는 별도 신청 없이 만 65세 이상이면 자동 적용됩니다. 통신요금 할인은 해당 통신사 고객센터에 직접 신청해야 하며, 기초연금 수급증명서나 신분증으로 확인합니다." },
  { question: "경로우대증을 발급받아야 하나요?", answer: "대부분의 할인은 신분증(주민등록증)만으로 적용됩니다. 일부 지역에서는 경로우대카드를 발급받으면 추가 혜택이 있으므로 주민센터에 문의해보세요." },
  { question: "통신요금 할인 신청은 어떻게 하나요?", answer: "가입한 통신사 고객센터 또는 가까운 대리점을 방문하세요. 기초연금 수급자 확인을 위해 수급자 증명서 또는 복지로 앱에서 서류를 발급받아 제출합니다." },
];

export default function SeniorDiscountPage() {
  return (
    <>
      <ArticleSchema title="시니어 할인 카드 총정리" description="65세 이상 교통·문화·쇼핑 할인 혜택을 정리합니다." datePublished="2024-01-01" dateModified="2024-11-01" url="https://seniordeundun.com/life-tips/senior-discount" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "생활팁", href: "/life-tips" }, { label: "시니어 할인 총정리" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F5F3FF", color: "#6D28D9", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #DDD6FE", marginBottom: 14 }}>
            <i className="ti ti-bulb" style={{ fontSize: 11 }} aria-hidden="true" />생활팁
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>시니어 할인 카드 총정리<br />— 교통·문화·쇼핑 혜택</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2024년 기준</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />읽는 시간 5분</span>
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ background: "#FEF3E8", border: "0.5px solid #FDDFC0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#C4621A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#7C3415", lineHeight: 1.65 }}>만 65세 이상이면 지하철 무임승차, 국립공원 무료입장, KTX 30% 할인, 통신요금 감면 등 다양한 혜택을 받을 수 있습니다. 대부분 신분증만으로 바로 적용됩니다.</p>
        </div>

        {discounts.map((group) => (
          <section key={group.cat} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: group.color, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${group.icon}`} style={{ fontSize: 14, color: group.iconColor }} aria-hidden="true" />
              </span>
              {group.cat}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((item) => (
                <div key={item.name} style={{ padding: "12px 16px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{item.name}</p>
                    <span style={{ fontSize: 11, color: "#E67E3F", fontWeight: 600, background: "#FEF3E8", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap", marginLeft: 8 }}>{item.condition}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#6B6860" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <FAQAccordion items={faqItems} />
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860" }}>혜택은 지역·시기에 따라 변동될 수 있습니다. 정확한 내용은 해당 기관에 문의하세요.</p>
        </div>
      </article>
    </>
  );
}
