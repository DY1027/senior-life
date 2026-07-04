export default function CTASection() {
  return (
    <section style={{ background: "linear-gradient(135deg,#1B6FC8 0%,#0EA5E9 100%)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>시니어 든든과 함께라면</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.3 }}>
            지금 바로 시작하고,<br />더 든든한 내일을 준비하세요!
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginTop: 10 }}>시니어 든든이 여러분의 편안한 삶을 함께 하겠습니다.</p>
        </div>
        <button style={{ height: 56, padding: "0 36px", fontSize: 16, fontWeight: 700, color: "#1B6FC8", background: "#fff", border: "none", borderRadius: 14, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          지금 시작하기 →
        </button>
      </div>
    </section>
  );
}
