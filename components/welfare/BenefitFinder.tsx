"use client";
import { useState } from "react";

type AgeGroup = "under60" | "60to64" | "65to69" | "70plus";
type IncomeLevel = "basic" | "near-basic" | "medium50" | "other";
type MobilityLevel = "independent" | "partial" | "full-care";
type HouseholdType = "alone" | "couple" | "with-family";

interface Benefit {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  amount: string;
  description: string;
  how: string;
  href: string | null;
  conditions: {
    age: AgeGroup[];
    income: IncomeLevel[];
    mobility?: MobilityLevel[];
    household?: HouseholdType[];
  };
}

const BENEFITS: Benefit[] = [
  {
    id: "basic-pension",
    name: "기초연금",
    tag: "소득 지원",
    tagColor: "#1B6FC8",
    amount: "독거 월 최대 334,810원 / 부부 월 최대 535,680원 (2024년 기준)",
    description: "만 65세 이상 소득 하위 70%에 해당하면 매월 기초연금을 받을 수 있습니다. 독거 어르신은 최대 334,810원, 부부가 모두 수급할 경우 각각 20% 감액되어 합산 535,680원(267,840원×2)을 받습니다.",
    how: "주소지 읍·면·동 주민센터 또는 복지로(bokjiro.go.kr) 온라인 신청",
    href: "/welfare/basic-pension",
    conditions: { age: ["65to69", "70plus"], income: ["basic", "near-basic", "medium50", "other"] },
  },
  {
    id: "long-term-care",
    name: "장기요양보험 등급 신청",
    tag: "돌봄 서비스",
    tagColor: "#0EA5E9",
    amount: "등급별 재가·시설 서비스 지원",
    description: "혼자 거동이 어렵거나 일상적인 도움이 필요한 경우, 요양보호사 방문이나 요양원 입소 비용 일부를 지원받을 수 있습니다.",
    how: "국민건강보험공단 (☎ 1577-1000) 또는 가까운 공단 지사 방문 신청",
    href: "/welfare/long-term-care",
    conditions: { age: ["60to64", "65to69", "70plus"], income: ["basic", "near-basic", "medium50", "other"], mobility: ["partial", "full-care"] },
  },
  {
    id: "senior-care",
    name: "노인맞춤돌봄서비스",
    tag: "돌봄 서비스",
    tagColor: "#0EA5E9",
    amount: "안전확인·생활지원·연계 서비스 무료",
    description: "혼자 사시거나 거동이 불편한 어르신을 위해 정기적으로 방문하거나 전화로 안부를 확인하고 생활에 필요한 도움을 드립니다. 독거 어르신이나 부부 가구에서 특히 유용합니다.",
    how: "주소지 읍·면·동 주민센터에 신청하거나 노인복지관에 문의",
    href: null,
    conditions: { age: ["65to69", "70plus"], income: ["basic", "near-basic", "medium50", "other"], mobility: ["independent", "partial", "full-care"], household: ["alone", "couple"] },
  },
  {
    id: "medical-aid",
    name: "의료급여 (기초생활수급자)",
    tag: "의료 지원",
    tagColor: "#059669",
    amount: "병원비 대부분 국가 부담 (1종·2종)",
    description: "기초생활수급자로 선정되면 진료비와 약값의 대부분을 국가에서 부담합니다. 1종은 거의 무료, 2종은 일부 본인 부담이 있습니다.",
    how: "주소지 읍·면·동 주민센터에서 기초생활보장 수급자 신청",
    href: null,
    conditions: { age: ["under60", "60to64", "65to69", "70plus"], income: ["basic"] },
  },
  {
    id: "near-basic-medical",
    name: "차상위 본인부담 경감",
    tag: "의료 지원",
    tagColor: "#059669",
    amount: "건강보험 본인부담금 경감",
    description: "차상위계층에 해당하면 건강보험 본인부담금을 줄여주는 제도를 이용할 수 있습니다. 만성질환, 입원비 등 의료비 부담이 줄어듭니다.",
    how: "주소지 읍·면·동 주민센터에서 차상위계층 확인 신청",
    href: null,
    conditions: { age: ["under60", "60to64", "65to69", "70plus"], income: ["near-basic"] },
  },
  {
    id: "dental",
    name: "틀니·임플란트 건강보험 적용",
    tag: "의료 지원",
    tagColor: "#059669",
    amount: "본인부담 30% 수준 (기존 전액 자비 → 대폭 절감)",
    description: "만 65세 이상이면 틀니(완전·부분)와 임플란트에 건강보험이 적용되어 본인부담금이 크게 줄어듭니다. 별도 신청 없이 치과에서 바로 적용됩니다.",
    how: "치과 방문 시 신분증 지참 — 건강보험증 있으면 자동 적용",
    href: "/health/insurance-copay",
    conditions: { age: ["65to69", "70plus"], income: ["basic", "near-basic", "medium50", "other"] },
  },
  {
    id: "health-checkup",
    name: "생애전환기 건강검진 (66세)",
    tag: "건강검진",
    tagColor: "#7C3AED",
    amount: "무료 (일반건강검진 포함)",
    description: "만 66세가 되는 해에 생애전환기 건강검진을 무료로 받을 수 있습니다. 암검진, 인지기능장애 검사 등이 포함됩니다. 짝수·홀수 출생 연도에 따라 검진 연도가 다릅니다.",
    how: "건강보험공단 안내문 수령 후 지정 검진기관 방문 (☎ 1577-1000)",
    href: "/health/checkup",
    conditions: { age: ["65to69", "70plus"], income: ["basic", "near-basic", "medium50", "other"] },
  },
  {
    id: "senior-job",
    name: "노인일자리 및 사회활동 지원",
    tag: "일자리·활동",
    tagColor: "#D97706",
    amount: "월 27만~40만원 (활동 유형별 상이)",
    description: "만 65세 이상이면 공익활동, 사회서비스형, 시장형 일자리 등 다양한 노인일자리 사업에 참여할 수 있습니다. 소득 활동과 사회 참여를 동시에 지원합니다.",
    how: "주소지 읍·면·동 주민센터 또는 노인복지관 신청 (매년 1~2월 모집)",
    href: null,
    conditions: { age: ["65to69", "70plus"], income: ["basic", "near-basic", "medium50"] },
  },
];

