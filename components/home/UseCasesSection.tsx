const cases = [
  { icon: "🏥", title: "병원 방문 전 체크리스트 인쇄", desc: "부모님 병원 가기 전 체크리스트를 인쇄해 함께 준비할 수 있습니다. 의사에게 물어볼 질문도 미리 정리됩니다." },
  { icon: "💰", title: "노후자금 준비 상태 점검", desc: "노후자금 계산기로 현재 준비 상태를 간단히 점검할 수 있습니다. 목표까지 얼마나 남았는지 바로 확인됩니다." },
  { icon: "💊", title: "복용약 정리해서 병원 제출", desc: "복용 중인 약을 정리해 병원에 보여줄 수 있습니다. 여러 약을 동시에 먹는 어르신에게 특히 유용합니다. (준비 중)" },
  { icon: "🏛️", title: "복지혜택 확인 항목 안내", desc: "복지혜택은 확정 판정이 아니라 확인해야 할 항목을 정리해드립니다. 본인 상황에 맞는 기관에서 최종 확인이 필요합니다." },
];

export default function UseCasesSection() {
  return (
    <section style={{ background: "#fff", padding: "72px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>활용 예시</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 36 }}>
          이렇게 활용할 수 있어요
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {cases.map((c) => (
            <div key={c.title} style={{ padding: "24px 22px", background: "#F0F7FF", borderRadius: 18, border: "1.5px solid #DBEAFE" }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{c.icon}</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 }}>{c.title}</p>
              <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
