"use client";
import { useState } from "react";

type VisitType = "general" | "checkup" | "prescription" | "results" | "sudden";

const visitTypes: { key: VisitType; label: string; icon: string }[] = [
  { key: "general", label: "일반 진료", icon: "🩺" },
  { key: "checkup", label: "정기 검진", icon: "📋" },
  { key: "prescription", label: "약 처방", icon: "💊" },
  { key: "results", label: "검사 결과 확인", icon: "🔬" },
  { key: "sudden", label: "갑작스러운 증상", icon: "🚨" },
];

const checklistData: Record<VisitType, { bring: string[]; questions: string[] }> = {
  general: {
    bring: ["신분증", "진료카드 (건강보험증)", "복용 중인 약 목록 또는 약봉투", "증상을 메모한 종이", "보호자 연락처"],
    questions: [
      "지금 이 증상이 언제부터 시작됐나요?",
      "지금 먹고 있는 약이나 건강기능식품이 있는데, 같이 먹어도 되나요?",
      "증상이 심해지면 언제쯤 다시 병원에 와야 하나요?",
      "일상생활에서 주의할 것이 있나요?",
      "다음 진료는 언제 오면 되나요?",
    ],
  },
  checkup: {
    bring: ["신분증", "건강보험증", "지난 검진 결과지 (있는 경우)", "최근 복용 약 목록", "공복 상태 유지 (검진 전날 저녁 이후 금식)"],
    questions: [
      "지난번 검진과 비교해서 달라진 수치가 있나요?",
      "이번 검진에서 특히 주의해서 확인해야 할 항목이 있나요?",
      "이 수치가 계속 이러면 어떤 건강 문제로 이어질 수 있나요?",
      "생활 습관 중에서 지금 당장 바꿔야 할 것이 있나요?",
      "다음 검진은 언제쯤 받으면 되나요?",
    ],
  },
  prescription: {
    bring: ["신분증", "기존 처방전 또는 약봉투", "복용 중인 다른 약 목록", "건강보험증"],
    questions: [
      "이 약은 지금 먹고 있는 다른 약과 함께 복용해도 괜찮나요?",
      "식사 전에 먹어야 하나요, 식사 후에 먹어야 하나요?",
      "이 약을 장기 복용해도 괜찮은 약인가요?",
      "부작용이 생기면 어떻게 해야 하나요?",
      "약을 끊어도 되는 시점이 언제인가요?",
    ],
  },
  results: {
    bring: ["신분증", "검사 의뢰서 또는 이전 방문 안내문", "복용 중인 약 목록", "진료카드"],
    questions: [
      "이번 결과가 정상 범위인가요?",
      "이 결과를 보면 어떤 상태라고 볼 수 있나요?",
      "추가로 해야 할 검사가 있나요?",
      "결과가 좋지 않다면 이 병원에서 치료받을 수 있나요?",
      "다음에는 언제 다시 확인하러 오면 되나요?",
    ],
  },
  sudden: {
    bring: ["신분증", "건강보험증", "복용 중인 약 목록 (가능하면)", "보호자 동행 권장"],
    questions: [
      "지금 이 증상이 위급한 상황인가요?",
      "어떤 검사를 받아야 하나요?",
      "응급실로 가야 하나요, 외래로 봐도 되나요?",
      "집에서 주의할 것이 있나요?",
      "비슷한 증상이 또 생기면 어떻게 해야 하나요?",
    ],
  },
};

