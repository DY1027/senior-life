"use client";
import { useState } from "react";

type VisitType = "general" | "checkup" | "prescription" | "results" | "sudden" | null;

const visitTypes: { key: VisitType; label: string; icon: string }[] = [
  { key: "general", label: "일반 진료", icon: "🩺" },
  { key: "checkup", label: "정기 검진", icon: "📋" },
  { key: "prescription", label: "약 처방", icon: "💊" },
  { key: "results", label: "검사 결과 확인", icon: "🔬" },
  { key: "sudden", label: "갑작스러운 증상", icon: "🚨" },
];

const checklistData: Record<NonNullable<VisitType>, { bring: string[]; questions: string[] }> = {
  general: {
    bring: ["신분증", "진료카드 (건강보험증)", "복용 중인 약 목록 또는 약봉투", "증상을 메모한 종이", "보호자 연락처"],
    questions: ["지금 증상이 언제부터 시작됐나요?", "이 약을 계속 먹어도 되나요?", "증상이 심해지면 언제 다시 와야 하나요?", "다음 진료는 언제 오면 되나요?"],
  },
  checkup: {
    bring: ["신분증", "건강보험증", "지난 검진 결과지 (있는 경우)", "최근 복용 약 목록", "공복 상태 유지 (검진 전날 저녁 이후 금식 여부 확인)"],
    questions: ["지난번과 달라진 수치가 있나요?", "이번 검진에서 특히 확인해야 할 항목이 있나요?", "다음 검진은 언제 받으면 되나요?", "생활 습관에서 바꿔야 할 게 있나요?"],
  },
  prescription: {
    bring: ["신분증", "기존 처방전 또는 약봉투", "복용 중인 다른 약 목록", "건강보험증"],
    questions: ["이 약은 다른 약과 함께 먹어도 되나요?", "식사 전 / 후 언제 먹어야 하나요?", "부작용이 생기면 어떻게 해야 하나요?", "약을 끊어도 되는 시점이 언제인가요?"],
  },
  results: {
    bring: ["신분증", "검사 의뢰서 또는 이전 방문 안내문", "복용 중인 약 목록", "진료카드"],
    questions: ["결과가 정상 범위인가요?", "추가로 해야 할 검사가 있나요?", "결과가 나쁘다면 어떤 치료를 받아야 하나요?", "다음에 언제 확인하러 와야 하나요?"],
  },
  sudden: {
    bring: ["신분증", "건강보험증", "복용 중인 약 목록 (가능하면)", "보호자 동행 권장"],
    questions: ["지금 증상이 위급한 상황인가요?", "어떤 검사가 필요한가요?", "응급실로 가야 하나요?", "집에서 주의할 것이 있나요?"],
  },
};

export default function HospitalChecklistPreview() {
  const [selected, setSelected] = useState<VisitType>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCopy = () => {
    if (!selected) return;
    const data = checklistData[selected];
    const type = visitTypes.find((v) => v.key === selected)?.label ?? "";
    const text = [
      `[병원 방문 체크리스트 — ${type}]`,
      "",
      "오늘 챙길 것:",
      ...data.bring.map((b, i) => `${i + 1}. ${b}`),
      "",
      "의사에게 물어볼 질문:",
      ...data.questions.map((q, i) => `${i + 1}. ${q}`),
      "",
      "※ 이 체크리스트는 병원 방문 준비를 돕기 위한 참고용 도구입니다.",
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => alert("복사되었습니다."));
  };

  const handlePrint = () => window.print();

  return (
    <section id="checklist" style={{ background: "#F0F7FF", padding: "72px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0EA5E9", marginBottom: 6, letterSpacing: "0.05em" }}>병원 방문 체크리스트</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>
          병원 가기 전, 미리 준비해보세요
        </h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 32, lineHeight: 1.65 }}>
          진료 목적을 선택하면 오늘 챙길 것과 의사에게 물어볼 질문을 정리해드립니다.<br />
          복사하거나 인쇄해서 병원에 가져가세요.
        </p>

        {/* 진료 유형 선택 */}
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>어떤 진료를 보러 가시나요?</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {visitTypes.map((v) => (
            <button key={v.key}
              onClick={() => { setSelected(v.key); setChecked({}); }}
              style={{ height: 52, padding: "0 20px", fontSize: 15, fontWeight: 600, borderRadius: 12, border: `2px solid ${selected === v.key ? "#1B6FC8" : "#DBEAFE"}`, background: selected === v.key ? "#1B6FC8" : "#fff", color: selected === v.key ? "#fff" : "#1A1A2E", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
              <span>{v.icon}</span>{v.label}
            </button>
          ))}
        </div>

        {/* 결과 */}
        {selected && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }} className="checklist-print">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }} className="cl-grid">
              {/* 오늘 챙길 것 */}
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>✅ 오늘 챙길 것</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {checklistData[selected].bring.map((item) => (
                    <label key={item} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 10px", borderRadius: 10, background: checked[item] ? "#F0FDF4" : "#F0F7FF" }}>
                      <input type="checkbox" checked={!!checked[item]} onChange={() => toggleCheck(item)}
                        style={{ width: 20, height: 20, cursor: "pointer", accentColor: "#1B6FC8", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: checked[item] ? "#6B7280" : "#1A1A2E", textDecoration: checked[item] ? "line-through" : "none", lineHeight: 1.5 }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 의사에게 물어볼 질문 */}
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>💬 의사에게 물어볼 질문</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {checklistData[selected].questions.map((q, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#F0F7FF" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1B6FC8", flexShrink: 0, lineHeight: 1.6 }}>{i + 1}</span>
                      <p style={{ fontSize: 14, color: "#1A1A2E", lineHeight: 1.6 }}>{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 보호자 메모 */}
            <div style={{ background: "#FFF8F0", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 8 }}>📱 보호자에게 보낼 메모 (참고)</p>
              <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.8 }}>
                <p>• 진료 목적: {visitTypes.find((v) => v.key === selected)?.label}</p>
                <p>• 챙겨야 할 것: 위 목록 참고</p>
                <p>• 의사에게 물어볼 질문: 위 항목 참고</p>
              </div>
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCopy} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 12, cursor: "pointer" }}>
                📋 복사하기
              </button>
              <button onClick={handlePrint} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#1A1A2E", background: "#F0F7FF", border: "2px solid #DBEAFE", borderRadius: 12, cursor: "pointer" }}>
                🖨️ 인쇄하기
              </button>
            </div>
          </div>
        )}

        {/* 면책 */}
        <div style={{ padding: "14px 18px", background: "#fff", borderRadius: 12, border: "1px solid #DBEAFE" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.65 }}>
            ℹ️ 이 체크리스트는 <strong>병원 방문 준비를 돕기 위한 참고용 도구</strong>입니다. 정확한 진단과 치료는 의료진의 안내를 따라야 합니다.
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){.cl-grid{grid-template-columns:1fr!important;}}
        @media print{body>*:not(.checklist-print){display:none!important;}}
      `}</style>
    </section>
  );
}
