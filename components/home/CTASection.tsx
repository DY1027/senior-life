export default function CTASection() {
  return (
    <section style={{ background: "linear-gradient(135deg,#1B6FC8 0%,#0EA5E9 100%)", padding: "64px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.35, marginBottom: 14 }}>
          오늘 필요한 정보를 확인하고,<br />바로 활용해보세요
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginBottom: 36, lineHeight: 1.7 }}>
          노후자금 계산부터 병원 준비까지,<br />회원가입 없이 먼저 사용해볼 수 있습니다.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#calculator" style={{ height: 56, padding: "0 32px", fontSize: 16, fontWeight: 700, color: "#1B6FC8", background: "#fff", borderRadius: 14, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            💰 노후자금 계산하기
          </a>
          <a href="#checklist" style={{ height: 56, padding: "0 32px", fontSize: 16, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 14, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            🏥 병원 준비 체크하기
          </a>
        </div>
      </div>
    </section>
  );
}
