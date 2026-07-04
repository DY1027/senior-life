"use client";
import { useState } from "react";

const fmt = (n: number) => n.toLocaleString("ko-KR");

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 80 ? "#059669" : pct >= 50 ? "#1B6FC8" : "#F59E0B";
  return (
    <div style={{ height: 12, background: "#E8F0FE", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

export default function RetirementCalculatorPreview() {
  const [savings, setSavings] = useState(50000000);
  const [monthly, setMonthly] = useState(500000);
  const [living, setLiving] = useState(2000000);
  const [pension, setPension] = useState(600000);
  const [goal, setGoal] = useState(500000000);
  const [showResult, setShowResult] = useState(false);

  // 계산
  const monthlyNet = monthly + pension;
  const shortfall = Math.max(living - monthlyNet, 0);
  const shortfallYearly = shortfall * 12;
  const yearsNeeded = shortfall > 0 ? Math.ceil((goal - savings) / (monthly * 12)) : 0;
  const readiness = Math.min(Math.round((savings / goal) * 100), 100);
  const remaining = Math.max(goal - savings, 0);

  const conclusion =
    readiness >= 80
      ? "현재 노후자금 준비가 비교적 잘 되어 있습니다."
      : readiness >= 50
      ? `현재 속도라면 목표 노후자금까지 약 ${yearsNeeded}년이 필요합니다.`
      : `현재 준비율이 ${readiness}%입니다. 추가 저축 계획을 검토해볼 시점입니다.`;

  const handleCopy = () => {
    const text = `[노후자금 시뮬레이션 결과]\n현재 준비율: ${readiness}%\n목표금액: ${fmt(goal)}원\n현재 저축: ${fmt(savings)}원\n남은 금액: ${fmt(remaining)}원\n예상 준비 기간: 약 ${yearsNeeded}년\n\n※ 이 결과는 참고용 시뮬레이션입니다.`;
    navigator.clipboard.writeText(text).then(() => alert("복사되었습니다."));
  };

  const handlePrint = () => window.print();

  return (
    <section id="calculator" style={{ background: "#fff", padding: "72px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>노후자금 계산기</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>
          노후자금 준비 상태를 확인해보세요
        </h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 32, lineHeight: 1.65 }}>
          간단한 정보를 입력하면 현재 준비 상태와 다음에 확인할 것을 알려드립니다.<br />
          회원가입 없이 바로 사용할 수 있습니다.
        </p>

        <div style={{ background: "#F0F7FF", borderRadius: 20, padding: "28px 24px", marginBottom: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 20 }}>기본 정보 입력</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="calc-grid">
            {[
              { label: "현재 모아둔 돈 (원)", val: savings, set: setSavings, step: 1000000, placeholder: "예: 50,000,000" },
              { label: "매달 저축 가능한 금액 (원)", val: monthly, set: setMonthly, step: 100000, placeholder: "예: 500,000" },
              { label: "예상 월 생활비 (원)", val: living, set: setLiving, step: 100000, placeholder: "예: 2,000,000" },
              { label: "예상 연금 수령액 (월, 원)", val: pension, set: setPension, step: 100000, placeholder: "예: 600,000" },
              { label: "목표 노후자금 (원)", val: goal, set: setGoal, step: 10000000, placeholder: "예: 500,000,000" },
            ].map((f) => (
              <div key={f.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>{f.label}</label>
                <input
                  type="number"
                  value={f.val}
                  step={f.step}
                  placeholder={f.placeholder}
                  onChange={(e) => f.set(Number(e.target.value))}
                  style={{ width: "100%", fontSize: 17, fontWeight: 700, color: "#1A1A2E", border: "none", outline: "none", background: "transparent", boxSizing: "border-box" }}
                />
                <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{fmt(f.val)}원</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowResult(true)}
            style={{ width: "100%", height: 56, marginTop: 20, fontSize: 17, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 14, cursor: "pointer" }}>
            준비 상태 확인하기
          </button>
        </div>

        {/* 결과 */}
        {showResult && (
          <div style={{ background: "#1A1A2E", borderRadius: 20, padding: "32px 28px", marginBottom: 20 }} className="print-area">
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0EA5E9", marginBottom: 16 }}>노후자금 시뮬레이션 결과</p>

            {/* 한 줄 결론 */}
            <div style={{ background: "#0EA5E9", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.55 }}>{conclusion}</p>
            </div>

            {/* 준비 상태 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: 14, color: "#9CA3AF" }}>현재 준비율</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: readiness >= 80 ? "#34D399" : readiness >= 50 ? "#38BDF8" : "#FBBF24" }}>{readiness}%</p>
              </div>
              <ProgressBar value={savings} max={goal} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }} className="result-grid">
              {[
                { label: "목표까지 남은 금액", value: `${fmt(remaining)}원`, highlight: true },
                { label: "예상 준비 기간", value: yearsNeeded > 0 ? `약 ${yearsNeeded}년` : "목표 달성", highlight: false },
                { label: "월 생활비 대비 부족액", value: shortfall > 0 ? `${fmt(shortfall)}원` : "부족 없음", highlight: shortfall > 0 },
                { label: "연간 부족 예상액", value: shortfallYearly > 0 ? `${fmt(shortfallYearly)}원` : "-", highlight: false },
              ].map((item) => (
                <div key={item.label} style={{ background: "#2A2A3E", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: item.highlight ? "#FBBF24" : "#fff" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* 다음 행동 */}
            <div style={{ background: "#2A2A3E", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>📋 다음에 확인할 것</p>
              {["국민연금 예상 수령액 조회 (내 연금 앱)", "기초연금 대상 여부 확인 (복지로)", "월 고정지출 항목 점검", "의료비 예비자금 별도 준비"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid #3A3A4E" : "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0EA5E9", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: "#D1D5DB" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCopy} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 12, cursor: "pointer" }}>
                📋 복사하기
              </button>
              <button onClick={handlePrint} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#1A1A2E", background: "#fff", border: "none", borderRadius: 12, cursor: "pointer" }}>
                🖨️ 인쇄하기
              </button>
            </div>
          </div>
        )}

        {/* 면책 */}
        <div style={{ padding: "14px 18px", background: "#FFF8F0", borderRadius: 12, border: "1px solid #FED7AA" }}>
          <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.65 }}>
            ⚠️ 이 결과는 입력값을 기준으로 한 <strong>참고용 시뮬레이션</strong>입니다. 실제 재무 판단은 개인 상황에 따라 달라질 수 있으며, 정확한 내용은 관련 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .calc-grid{grid-template-columns:1fr!important;}
          .result-grid{grid-template-columns:1fr!important;}
        }
        @media print{
          body > *:not(.print-area){display:none!important;}
          .print-area{background:#fff!important;color:#000!important;box-shadow:none!important;}
        }
      `}</style>
    </section>
  );
}
