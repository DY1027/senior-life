import { ImageResponse } from "next/og";

export const alt = "시니어 든든 — 실제처럼 눌러보는 디지털 생활 놀이터";
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
          실제처럼 눌러보는
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: -1.5, display: "flex", marginBottom: 28 }}>
          디지털 생활 놀이터
        </div>
        <div style={{ fontSize: 26, color: "#6B6860", display: "flex" }}>
          카페 주문 · 햄버거 주문 · 주차요금 정산 · 서류 발급
        </div>
      </div>
    ),
    { ...size }
  );
}
