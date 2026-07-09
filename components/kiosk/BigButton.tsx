"use client";

// 시니어용 큰 선택 버튼. 아이콘·글자·부가설명을 크게 보여준다.
export default function BigButton({
  emoji,
  label,
  sublabel,
  onClick,
}: {
  emoji?: string;
  label: string;
  sublabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="kiosk-bigbtn"
      style={{
        width: "100%",
        minHeight: 108,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "18px 16px",
        background: "#fff",
        border: "3px solid #BBD9F5",
        borderRadius: 20,
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.12s, background 0.12s, transform 0.05s",
      }}
    >
      {emoji && <span style={{ fontSize: 46, lineHeight: 1 }} aria-hidden="true">{emoji}</span>}
      <span style={{ fontSize: 26, fontWeight: 800, color: "#1A1A2E", lineHeight: 1.25 }}>{label}</span>
      {sublabel && <span style={{ fontSize: 18, fontWeight: 600, color: "#4A5568" }}>{sublabel}</span>}
    </button>
  );
}
