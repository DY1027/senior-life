import { ImageResponse } from "next/og";

export const alt = "시니어 든든 — 노후자금 계산, 병원 준비, 복지혜택을 한 번에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#FAFAF8",
          padding: "80px 90px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#E67E3F", display: "flex" }} />
          <div style={{ fontSize: 34, fontWeight: 700, color: "#1A1A1A" }}>시니어 든든</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: -1.5, display: "flex" }}>
          노후자금 계산, 병원 준비,
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: -1.5, display: "flex", marginBottom: 28 }}>
          복지혜택을 한 번에
        </div>
        <div style={{ fontSize: 26, color: "#6B6860", display: "flex" }}>
          기초연금 · 장기요양 · 국민연금 · 건강보험 · 노후재정
        </div>
      </div>
    ),
    { ...size }
  );
}
