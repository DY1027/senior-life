"use client";
const cards = [
  { icon: "🏛️", title: "복지 혜택", desc: "기초연금, 기초요양 등 다양한 복지 혜택을 확인하세요.", href: "/welfare", bg: "#ECFDF5" },
  { icon: "📜", title: "정부 지원 제도", desc: "정부에서 제공하는 지원 제도를 쉽게 알아보세요.", href: "/welfare", bg: "#F0FDFA" },
  { icon: "📱", title: "휴대폰 사용 도움", desc: "스마트폰 사용법을 쉽고 친절하게 알려드립니다.", href: "/life-tips", bg: "#EFF6FF" },
  { icon: "🛡️", title: "보이스피싱 예방", desc: "사기 유형과 예방법을 확인하고 안전을 지키세요.", href: "/life-tips", bg: "#FFF7ED" },
];

export default function LifeInfoSection() {
  return (
    <section style={{ background: "#fff", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0EA5E9", marginBottom: 8, letterSpacing: "0.06em" }}>LIFE INFO</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>생활 정보</h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 36 }}>일상에 꼭 필요한 정보를 한눈에 확인하세요.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {cards.map((c) => (
            <a key={c.title} href={c.href} style={{ background: c.bg, borderRadius: 18, padding: "24px 20px", textDecoration: "none", border: "1.5px solid transparent", display: "flex", flexDirection: "column", gap: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0EA5E9")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>{c.icon}</div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>{c.title}</p>
                <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.55 }}>{c.desc}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0EA5E9", marginTop: "auto" }}>바로가기 →</p>
            </a>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </section>
  );
}
