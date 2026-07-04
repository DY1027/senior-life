"use client";
const cards = [
  { icon: "🏥", title: "병원 방문 준비", desc: "진료 전 체크리스트와 준비물을 확인해 보세요.", href: "/health/checkup", bg: "#EFF6FF" },
  { icon: "📝", title: "증상 메모", desc: "증상을 기록하고 의사에게 보여주세요.", href: "/health", bg: "#F0FDF4" },
  { icon: "💊", title: "복약 관리", desc: "복용 중인 약을 관리하고 복용 알림을 받아보세요.", href: "/health", bg: "#FFF7ED" },
  { icon: "📅", title: "검진 일정", desc: "검진 일정을 관리하고 알림을 받아보세요.", href: "/health/checkup", bg: "#FDF4FF" },
];

export default function HealthHospitalSection() {
  return (
    <section style={{ background: "#F0F7FF", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 8, letterSpacing: "0.06em" }}>HEALTH & HOSPITAL</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>건강과 병원 정보</h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 36 }}>건강을 지키고 병원 방문을 더 편리하게 준비하세요.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {cards.map((c) => (
            <a key={c.title} href={c.href} style={{ background: "#fff", borderRadius: 18, padding: "24px 20px", textDecoration: "none", border: "1.5px solid #E8F0FE", display: "flex", flexDirection: "column", gap: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1B6FC8")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8F0FE")}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.icon}</div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>{c.title}</p>
                <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.55 }}>{c.desc}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginTop: "auto" }}>바로가기 →</p>
            </a>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </section>
  );
}
