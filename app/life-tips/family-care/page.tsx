import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleSchema from "@/components/ArticleSchema";
import FAQAccordion from "@/components/FAQAccordion";
import ParentChecklistTool from "@/components/life-tips/ParentChecklistTool";

export const metadata: Metadata = {
  title: "부모님 돌봄 가족을 위한 체크리스트 — 재가 돌봄 가이드",
  description: "부모님을 돌보는 가족을 위한 체크리스트입니다. 재가 돌봄 시 확인 항목, 위급 상황 대처법, 돌봄 번아웃 예방법을 안내합니다.",
  alternates: { canonical: "/life-tips/family-care" },
};

const checklist = [
  { category: "안전 환경 점검", icon: "ti-home-check", items: ["욕실 미끄럼 방지 매트 설치", "화장실·복도 안전 손잡이 설치", "야간 조명 설치 (낙상 예방)", "문턱 제거 또는 경사로 설치", "응급 연락처 잘 보이는 곳에 부착"] },
  { category: "건강 관리", icon: "ti-pill", items: ["복용 약 종류·시간 기록 (약 수첩)", "정기 병원 방문 일정 관리", "식사량·체중 변화 주 1회 확인", "혈압·혈당 측정 기록", "치과·안과·이비인후과 정기 점검"] },
  { category: "정서·사회적 지원", icon: "ti-heart", items: ["하루 1회 이상 전화 또는 방문", "외출·사회 활동 지원 (경로당, 복지관)", "취미 활동 함께 찾기", "우울감·인지 변화 징후 관찰", "치매안심센터 등록 검토"] },
  { category: "복지 서비스 연결", icon: "ti-building-bank", items: ["장기요양보험 등급 신청 여부 확인", "노인 맞춤 돌봄 서비스 신청", "식사 배달 서비스 이용 검토", "이동 지원 서비스 신청", "긴급복지지원 제도 확인"] },
];

const faqItems = [
  { question: "돌봄 번아웃이란 무엇이고, 어떻게 예방하나요?", answer: "돌봄 제공자가 지속적인 돌봄으로 신체·정신적으로 극도로 지치는 상태를 말합니다. 정기적인 휴식 시간 확보, 다른 가족과의 역할 분담, 장기요양 서비스를 통한 전문 인력 활용이 중요합니다. 가족돌봄자 지원 사업(복지로 검색)을 통해 심리 상담도 받을 수 있습니다." },
  { question: "혼자 사는 부모님을 어떻게 확인할 수 있나요?", answer: "지자체 독거노인 지원 서비스(노인 맞춤 돌봄 서비스)를 신청하면 생활관리사가 정기 방문합니다. IoT 기기를 활용한 안부 확인 서비스, AI 스피커 돌봄 서비스도 활용할 수 있습니다." },
  { question: "치매 초기 증상을 어떻게 알 수 있나요?", answer: "최근 일을 기억하지 못하거나, 같은 말을 반복하거나, 익숙한 장소에서 길을 잃거나, 물건을 이상한 곳에 두는 행동이 반복된다면 치매안심센터(치매상담콜센터 ☎ 1899-9988)에 문의하세요." },
  { question: "가족이 직접 요양보호사가 될 수 있나요?", answer: "장기요양 등급을 받은 어르신의 가족이 요양보호사 자격을 취득하면 가족 요양보호사로 등록해 급여를 받을 수 있습니다. 단, 동거 가족은 수급자 1인당 하루 60분 이내로 제한됩니다." },
];

export default function FamilyCarePage() {
  return (
    <>
      <ArticleSchema title="부모님 돌봄 가족을 위한 체크리스트" description="재가 돌봄 시 확인 항목과 위급 상황 대처법을 안내합니다." datePublished="2024-01-01" dateModified="2026-07-14" url="https://seniordeundun.com/life-tips/family-care" />
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "생활팁", href: "/life-tips" }, { label: "가족 돌봄 체크리스트" }]} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FDF0E0", color: "#C4621A", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, border: "0.5px solid #FDDFC0", marginBottom: 14 }}>
            <i className="ti ti-heart" style={{ fontSize: 11 }} aria-hidden="true" />가족돌봄
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>부모님 돌봄 가족을 위한<br />체크리스트</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "#9B9890" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />2026년 기준</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" />읽는 시간 5분</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 0" }}>
        <ParentChecklistTool />
        <div style={{ borderTop: "1px solid #EEECE6", margin: "8px 0 32px" }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 20, letterSpacing: "-0.3px" }}>돌봄 가이드 자세히 보기</h2>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ background: "#FEF3E8", border: "0.5px solid #FDDFC0", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#C4621A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>핵심 요약</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#7C3415", lineHeight: 1.65 }}>부모님을 안전하게 돌보려면 환경 안전 점검, 건강 관리, 정서 지원, 복지 서비스 연결 등 4가지 영역을 체계적으로 챙겨야 합니다. 혼자 다 하려 하지 말고 장기요양보험·돌봄 서비스를 적극 활용하세요.</p>
        </div>

        {checklist.map((group) => (
          <section key={group.category} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: "#FEF3E8", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${group.icon}`} style={{ fontSize: 14, color: "#C4621A" }} aria-hidden="true" />
              </span>
              {group.category}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#FAFAF8", borderRadius: 10, border: "0.5px solid #EEECE6" }}>
                  <i className="ti ti-square" style={{ fontSize: 16, color: "#D1CFC8", flexShrink: 0 }} aria-hidden="true" />
                  <span style={{ fontSize: 13, color: "#1A1A1A" }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* 긴급 연락처 */}
        <section style={{ marginBottom: 32, padding: "20px", background: "#1A1A1A", borderRadius: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>긴급 상황 연락처</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "응급 (119)", value: "☎ 119" },
              { label: "치매안심센터", value: "☎ 1899-9988" },
              { label: "노인보호전문기관", value: "☎ 1577-1389" },
              { label: "장기요양 신청", value: "☎ 1577-1000" },
            ].map((c) => (
              <div key={c.label} style={{ background: "#2A2A2A", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 11, color: "#6B6860", marginBottom: 2 }}>{c.label}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#E67E3F" }}>{c.value}</p>
              </div>
            ))}
          </div>
        </section>

        <FAQAccordion items={faqItems} />
        <div style={{ marginTop: 24, padding: "12px 16px", background: "#F7F6F3", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }} aria-hidden="true" />
          <p style={{ fontSize: 11, color: "#6B6860" }}>출처: <strong style={{ color: "#1A1A1A" }}>보건복지부</strong> · <strong style={{ color: "#1A1A1A" }}>중앙치매센터</strong> 공식 자료 기반.</p>
        </div>
      </article>
    </>
  );
}
