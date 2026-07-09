"use client";

// 시니어용 큰 선택 버튼(키오스크 메뉴 카드). 선택되면 파란 테두리 + 체크 표시.
export default function BigButton({
  emoji,
  label,
  sublabel,
  selected,
  onClick,
}: {
  emoji?: string;
  label: string;
  sublabel?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="kiosk-bigbtn"
      style={{
        position: "relative",
        width: "100%",
        minHeight: 108,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "18px 16px",
        background: selected ? "#EAF3FC" : "#fff",
        border: `3px solid ${selected ? "#1B6FC8" : "#D6E4F5"}`,
        borderRadius: 18,
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.12s, background 0.12s, transform 0.05s",
      }}
    >
      {selected && (
        <span
          aria-hidden="true"
          style={{ position: "absolute", top: 8, right: 10, color: "#1B6FC8", fontSize: 22, fontWeight: 900, lineHeight: 1 }}
        >
          ✓
        </span>
      )}
      {emoji && <span style={{ fontSize: 46, lineHeight: 1 }} aria-hidden="true">{emoji}</span>}
      <span style={{ fontSize: 25, fontWeight: 800, color: "#1A1A2E", lineHeight: 1.25 }}>{label}</span>
      {sublabel && <span style={{ fontSize: 18, fontWeight: 700, color: selected ? "#1B6FC8" : "#4A5568" }}>{sublabel}</span>}
    </button>
  );
}
