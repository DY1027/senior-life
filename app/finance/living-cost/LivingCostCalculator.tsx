"use client";
import { useState } from "react";

export default function LivingCostCalculator() {
  const [type, setType] = useState<"couple" | "single">("couple");
  const [region, setRegion] = useState<"metro" | "city" | "rural">("city");
  const [lifestyle, setLifestyle] = useState<"basic" | "standard" | "rich">("standard");

  const base = type === "couple" ? 2770000 : 1770000;
  const regionMod = region === "metro" ? 1.2 : region === "city" ? 1.0 : 0.82;
  const lifeMod = lifestyle === "basic" ? 0.75 : lifestyle === "standard" ? 1.0 : 1.35;
  const monthly = Math.round((base * regionMod * lifeMod) / 10000) * 10000;
  const yearly = monthly * 12;
  const total20 = yearly * 20;

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div style={{ background: "#FAFAF8", border: "0.5px solid #EEECE6", borderRadius: 16, padding: "24px", marginBottom: 32 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#9B9890", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>노후 생활비 계산기</p>

      {/* 가구 유형 */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "#6B6860", marginBottom: 8, fontWeight: 500 }}>가구 유형</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["couple", "부부"], ["single", "1인"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setType(v)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${type === v ? "#1A1A1A" : "#EEECE6"}`, background: type === v ? "#1A1A1A" : "#fff", color: type === v ? "#fff" : "#6B6860", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* 거주 지역 */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "#6B6860", marginBottom: 8, fontWeight: 500 }}>거주 지역</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["metro", "수도권"], ["city", "중소도시"], ["rural", "농어촌"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setRegion(v)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${region === v ? "#1A1A1A" : "#EEECE6"}`, background: region === v ? "#1A1A1A" : "#fff", color: region === v ? "#fff" : "#6B6860", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* 생활 수준 */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "#6B6860", marginBottom: 8, fontWeight: 500 }}>생활 수준</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["basic", "절약형"], ["standard", "표준형"], ["rich", "여유형"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setLifestyle(v)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${lifestyle === v ? "#E67E3F" : "#EEECE6"}`, background: lifestyle === v ? "#FEF3E8" : "#fff", color: lifestyle === v ? "#C4621A" : "#6B6860", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div style={{ background: "#1A1A1A", borderRadius: 12, padding: "20px 22px" }}>
        <p style={{ fontSize: 11, color: "#9B9890", marginBottom: 12 }}>예상 노후 생활비</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>{fmt(monthly)}</span>
          <span style={{ fontSize: 14, color: "#9B9890" }}>원 / 월</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#2A2A2A", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#6B6860", marginBottom: 3 }}>연간</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#E67E3F" }}>{fmt(yearly)}원</p>
          </div>
          <div style={{ background: "#2A2A2A", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#6B6860", marginBottom: 3 }}>20년 합계</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#E67E3F" }}>{fmt(total20)}원</p>
          </div>
        </div>
        <p style={{ marginTop: 12, fontSize: 10, color: "#6B6860" }}>* 국민연금공단 적정 생활비 기준. 의료비·물가상승률 미반영</p>
      </div>
    </div>
  );
}
