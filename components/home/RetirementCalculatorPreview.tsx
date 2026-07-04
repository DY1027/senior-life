"use client";
import { useState } from "react";

function CircleProgress({ pct }: { pct: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#E8F0FE" strokeWidth="12" />
      <circle cx="64" cy="64" r={r} fill="none" stroke="#1B6FC8" strokeWidth="12"
        strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={c / 4} strokeLinecap="round" />
      <text x="64" y="60" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1B6FC8">{pct}%</text>
      <text x="64" y="78" textAnchor="middle" fontSize="11" fill="#4A5568">준비 상태</text>
    </svg>
  );
}

export default function RetirementCalculatorPreview() {
  const [age, setAge] = useState(65);
  const [retire, setRetire] = useState(65);
  const [monthly, setMonthly] = useState(200);
  const [lifeExp, setLifeExp] = useState(90);

  const years = Math.max(lifeExp - retire, 0);
  const total = Math.round(monthly * 12 * years * 10000);
  const monthlyNeed = monthly * 10000;
  const prep = Math.min(Math.round((retire - age) * 3.2), 100);

  const fmt = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`;
    if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
    return `${n.toLocaleString()}원`;
  };

  return (
    <section style={{ background: "#fff", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 56, alignItems: "center" }}>
        {/* 좌측 설명 */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 10, letterSpacing: "0.06em" }}>핵심 서비스</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 16 }}>노후자금 계산기</h2>
          <p style={{ fontSize: 16, color: "#4A5568", lineHeight: 1.75, marginBottom: 28 }}>내 상황에 맞는 노후 자금을 쉽게 계산하고 준비하세요. 현재 나이와 목표 은퇴 나이만 입력하면 필요 자금을 바로 확인할 수 있습니다.</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {["맞춤형 노후 자금 계산","부족한 금액 및 준비 방법 안내","국민연금·퇴직연금 연동 예정"].map((t) => (
              <li key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#4A5568" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8F4FF", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1B6FC8" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
          <button style={{ height: 52, padding: "0 28px", fontSize: 16, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 12, cursor: "pointer" }}>
            계산해 보기 →
          </button>
        </div>

        {/* 우측 대시보드 */}
        <div style={{ background: "#F0F7FF", borderRadius: 20, padding: "28px 24px", boxShadow: "0 8px 32px rgba(27,111,200,0.10)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 16 }}>기본 정보 입력</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "현재 나이", val: age, set: setAge, unit: "세", min: 40, max: 80 },
              { label: "은퇴 나이", val: retire, set: setRetire, unit: "세", min: 50, max: 80 },
              { label: "월 생활비", val: monthly, set: setMonthly, unit: "만원", min: 50, max: 500 },
              { label: "기대 수명", val: lifeExp, set: setLifeExp, unit: "세", min: 70, max: 100 },
            ].map((f) => (
              <div key={f.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#4A5568", marginBottom: 6 }}>{f.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="number" value={f.val} min={f.min} max={f.max}
                    onChange={(e) => f.set(Number(e.target.value))}
                    style={{ width: "100%", fontSize: 18, fontWeight: 700, color: "#1A1A2E", border: "none", outline: "none", background: "transparent" }} />
                  <span style={{ fontSize: 13, color: "#4A5568", flexShrink: 0 }}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 결과 패널 */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 16 }}>계산 결과 요약</p>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center" }}>
              <CircleProgress pct={prep} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "#F0F7FF", borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 11, color: "#4A5568", marginBottom: 2 }}>필요 노후자금</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#1B6FC8" }}>{fmt(total)}</p>
                </div>
                <div style={{ background: "#F0F7FF", borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 11, color: "#4A5568", marginBottom: 2 }}>월 필요자금</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#1B6FC8" }}>{fmt(monthlyNeed)}</p>
                </div>
              </div>
            </div>
            {/* 파이 차트 더미 */}
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["식비","#1B6FC8","58%"],["의료비","#0EA5E9","20%"],["여가","#38BDF8","12%"],["기타","#BAE6FD","10%"]].map(([l,c,v])=>(
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#4A5568" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }}/>
                  {l} {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){section>div{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