const AGE_OPTIONS: { key: AgeGroup; label: string }[] = [
  { key: "under60", label: "만 60세 미만" },
  { key: "60to64", label: "만 60~64세" },
  { key: "65to69", label: "만 65~69세" },
  { key: "70plus", label: "만 70세 이상" },
];

const INCOME_OPTIONS: { key: IncomeLevel; label: string; sub: string }[] = [
  { key: "basic", label: "기초생활수급자", sub: "기초생활보장 수급 중" },
  { key: "near-basic", label: "차상위계층", sub: "소득 기준 인정받은 경우" },
  { key: "medium50", label: "중위소득 50% 이하", sub: "4인 기준 월 약 270만원 이하" },
  { key: "other", label: "그 외", sub: "위 항목에 해당 안 됨" },
];

const MOBILITY_OPTIONS: { key: MobilityLevel; label: string; sub: string }[] = [
  { key: "independent", label: "혼자 생활 가능", sub: "일상생활 대부분 혼자 해결" },
  { key: "partial", label: "부분적으로 도움 필요", sub: "이동·집안일 등 일부 지원 필요" },
  { key: "full-care", label: "상시 돌봄 필요", sub: "일상의 대부분에서 도움 필요" },
];

const HOUSEHOLD_OPTIONS: { key: HouseholdType; label: string; sub: string }[] = [
  { key: "alone", label: "독거 (혼자)", sub: "혼자 생활하는 경우" },
  { key: "couple", label: "배우자와 함께", sub: "부부 가구" },
  { key: "with-family", label: "자녀·가족과 함께", sub: "동거 가족이 있는 경우" },
];

const TAG_BG: Record<string, string> = {
  "#1B6FC8": "#EFF6FF",
  "#0EA5E9": "#F0F9FF",
  "#059669": "#F0FDF4",
  "#7C3AED": "#F5F3FF",
  "#D97706": "#FFFBEB",
};

