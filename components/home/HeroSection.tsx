export default function HeroSection() {
  return (
    <section style={{ background: "linear-gradient(160deg,#F0F7FF 0%,#fff 60%)", padding: "72px 24px 64px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        {/* 좌측 텍스트 */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F4FF", color: "#1B6FC8", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 100, marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            안전하고 신뢰할 수 있는 시니어 생활 서비스
          </div>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#1A1A2E", lineHeight: 1.25, letterSpacing: "-1px", marginBottom: 20 }}>
            시니어 생활을<br />더{" "}
            <span style={{ color: "#1B6FC8" }}>쉽고 든든하게</span>
          </h1>
          <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
            노후자금부터 건강, 병원 방문, 복약 기록, 생활정보까지<br />
            시니어의 일상을 편리하고 안전하게 도와드립니다.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={{ height: 52, padding: "0 28px", fontSize: 16, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              지금 시작하기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button style={{ height: 52, padding: "0 28px", fontSize: 16, fontWeight: 700, color: "#1B6FC8", background: "#fff", border: "2px solid #1B6FC8", borderRadius: 12, cursor: "pointer" }}>
              서비스 둘러보기
            </button>
          </div>
          {/* 신뢰 지표 */}
          <div style={{ display: "flex", gap: 28, marginTop: 40 }}>
            {[["5만+","가입 회원"],["4.9★","평균 만족도"],["24시","전문 상담"]].map(([v,l]) => (
              <div key={l}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#1B6FC8", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 12, color: "#4A5568", marginTop: 3 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 이미지 영역 */}
        <div style={{ position: "relative" }}>
          <div style={{ background: "linear-gradient(145deg,#E8F4FF,#C5E0FF)", borderRadius: 24, padding: "40px 32px", minHeight: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            {/* 시니어 일러스트 placeholder */}
            <div style={{ width: "100%", maxWidth: 280, aspectRatio: "4/3", background: "#BFD9F5", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1B6FC8" strokeWidth="1.2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="17" cy="8" r="3"/><path d="M21 21v-1a3 3 0 0 0-3-3h-2"/></svg>
              <p style={{ fontSize: 12, color: "#1B6FC8", fontWeight: 600 }}>시니어 부부 일러스트</p>
            </div>
            {/* 신뢰 배지 */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "12px 18px", boxShadow: "0 4px 16px rgba(27,111,200,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E8F4FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B6FC8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>내 정보는 안전하게</p>
                <p style={{ fontSize: 11, color: "#4A5568" }}>개인정보를 안전하게 보호합니다</p>
              </div>
            </div>
          </div>
          {/* 플로팅 카드 */}
          <div style={{ position: "absolute", top: 20, right: -16, background: "#fff", borderRadius: 12, padding: "10px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>
            🔔 복약 알림 설정 완료
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){section>div{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
