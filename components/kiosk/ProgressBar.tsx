"use client";

// "지금 몇 번째 / 전체 몇 단계"를 크게 보여주는 진행 표시.
export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1B6FC8" }}>
          {current}번째 / 전체 {total}단계
        </span>
      </div>
      <div style={{ height: 12, background: "#E8F0FE", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg,#1B6FC8,#0EA5E9)",
            borderRadius: 999,
            transition: "width 0.25s ease",
          }}
        />
      </div>
    </div>
  );
}
