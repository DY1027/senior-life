"use client";
const services = [
  { icon: "💰", title: "노후자금 계산기", desc: "내 노후 자금을 쉽게 계산해 보세요", href: "/finance/living-cost", bg: "#EFF6FF", iconBg: "#DBEAFE" },
  { icon: "📋", title: "연금 정보", desc: "국민연금, 기초연금 등 연금 정보를 확인하세요", href: "/finance/national-pension", bg: "#F0FDF4", iconBg: "#DCFCE7" },
  { icon: "🏥", title: "병원 준비 체크", desc: "병원 방문 전 체크사항을 확인해 보세요", href: "/health/checkup", bg: "#FFF7ED", iconBg: "#FED7AA" },
  { icon: "💊", title: "복약 기록", desc: "복용 중인 약을 기록하고 알림을 받으세요", href: "/health", bg: "#FDF4FF", iconBg: "#F3E8FF" },
  { icon: "🏛️", title: "생활지원 정보", desc: "복지 혜택과 생활지원을 확인하세요", href: "/welfare", bg: "#F0FDFA", iconBg: "#CCFBF1" },
  { icon: "💬", title: "카카오 알림", desc: "중요한 정보를 카카오로 받아보세요", href: "#", bg: "#FEFCE8", iconBg: "#FEF08A" },
];

export default function QuickServices() {
  return (
    <section style={{ background: "#FAF8F5", padding: "64px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.06em" }}>QUICK MENU</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px" }}>자주 찾는 빠른 서비스</h2>
          </div>
          <p style={{ fontSize: 14, color: "#4A5568", marginBottom: 4 }}>필요한 서비스를 쉽게 이용해 보세요</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {services.map((s) => (
            <a key={s.title} href={s.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 22px", background: s.bg, borderRadius: 16, border: "1.5px solid transparent", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1B6FC8")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 3 }}>{s.title}</p>
                <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="repeat(3"]{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </section>
  );
}