export default function BenefitFinder() {
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [income, setIncome] = useState<IncomeLevel | null>(null);
  const [mobility, setMobility] = useState<MobilityLevel | null>(null);
  const [household, setHousehold] = useState<HouseholdType | null>(null);
  const [showResult, setShowResult] = useState(false);

  const matched = showResult && age && income && mobility && household
    ? BENEFITS.filter((b) => {
        const ageMatch = b.conditions.age.includes(age);
        const incomeMatch = b.conditions.income.includes(income);
        const mobilityMatch = !b.conditions.mobility || b.conditions.mobility.includes(mobility);
        const householdMatch = !b.conditions.household || b.conditions.household.includes(household);
        return ageMatch && incomeMatch && mobilityMatch && householdMatch;
      })
    : [];

  const ageLabelOf = (k: AgeGroup) => AGE_OPTIONS.find((o) => o.key === k)?.label ?? "";
  const incomeLabelOf = (k: IncomeLevel) => INCOME_OPTIONS.find((o) => o.key === k)?.label ?? "";
  const mobilityLabelOf = (k: MobilityLevel) => MOBILITY_OPTIONS.find((o) => o.key === k)?.label ?? "";
  const householdLabelOf = (k: HouseholdType) => HOUSEHOLD_OPTIONS.find((o) => o.key === k)?.label ?? "";

  const reset = () => setShowResult(false);

  const handleCheck = () => {
    if (!age || !income || !mobility || !household) { alert("네 가지 항목을 모두 선택해주세요."); return; }
    setShowResult(true);
    setTimeout(() => document.getElementById("bf-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleCopy = () => {
    if (!matched.length || !age || !income || !mobility || !household) return;
    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  내 혜택 찾아보기 결과",
      "  (시니어 든든 참고용 도구)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `나이: ${ageLabelOf(age)}  |  소득: ${incomeLabelOf(income)}`,
      `거동: ${mobilityLabelOf(mobility)}  |  가구: ${householdLabelOf(household)}`,
      `확인된 혜택: ${matched.length}개`,
      "",
      ...matched.map((b, i) => [
        `${i + 1}. ${b.name} [${b.tag}]`,
        `   지원 내용: ${b.amount}`,
        `   ${b.description}`,
        `   신청 방법: ${b.how}`,
        "",
      ].join("\n")),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "※ 이 결과는 참고용입니다. 실제 수급 여부는",
      "   관련 기관에서 확인하시기 바랍니다.",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ];
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => alert("결과가 복사되었습니다.\n카카오톡, 메모장 등에 붙여넣기 해보세요."))
      .catch(() => alert("복사에 실패했습니다."));
  };

  const canCheck = !!age && !!income && !!mobility && !!household;

  const SelectBtn = ({
    label, sub, active, onClick,
  }: { label: string; sub?: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{ height: "auto", minHeight: 52, padding: "12px 16px", fontSize: 15, fontWeight: 600, borderRadius: 12, border: `2px solid ${active ? "#1B6FC8" : "#DBEAFE"}`, background: active ? "#1B6FC8" : "#fff", color: active ? "#fff" : "#1A1A2E", cursor: "pointer", textAlign: "left", lineHeight: 1.3 }}
    >
      {label}
      {sub && <span style={{ display: "block", fontSize: 11, fontWeight: 400, marginTop: 3, color: active ? "rgba(255,255,255,0.8)" : "#6B7280" }}>{sub}</span>}
    </button>
  );

  return (
    <div style={{ marginBottom: 40 }}>
      {/* 섹션 헤더 */}
      <div style={{ background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)", borderRadius: 20, padding: "28px 24px", marginBottom: 24, color: "#fff" }}>
        <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>복지혜택 찾기</p>
        <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 8 }}>
          내 상황에 맞는 혜택을<br />바로 확인해보세요
        </h2>
        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.65 }}>
          아래 항목을 선택하면 받을 수 있는 복지혜택 목록을 보여드립니다.<br />
          회원가입 없이 바로 확인할 수 있습니다.
        </p>
      </div>

      {/* 입력 패널 */}
      <div style={{ background: "#F8FBFF", borderRadius: 18, padding: "24px 20px", border: "1.5px solid #DBEAFE", marginBottom: 20 }}>
        {/* 나이 */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>
            <span style={{ color: "#1B6FC8" }}>01</span>  나이가 어떻게 되세요?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {AGE_OPTIONS.map((o) => (
              <SelectBtn key={o.key} label={o.label} active={age === o.key} onClick={() => { setAge(o.key); reset(); }} />
            ))}
          </div>
        </div>

        {/* 소득 */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>
            <span style={{ color: "#1B6FC8" }}>02</span>  소득·재산 수준은 어느 정도인가요?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {INCOME_OPTIONS.map((o) => (
              <SelectBtn key={o.key} label={o.label} sub={o.sub} active={income === o.key} onClick={() => { setIncome(o.key); reset(); }} />
            ))}
          </div>
        </div>

        {/* 거동 */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>
            <span style={{ color: "#1B6FC8" }}>03</span>  일상생활 거동 상태는 어떤가요?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }} className="bf-mobility-grid">
            {MOBILITY_OPTIONS.map((o) => (
              <SelectBtn key={o.key} label={o.label} sub={o.sub} active={mobility === o.key} onClick={() => { setMobility(o.key); reset(); }} />
            ))}
          </div>
        </div>

        {/* 가구 구성 */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>
            <span style={{ color: "#1B6FC8" }}>04</span>  가구 구성은 어떻게 되시나요?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }} className="bf-mobility-grid">
            {HOUSEHOLD_OPTIONS.map((o) => (
              <SelectBtn key={o.key} label={o.label} sub={o.sub} active={household === o.key} onClick={() => { setHousehold(o.key); reset(); }} />
            ))}
          </div>
        </div>

        <button
          onClick={handleCheck}
          style={{ width: "100%", height: 58, fontSize: 17, fontWeight: 700, color: "#fff", background: canCheck ? "#1B6FC8" : "#9CA3AF", border: "none", borderRadius: 14, cursor: canCheck ? "pointer" : "default", letterSpacing: "-0.2px", transition: "background 0.2s" }}
        >
          {canCheck ? "혜택 확인하기 →" : "네 항목을 모두 선택해주세요"}
        </button>
      </div>

      {/* 결과 */}
      {showResult && age && income && mobility && household && (
        <div id="bf-result">
          {/* 결과 헤더 */}
          <div style={{ background: matched.length > 0 ? "#EFF6FF" : "#FEF2F2", border: `1.5px solid ${matched.length > 0 ? "#BFDBFE" : "#FECACA"}`, borderRadius: 14, padding: "16px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{matched.length > 0 ? "🎉" : "🔍"}</span>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: matched.length > 0 ? "#1E3A8A" : "#7F1D1D", marginBottom: 2 }}>
                {matched.length > 0 ? `확인된 혜택 ${matched.length}개` : "해당 조건의 혜택을 찾지 못했습니다"}
              </p>
              <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>
                {ageLabelOf(age)} · {incomeLabelOf(income)} · {mobilityLabelOf(mobility)} · {householdLabelOf(household)} 기준
              </p>
            </div>
            {matched.length > 0 && (
              <button
                onClick={handleCopy}
                style={{ marginLeft: "auto", height: 40, padding: "0 16px", fontSize: 13, fontWeight: 700, color: "#1B6FC8", background: "#fff", border: "2px solid #BFDBFE", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                📋 목록 복사
              </button>
            )}
          </div>

          {/* 혜택 카드 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {matched.map((b) => (
              <div key={b.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E8F0FE", overflow: "hidden" }}>
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: b.tagColor, background: TAG_BG[b.tagColor] ?? "#F0F7FF", padding: "3px 8px", borderRadius: 6, marginRight: 8 }}>{b.tag}</span>
                      <p style={{ fontSize: 17, fontWeight: 800, color: "#1A1A2E", marginTop: 6, letterSpacing: "-0.3px" }}>{b.name}</p>
                    </div>
                    {b.href && (
                      <a href={b.href} style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#1B6FC8", textDecoration: "none", whiteSpace: "nowrap", marginTop: 4 }}>
                        자세히 →
                      </a>
                    )}
                  </div>

                  <div style={{ background: "#F8FBFF", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
                    <p style={{ fontSize: 12, color: "#4A5568", fontWeight: 600, marginBottom: 3 }}>지원 내용</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1B6FC8" }}>{b.amount}</p>
                  </div>

                  <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, marginBottom: 10 }}>{b.description}</p>

                  <div style={{ borderTop: "1px solid #F0F7FF", paddingTop: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4A5568", flexShrink: 0, marginTop: 1 }}>신청</span>
                    <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.65 }}>{b.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 면책 */}
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 18px" }}>
            <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.75 }}>
              ⚠️ 이 결과는 입력하신 조건을 기준으로 한 <strong>참고용 안내</strong>입니다. 실제 수급 자격과 지원 금액은 소득·재산 조사 결과에 따라 달라질 수 있습니다. 정확한 내용은 주소지 읍·면·동 주민센터 또는 복지로(bokjiro.go.kr)에서 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:480px){
          .bf-mobility-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  );
}
