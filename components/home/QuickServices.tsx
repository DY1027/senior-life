"use client";
const services = [
  { icon: "💰", title: "노후자금 계산기", desc: "현재 자산과 월 생활비를 입력해 노후 준비 상태를 확인합니다.", href: "#calculator", badge: "바로 사용 가능", badgeColor: "#1B6FC8", bg: "#F0F7FF" },
  { icon: "🏥", title: "병원 방문 체크리스트", desc: "진료 전 챙길 것과 의사에게 물어볼 질문을 정리합니다.", href: "#checklist", badge: "바로 사용 가능", badgeColor: "#1B6FC8", bg: "#F0F7FF" },
  { icon: "🏛️", title: "내 혜택 찾아보기", desc: "나이·소득·거동 상태를 선택하면 받을 수 있는 복지혜택을 확인합니다.", href: "/welfare", badge: "바로 사용 가능", badgeColor: "#1B6FC8", bg: "#F0F7FF" },
  { icon: "💊", title: "복용약 요약표", desc: "복용 중인 약을 입력하면 병원·약국에 보여줄 요약표를 만들어드립니다.", href: "/health", badge: "바로 사용 가능", badgeColor: "#1B6FC8", bg: "#F0F7FF" },
  { icon: "👨‍👩‍👧", title: "부모님 생활 점검표", desc: "식사, 약, 병원, 안전 상태를 간단히 점검합니다.", href: "/life-tips/family-care", badge: "준비 중", badgeColor: "#9CA3AF", bg: "#F9FAFB" },
];

export default function QuickServices() {
  return (
    <section style={{ background: "#FAF8F5", padding: "64px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>생활도구</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>많이 쓰는 생활도구</h2>
        <p style={{ fontSize: 16, color: "#4A5568", marginBottom: 36, lineHeight: 1.6 }}>복잡한 정보를 읽기만 하는 것이 아니라, 직접 확인하고 바로 활용할 수 있습니다.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
          {services.map((s) => (
            <a key={s.title} href={s.href}
              style={{ display: "flex", flexDirection: "column", gap: 12, padding: "22px 20px", background: s.bg, borderRadius: 16, border: "1.5px solid #E8F0FE", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1B6FC8")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8F0FE")}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>{s.title}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.badgeColor, background: s.badgeColor === "#1B6FC8" ? "#E8F4FF" : "#F3F4F6", padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap" }}>{s.badge}</span>
                </div>
                <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.55 }}>{s.desc}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: s.badgeColor, marginTop: "auto" }}>
                {s.badgeColor === "#1B6FC8" ? "바로 사용하기 →" : "곧 제공 예정"}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
