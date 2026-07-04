const steps = [
  { num: 1, icon: "👤", title: "회원가입", desc: "간단한 정보로\n회원가입을 합니다." },
  { num: 2, icon: "⚙️", title: "내 정보 설정", desc: "내 상황에 맞게\n정보를 설정합니다." },
  { num: 3, icon: "🔍", title: "서비스 이용", desc: "필요한 서비스를\n이용해 보세요." },
  { num: 4, icon: "🔔", title: "알림 받기", desc: "중요한 정보를\n알림으로 받아보세요." },
];

export default function GuideSteps() {
  return (
    <section style={{ background: "#FAF8F5", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 8, letterSpacing: "0.06em" }}>HOW TO START</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>처음 이용하는 분을 위한 안내</h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 44 }}>쉽고 간단한 4단계로 이용을 시작해 보세요.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative" }}>
          {/* 연결선 */}
          <div style={{ position: "absolute", top: 40, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg,#1B6FC8,#0EA5E9)", zIndex: 0 }} className="guide-line" />
          {steps.map((s) => (
            <div key={s.num} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, position: "relative", zIndex: 1, padding: "0 12px" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fff", border: "3px solid #1B6FC8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(27,111,200,0.15)" }}>
                <span style={{ fontSize: 26 }}>{s.icon}</span>
              </div>
              <div style={{ background: "#1B6FC8", color: "#fff", width: 24, height: 24, borderRadius: "50%", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -8 }}>{s.num}</div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.6, whiteSpace: "pre-line" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <button style={{ height: 52, padding: "0 36px", fontSize: 16, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 12, cursor: "pointer" }}>
            지금 시작하기 →
          </button>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important;gap:24px!important;}
          .guide-line{display:none!important;}
        }
      `}</style>
    </section>
  );
}