export default function HospitalChecklistPreview() {
  const [selected, setSelected] = useState<VisitType | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [symptomMemo, setSymptomMemo] = useState("");

  const toggleCheck = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const buildCopyText = () => {
    if (!selected) return "";
    const data = checklistData[selected];
    const label = visitTypes.find((v) => v.key === selected)?.label ?? "";
    const icon = visitTypes.find((v) => v.key === selected)?.icon ?? "";

    return [
      `오늘 ${icon} [${label}]를 보러 병원에 갑니다.`,
      "아래 내용을 참고해서 준비했습니다.",
      "",
      "🎒 챙겨야 할 것",
      ...data.bring.map((b, i) => `  ${i + 1}. ${b}`),
      "",
      "💬 의사 선생님께 여쭤볼 것",
      ...data.questions.map((q, i) => `  ${i + 1}. ${q}`),
      "",
      ...(symptomMemo.trim() ? ["📝 오늘 특별히 말씀드릴 것", `  ${symptomMemo.trim()}`, ""] : []),
      "─────────────────────────────────",
      "📱 보호자분께 드리는 메모",
      "",
      `○○님이 오늘 [${label}]으로 병원에 가십니다.`,
      "",
      "챙겨드려야 할 것:",
      ...data.bring.map((b) => `  · ${b}`),
      "",
      "선생님께 여쭤봐야 할 것:",
      ...data.questions.map((q) => `  · ${q}`),
      "",
      ...(symptomMemo.trim() ? ["📝 오늘 특별히 말씀드릴 것:", `  ${symptomMemo.trim()}`, ""] : []),
      "─────────────────────────────────",
      "※ 병원 방문 준비 도구 · 시니어 든든",
      "※ 정확한 진단과 치료는 의료진 안내를 따르세요.",
    ].join("\n");
  };

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard
      .writeText(buildCopyText())
      .then(() => alert("복사되었습니다.\n카카오톡, 메모장 등에 붙여넣기 해보세요."))
      .catch(() => alert("복사에 실패했습니다. 브라우저 설정을 확인해주세요."));
  };

  const handlePrint = () => {
    if (!selected) return;
    const data = checklistData[selected];
    const label = visitTypes.find((v) => v.key === selected)?.label ?? "";

    const bringRows = data.bring
      .map((b, i) => `<tr><td style="padding:6px 8px;border:1px solid #E8F0FE;">${i + 1}</td><td style="padding:6px 10px;border:1px solid #E8F0FE;">${b}</td><td style="padding:6px 8px;border:1px solid #E8F0FE;text-align:center;">□</td></tr>`)
      .join("");
    const questionRows = data.questions
      .map((q, i) => `<tr><td style="padding:6px 8px;border:1px solid #E8F0FE;">${i + 1}</td><td style="padding:6px 10px;border:1px solid #E8F0FE;">${q}</td></tr>`)
      .join("");

    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요."); return; }
    w.document.write(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>병원 방문 체크리스트 — ${label}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:"Apple SD Gothic Neo","Noto Sans KR",sans-serif;padding:32px;color:#1A1A2E;max-width:680px;margin:0 auto;font-size:14px;}
      h1{font-size:20px;font-weight:800;color:#0EA5E9;margin-bottom:4px;}
      .sub{font-size:12px;color:#4A5568;margin-bottom:24px;border-bottom:2px solid #0EA5E9;padding-bottom:12px;}
      h2{font-size:15px;font-weight:700;margin:20px 0 10px;color:#1A1A2E;}
      table{width:100%;border-collapse:collapse;margin-bottom:4px;font-size:14px;}
      th{background:#F0F9FF;color:#0EA5E9;font-size:13px;padding:8px;border:1px solid #BAE6FD;text-align:left;}
      .memo{background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px 16px;margin-top:20px;}
      .memo h2{font-size:14px;margin:0 0 10px;color:#92400E;}
      .memo p{font-size:13px;color:#78350F;line-height:1.9;}
      .disclaimer{margin-top:24px;font-size:11px;color:#9CA3AF;border-top:1px solid #E8F0FE;padding-top:12px;line-height:1.7;}
      @media print{body{padding:16px;font-size:13px;}h1{font-size:18px;}}
    </style></head><body>
    <h1>병원 방문 체크리스트 — ${label}</h1>
    <p class="sub">참고용 도구 · 정확한 진단과 치료는 의료진 안내를 따라야 합니다</p>

    <h2>✅ 오늘 챙길 것</h2>
    <table><thead><tr><th style="width:36px">#</th><th>항목</th><th style="width:56px;text-align:center">확인</th></tr></thead>
    <tbody>${bringRows}</tbody></table>

    <h2>💬 의사 선생님께 여쭤볼 질문</h2>
    <table><thead><tr><th style="width:36px">#</th><th>질문</th></tr></thead>
    <tbody>${questionRows}</tbody></table>

    <div class="memo">
      <h2>📱 보호자분께 드리는 메모</h2>
      <p>
        ○○님이 오늘 <strong>[${label}]</strong>으로 병원에 가십니다.<br><br>
        <strong>챙겨드려야 할 것:</strong><br>
        ${data.bring.map((b, i) => `${i + 1}. ${b}`).join("<br>")}<br><br>
        <strong>선생님께 여쭤봐야 할 것:</strong><br>
        ${data.questions.map((q, i) => `${i + 1}. ${q}`).join("<br>")}
        ${symptomMemo.trim() ? `<br><br><strong>📝 오늘 특별히 말씀드릴 것:</strong><br>${symptomMemo.trim()}` : ""}
      </p>
    </div>

    <p class="disclaimer">⚠️ 이 체크리스트는 병원 방문 준비를 돕기 위한 참고용 도구입니다. 정확한 진단과 치료는 의사·약사 등 의료진의 안내를 따라야 합니다.</p>
    </body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const selectedData = selected ? checklistData[selected] : null;
  const selectedLabel = selected ? (visitTypes.find((v) => v.key === selected)?.label ?? "") : "";
  const selectedIcon = selected ? (visitTypes.find((v) => v.key === selected)?.icon ?? "") : "";

  return (
    <section id="checklist" style={{ background: "#F0F7FF", padding: "72px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0EA5E9", marginBottom: 6, letterSpacing: "0.05em" }}>병원 방문 체크리스트</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>
          병원 가기 전, 미리 준비해보세요
        </h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 32, lineHeight: 1.65 }}>
          진료 목적을 선택하면 오늘 챙길 것과 의사에게 물어볼 질문을 정리해드립니다.<br />
          <strong style={{ color: "#1B6FC8" }}>복사하거나 인쇄해서</strong> 병원에 가져가세요.
        </p>

        {/* 진료 유형 선택 */}
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>어떤 진료를 보러 가시나요?</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {visitTypes.map((v) => (
            <button
              key={v.key}
              onClick={() => { setSelected(v.key); setChecked({}); setSymptomMemo(""); }}
              style={{ height: 52, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: 12, border: `2px solid ${selected === v.key ? "#0EA5E9" : "#DBEAFE"}`, background: selected === v.key ? "#0EA5E9" : "#fff", color: selected === v.key ? "#fff" : "#1A1A2E", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
            >
              <span>{v.icon}</span>{v.label}
            </button>
          ))}
        </div>

        {/* 증상 메모 */}
        {selected && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #BAE6FD", padding: "18px 20px", marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>
              📝 오늘 특별히 말씀드릴 것이 있나요? <span style={{ fontSize: 12, fontWeight: 400, color: "#6B7280" }}>(선택 — 복사·인쇄에 포함됩니다)</span>
            </label>
            <textarea
              value={symptomMemo}
              onChange={(e) => setSymptomMemo(e.target.value)}
              placeholder="예: 어제부터 왼쪽 무릎이 아파요. 계단 오를 때 특히 심하고, 부어있어요."
              rows={3}
              style={{ width: "100%", fontSize: 15, lineHeight: 1.65, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #BAE6FD", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", color: "#1A1A2E" }}
            />
          </div>
        )}

        {/* 결과 */}
        {selected && selectedData && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "2px solid #BAE6FD", marginBottom: 16 }}>
            <div style={{ background: "#0EA5E9", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{selectedIcon} {selectedLabel} 준비 목록</p>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 99 }}>참고용 도구</span>
            </div>

            <div style={{ padding: "24px 20px" }}>
              {/* 2컬럼 그리드 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }} className="cl-grid">
                {/* 오늘 챙길 것 */}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 12 }}>✅ 오늘 챙길 것</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedData.bring.map((item) => (
                      <label key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: checked[item] ? "#F0FDF4" : "#F0F7FF", minHeight: 44 }}>
                        <input
                          type="checkbox"
                          checked={!!checked[item]}
                          onChange={() => toggleCheck(item)}
                          style={{ width: 20, height: 20, cursor: "pointer", accentColor: "#0EA5E9", flexShrink: 0, marginTop: 2 }}
                        />
                        <span style={{ fontSize: 14, color: checked[item] ? "#6B7280" : "#1A1A2E", textDecoration: checked[item] ? "line-through" : "none", lineHeight: 1.5 }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 의사에게 물어볼 질문 */}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 12 }}>💬 의사 선생님께 여쭤볼 것</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedData.questions.map((q, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#F0F7FF" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0EA5E9", flexShrink: 0, lineHeight: 1.6, width: 18, textAlign: "right" }}>{i + 1}</span>
                        <p style={{ fontSize: 14, color: "#1A1A2E", lineHeight: 1.6 }}>{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 보호자 메모 */}
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 12 }}>📱 보호자분께 드리는 메모</p>
                <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.8, marginBottom: 10 }}>
                  ○○님이 오늘 <strong>[{selectedLabel}]</strong>으로 병원에 가십니다.
                </p>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#78350F", marginBottom: 6 }}>챙겨드려야 할 것:</p>
                <ul style={{ margin: "0 0 12px 16px", padding: 0 }}>
                  {selectedData.bring.map((b, i) => (
                    <li key={i} style={{ fontSize: 13, color: "#78350F", lineHeight: 1.9 }}>{b}</li>
                  ))}
                </ul>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#78350F", marginBottom: 6 }}>선생님께 여쭤봐야 할 것:</p>
                <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
                  {selectedData.questions.map((q, i) => (
                    <li key={i} style={{ fontSize: 13, color: "#78350F", lineHeight: 1.9 }}>{q}</li>
                  ))}
                </ul>
                {symptomMemo.trim() && (
                  <>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#78350F", marginBottom: 4, marginTop: 10 }}>📝 오늘 특별히 말씀드릴 것:</p>
                    <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.8, padding: "8px 12px", background: "rgba(255,255,255,0.5)", borderRadius: 8 }}>{symptomMemo}</p>
                  </>
                )}
              </div>

              {/* 면책 */}
              <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#0369A1", lineHeight: 1.7 }}>
                  ⚠️ 이 체크리스트는 <strong>병원 방문 준비를 돕기 위한 참고용 도구</strong>입니다. 정확한 진단과 치료는 의사·약사 등 <strong>의료진의 안내</strong>를 따라야 합니다.
                </p>
              </div>

              {/* 버튼 */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleCopy} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#fff", background: "#0EA5E9", border: "none", borderRadius: 12, cursor: "pointer" }}>
                  📋 결과 복사하기
                </button>
                <button onClick={handlePrint} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#0EA5E9", background: "#F0F9FF", border: "2px solid #BAE6FD", borderRadius: 12, cursor: "pointer" }}>
                  🖨️ 인쇄하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 상시 면책 */}
        <div style={{ padding: "14px 18px", background: "#fff", borderRadius: 12, border: "1px solid #DBEAFE" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.65 }}>
            ℹ️ 이 체크리스트는 <strong>병원 방문 준비를 돕기 위한 참고용 도구</strong>입니다. 정확한 진단과 치료는 의료진의 안내를 따라야 합니다.
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){.cl-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  );
}
