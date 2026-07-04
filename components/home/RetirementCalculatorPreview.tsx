"use client";
import { useState, useRef } from "react";

const fmt = (n: number) => n.toLocaleString("ko-KR");

const NEXT_STEPS = [
  { step: 1, text: "국민연금 예상 수령액 조회", sub: "'내 연금' 앱 또는 nps.or.kr", href: "/finance/national-pension" },
  { step: 2, text: "기초연금 대상 여부 확인", sub: "복지로(bokjiro.go.kr) 또는 읍·면·동 주민센터", href: "/welfare/basic-pension" },
  { step: 3, text: "월 고정지출 항목 점검", sub: "통신비, 보험료, 구독료 등 불필요한 지출 확인", href: null },
  { step: 4, text: "의료비 예비자금 별도 마련", sub: "노후 의료비는 생활비와 별도로 준비하는 것을 권장", href: null },
];

export default function RetirementCalculatorPreview() {
  const [savings, setSavings] = useState(50000000);
  const [monthly, setMonthly] = useState(500000);
  const [living, setLiving] = useState(2000000);
  const [pension, setPension] = useState(600000);
  const [goal, setGoal] = useState(500000000);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const safeGoal = Math.max(goal, 1);
  const readiness = Math.min(Math.round((savings / safeGoal) * 100), 100);
  const remaining = Math.max(goal - savings, 0);
  const monthlyIncome = monthly + pension;
  const shortfall = Math.max(living - monthlyIncome, 0);
  const yearsNeeded = monthly > 0 && remaining > 0
    ? Math.ceil(remaining / (monthly * 12))
    : remaining === 0 ? 0 : null;

  const readinessColor = readiness >= 80 ? "#059669" : readiness >= 50 ? "#1B6FC8" : "#D97706";
  const readinessLabel = readiness >= 80 ? "양호" : readiness >= 50 ? "보통" : "부족";

  const conclusion =
    readiness >= 100
      ? "목표 노후자금에 도달했습니다. 준비 상태를 점검해보세요."
      : readiness >= 80
      ? `현재 준비율 ${readiness}%로 비교적 양호합니다. 꾸준한 관리가 중요합니다.`
      : readiness >= 50
      ? `현재 준비율 ${readiness}%입니다. ${yearsNeeded ? `현재 속도라면 약 ${yearsNeeded}년이 필요합니다.` : ""}`
      : `현재 준비율 ${readiness}%로 추가 저축 계획을 검토해볼 시점입니다.`;

  const buildCopyText = () => [
    "═══════════════════════════════",
    "  노후자금 시뮬레이션 결과",
    "═══════════════════════════════",
    "",
    `▶ ${conclusion}`,
    "",
    "[ 준비 현황 ]",
    `  현재 준비율       ${readiness}% (${readinessLabel})`,
    `  현재 모아둔 돈    ${fmt(savings)}원`,
    `  목표 노후자금     ${fmt(goal)}원`,
    `  목표까지 남은 금액 ${fmt(remaining)}원`,
    `  예상 준비 기간    ${yearsNeeded != null ? `약 ${yearsNeeded}년` : "계산 불가"}`,
    "",
    "[ 월 생활비 분석 ]",
    `  예상 월 생활비    ${fmt(living)}원`,
    `  연금 + 저축       ${fmt(monthlyIncome)}원`,
    `  월 부족 예상액    ${shortfall > 0 ? fmt(shortfall) + "원" : "부족 없음"}`,
    "",
    "[ 다음에 확인할 것 ]",
    ...NEXT_STEPS.map((s) => `  ${s.step}. ${s.text}`),
    "",
    "───────────────────────────────",
    "※ 이 결과는 입력값 기준 참고용 시뮬레이션입니다.",
    "   실제 재무 판단은 개인 상황에 따라 달라질 수 있습니다.",
    "═══════════════════════════════",
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyText()).then(() => alert("결과가 복사되었습니다.\n메모장, 카카오톡 등에 붙여넣기 해보세요.")).catch(() => alert("복사에 실패했습니다. 브라우저 설정을 확인해주세요."));
  };

  const handlePrint = () => {
    const content = resultRef.current?.innerHTML ?? "";
    const w = window.open("", "_blank", "width=800,height=700");
    if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요."); return; }
    w.document.write(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>노후자금 시뮬레이션 결과</title>
      <style>
        body{font-family:"Apple SD Gothic Neo","Noto Sans KR",sans-serif;padding:32px;color:#1A1A2E;max-width:700px;margin:0 auto;}
        h1{font-size:20px;font-weight:800;color:#1B6FC8;margin-bottom:6px;}
        .sub{font-size:12px;color:#4A5568;margin-bottom:24px;}
        .conclusion{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px 18px;font-size:16px;font-weight:700;color:#1E3A8A;margin-bottom:20px;line-height:1.5;}
        .bar-wrap{background:#E8F0FE;border-radius:99px;height:14px;margin:8px 0 16px;overflow:hidden;}
        .bar-fill{height:100%;border-radius:99px;background:#1B6FC8;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
        .card{border:1px solid #E8F0FE;border-radius:10px;padding:12px 16px;}
        .card-label{font-size:11px;color:#4A5568;margin-bottom:4px;}
        .card-value{font-size:17px;font-weight:800;color:#1A1A2E;}
        .card-value.warn{color:#D97706;}
        .next{border:1px solid #E8F0FE;border-radius:10px;padding:16px;}
        .next h3{font-size:13px;font-weight:700;margin-bottom:12px;}
        .next-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #F0F7FF;}
        .next-item:last-child{border-bottom:none;}
        .next-num{font-size:13px;font-weight:700;color:#1B6FC8;flex-shrink:0;}
        .next-text{font-size:13px;color:#1A1A2E;}
        .next-sub{font-size:11px;color:#4A5568;margin-top:2px;}
        .disclaimer{margin-top:20px;font-size:11px;color:#9CA3AF;border-top:1px solid #E8F0FE;padding-top:12px;line-height:1.7;}
        @media print{body{padding:16px;}}
      </style></head><body>
      <h1>노후자금 시뮬레이션 결과</h1>
      <p class="sub">참고용 시뮬레이션 · 실제 결과는 개인 상황에 따라 다릅니다</p>
      ${content}
      </body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const handleCalculate = () => {
    setShowResult(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <section id="calculator" style={{ background: "#fff", padding: "72px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>노후자금 계산기</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>
          노후자금 준비 상태를 확인해보세요
        </h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 32, lineHeight: 1.7 }}>
          간단한 숫자를 입력하면 현재 준비 상태와 다음에 확인할 것을 알려드립니다.<br />
          <strong style={{ color: "#1B6FC8" }}>회원가입 없이 바로 사용</strong>할 수 있습니다.
        </p>

        {/* 입력 패널 */}
        <div style={{ background: "#F8FBFF", borderRadius: 20, padding: "24px 20px", marginBottom: 24, border: "1.5px solid #DBEAFE" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 18 }}>기본 정보 입력</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="rc-input-grid">
            {[
              { label: "현재 모아둔 돈", unit: "원", val: savings, set: setSavings, step: 1000000, hint: "예금, 적금, 투자 포함" },
              { label: "매달 저축 가능한 금액", unit: "원", val: monthly, set: setMonthly, step: 100000, hint: "매달 새로 저축하는 금액" },
              { label: "예상 월 생활비", unit: "원", val: living, set: setLiving, step: 100000, hint: "은퇴 후 한 달 생활비" },
              { label: "예상 연금 수령액 (월)", unit: "원", val: pension, set: setPension, step: 100000, hint: "국민연금 + 기초연금 합산" },
              { label: "목표 노후자금", unit: "원", val: goal, set: setGoal, step: 10000000, hint: "은퇴 후 필요한 총 금액" },
            ].map((f) => (
              <div key={f.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8F0FE" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4A5568", marginBottom: 4 }}>{f.label}</label>
                <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 8 }}>{f.hint}</p>
                <input
                  type="number"
                  value={f.val || ""}
                  step={f.step}
                  onChange={(e) => f.set(Number(e.target.value) || 0)}
                  style={{ width: "100%", fontSize: 18, fontWeight: 700, color: "#1A1A2E", border: "none", outline: "none", background: "transparent", boxSizing: "border-box", padding: 0 }}
                />
                <p style={{ fontSize: 11, color: "#1B6FC8", marginTop: 4, fontWeight: 600 }}>{fmt(f.val)}원</p>
              </div>
            ))}
          </div>
          <button onClick={handleCalculate}
            style={{ width: "100%", height: 56, marginTop: 18, fontSize: 17, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 14, cursor: "pointer", letterSpacing: "-0.2px" }}>
            준비 상태 확인하기 →
          </button>
        </div>

        {/* 결과 카드 */}
        {showResult && (
          <div ref={resultRef} style={{ background: "#fff", borderRadius: 20, border: "2px solid #DBEAFE", overflow: "hidden", marginBottom: 16 }}>
            {/* 결과 헤더 */}
            <div style={{ background: "#1B6FC8", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>노후자금 시뮬레이션 결과</p>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 99 }}>참고용 시뮬레이션</span>
            </div>

            <div style={{ padding: "24px 20px" }}>
              {/* 한 줄 결론 */}
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1E3A8A", lineHeight: 1.55 }}>{conclusion}</p>
              </div>

              {/* 준비 상태 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#4A5568" }}>현재 준비율</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: readinessColor, padding: "2px 10px", borderRadius: 99 }}>{readinessLabel}</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: readinessColor }}>{readiness}%</span>
                  </div>
                </div>
                <div style={{ height: 14, background: "#E8F0FE", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${readiness}%`, background: readinessColor, borderRadius: 99, transition: "width 0.6s ease" }} />
                </div>
              </div>

              {/* 핵심 수치 4개 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }} className="rc-result-grid">
                {[
                  { label: "목표까지 남은 금액", value: fmt(remaining) + "원", warn: remaining > 0 },
                  { label: "예상 준비 기간", value: yearsNeeded != null ? (yearsNeeded === 0 ? "목표 달성 ✓" : `약 ${yearsNeeded}년`) : "계산 불가", warn: false },
                  { label: "월 생활비 대비 부족액", value: shortfall > 0 ? fmt(shortfall) + "원" : "부족 없음 ✓", warn: shortfall > 0 },
                  { label: "연 + 저축 합계 (월)", value: fmt(monthlyIncome) + "원", warn: false },
                ].map((item) => (
                  <div key={item.label} style={{ border: "1px solid #E8F0FE", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: 11, color: "#4A5568", marginBottom: 6, fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: item.warn ? "#D97706" : "#1A1A2E" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* 다음에 확인할 것 */}
              <div style={{ border: "1px solid #E8F0FE", borderRadius: 14, padding: "18px 18px", marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>다음에 확인할 것</p>
                {NEXT_STEPS.map((s, i) => (
                  <div key={s.step} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < NEXT_STEPS.length - 1 ? "1px solid #F0F7FF" : "none" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#EFF6FF", color: "#1B6FC8", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 2 }}>{s.text}</p>
                      <p style={{ fontSize: 12, color: "#4A5568" }}>{s.sub}</p>
                    </div>
                    {s.href && (
                      <a href={s.href} style={{ marginLeft: "auto", fontSize: 12, color: "#1B6FC8", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", alignSelf: "center", flexShrink: 0 }}>
                        바로가기 →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* 면책 */}
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
                <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.7 }}>
                  ⚠️ 이 결과는 입력값을 기준으로 한 <strong>참고용 시뮬레이션</strong>입니다. 실제 재무 판단은 개인 상황에 따라 달라질 수 있으며, 정확한 내용은 금융 전문가 또는 관련 기관을 통해 확인하시기 바랍니다.
                </p>
              </div>

              {/* 버튼 */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleCopy}
                  style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 12, cursor: "pointer" }}>
                  📋 결과 복사하기
                </button>
                <button onClick={handlePrint}
                  style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#1B6FC8", background: "#EFF6FF", border: "2px solid #BFDBFE", borderRadius: 12, cursor: "pointer" }}>
                  🖨️ 인쇄하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 상시 면책 */}
        <div style={{ padding: "14px 18px", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A" }}>
          <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.65 }}>
            ⚠️ 이 계산기는 입력값을 기준으로 한 <strong>참고용 시뮬레이션</strong>입니다. 실제 재무 판단은 개인 상황에 따라 달라질 수 있습니다.
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .rc-input-grid{grid-template-columns:1fr!important;}
          .rc-result-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </section>
  );
}
