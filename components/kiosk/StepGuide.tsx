"use client";

// 화면 상단의 큰 질문 + 보조 설명 + "안내 듣기" 음성 버튼.
export default function StepGuide({
  title,
  guide,
  onListen,
}: {
  title: string;
  guide?: string;
  onListen: () => void;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 800, color: "#1A1A2E", lineHeight: 1.3, letterSpacing: "-0.5px" }}>
          {title}
        </h1>
        <button
          type="button"
          onClick={onListen}
          aria-label="안내 다시 듣기"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 44,
            padding: "0 16px",
            background: "#EAF3FC",
            color: "#1B6FC8",
            border: "2px solid #BBD9F5",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          🔊 안내 듣기
        </button>
      </div>
      {guide && (
        <p style={{ marginTop: 10, fontSize: 18, color: "#4A5568", lineHeight: 1.6 }}>{guide}</p>
      )}
    </div>
  );
}
