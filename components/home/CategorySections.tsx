const categories = [
  { icon: "🏛️", title: "복지혜택", desc: "기초연금, 장기요양보험, 돌봄서비스, 정부지원금을 쉽게 확인합니다.", href: "/welfare", color: "#1B6FC8", bg: "#EFF6FF", border: "#BFDBFE" },
  { icon: "🩺", title: "건강정보", desc: "건강보험, 검진, 병원 이용, 약 복용 정보를 정리합니다.", href: "/health", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  { icon: "💰", title: "노후자금", desc: "연금, 생활비, 저축, 배당, 은퇴 준비 정보를 확인합니다.", href: "/finance", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { icon: "🌿", title: "생활정보", desc: "시니어 할인, 스마트폰 도움, 보이스피싱 예방, 가족 돌봄 정보를 제공합니다.", href: "/life-tips", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

export default function CategorySections() {
  return (
    <section style={{ background: "#fff", padding: "72px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>주제별 정보</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>
          필요한 정보를 주제별로 확인하세요
        </h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 36 }}>각 주제를 선택하면 관련 정보를 자세히 안내해드립니다.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {categories.map((c) => (
            <a key={c.title} href={c.href}
              style={{ display: "flex", flexDirection: "column", gap: 14, padding: "24px 22px", background: c.bg, borderRadius: 18, border: `1.5px solid ${c.border}`, textDecoration: "none" }}>
              <div style={{ fontSize: 32 }}>{c.icon}</div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{c.title}</p>
                <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.65 }}>{c.desc}</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: c.color, marginTop: "auto" }}>자세히 보기 →</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
