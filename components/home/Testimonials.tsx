const reviews = [
  { name: "김영자 님", age: "67세", stars: 5, text: "노후자금 계산기를 사용하니 준비 상태가 한눈에 보여서 마음이 한결 든든해졌어요. 덕분에 부족한 부분을 미리 파악하고 준비할 수 있었습니다.", avatar: "👩‍🦳" },
  { name: "이정호 님", age: "72세", stars: 5, text: "복약 알림 서비스 덕분에 약을 잊지 않고 챙겨 먹을 수 있게 됐습니다. 병원 방문 체크리스트도 정말 유용해요.", avatar: "👨‍🦳" },
  { name: "박순자 님", age: "69세", stars: 5, text: "병원 방문 준비 체크리스트가 정말 많은 도움이 됩니다. 의사 선생님께 증상을 정확하게 설명할 수 있어서 진료가 훨씬 수월해졌어요.", avatar: "👵" },
];

export default function Testimonials() {
  return (
    <section style={{ background: "#fff", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 8, letterSpacing: "0.06em" }}>REVIEWS</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 36 }}>이용자 후기</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {reviews.map((r) => (
            <div key={r.name} style={{ background: "#F0F7FF", borderRadius: 20, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {"★★★★★".split("").map((s, i) => <span key={i} style={{ fontSize: 18, color: "#F59E0B" }}>{s}</span>)}
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B", marginLeft: 6 }}>{r.stars}.0</span>
              </div>
              <p style={{ fontSize: 14, color: "#1A1A2E", lineHeight: 1.75, flex: 1 }}>"{r.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{r.avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{r.name}</p>
                  <p style={{ fontSize: 12, color: "#4A5568" }}>{r.age}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="repeat(3"]{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
