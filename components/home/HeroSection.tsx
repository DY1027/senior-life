export default function HeroSection() {
  return (
    <section style={{ background: "linear-gradient(160deg,#F0F7FF 0%,#fff 65%)", padding: "60px 20px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="hero-grid">
        {/* 좌측 */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F4FF", color: "#1B6FC8", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 100, marginBottom: 24 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            회원가입 없이 바로 사용할 수 있습니다
          </div>

          <h1 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: "#1A1A2E", lineHeight: 1.3, letterSpacing: "-0.8px", marginBottom: 20 }}>
            시니어 생활을<br />
            <span style={{ color: "#1B6FC8" }}>확인하고 계산하고</span><br />
            기록하세요
          </h1>

          <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "#4A5568", lineHeight: 1.75, marginBottom: 32 }}>
            기초연금, 병원 준비, 약 복용, 노후자금까지<br />
            어르신과 가족이 바로 활용할 수 있게 정리했습니다.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#calculator" style={{ height: 56, padding: "0 28px", fontSize: 16, fontWeight: 700, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>
              노후자금 계산하기
            </a>
            <a href="#checklist" style={{ height: 56, padding: "0 28px", fontSize: 16, fontWeight: 700, color: "#1B6FC8", background: "#fff", border: "2px solid #1B6FC8", borderRadius: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              병원 준비 체크하기
            </a>
          </div>

          {/* 모바일 전용 신뢰 배지 */}
          <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }} className="hero-badges-mobile">
            <span style={{ background: "#E8F4FF", color: "#1B6FC8", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 99 }}>✓ 회원가입 없이 바로 사용</span>
            <span style={{ background: "#F0FDF4", color: "#059669", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 99 }}>✓ 참고용 계산 · 쉬운 체크리스트</span>
          </div>
        </div>

        {/* 우측 — 서비스 미리보기 카드 (데스크탑/태블릿만 표시) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="hero-right">
          {/* 노후자금 카드 미리보기 */}
          <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 4px 20px rgba(27,111,200,0.10)", border: "1px solid #E8F0FE" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1B6FC8" }}>💰 노후자금 준비 상태</p>
              <span style={{ fontSize: 11, color: "#4A5568", background: "#F0F7FF", padding: "3px 8px", borderRadius: 6 }}>참고용 시뮬레이션</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#1A1A2E" }}>58%</span>
              <span style={{ fontSize: 14, color: "#4A5568" }}>준비됨</span>
            </div>
            <div style={{ height: 8, background: "#E8F0FE", borderRadius: 99 }}>
              <div style={{ height: "100%", width: "58%", background: "linear-gradient(90deg,#1B6FC8,#0EA5E9)", borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 12, color: "#4A5568", marginTop: 8 }}>목표까지 약 <strong>1억 2,000만원</strong> 더 필요합니다</p>
          </div>

          {/* 병원 체크리스트 미리보기 */}
          <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 4px 20px rgba(27,111,200,0.10)", border: "1px solid #E8F0FE" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0EA5E9", marginBottom: 12 }}>🏥 병원 방문 체크리스트</p>
            {["신분증", "복용 중인 약 목록", "최근 검사 결과지", "증상 메모"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 3 ? "1px solid #F0F7FF" : "none" }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid #1B6FC8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i < 2 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1B6FC8" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontSize: 13, color: i < 2 ? "#4A5568" : "#1A1A2E", textDecoration: i < 2 ? "line-through" : "none" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* 배지 */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#E8F4FF", color: "#1B6FC8", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 99 }}>✓ 회원가입 없이 바로 사용</span>
            <span style={{ background: "#F0FDF4", color: "#059669", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 99 }}>✓ 참고용 계산 · 쉬운 체크리스트</span>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;gap:0!important;}
          .hero-right{display:none!important;}
          .hero-badges-mobile{display:flex!important;}
        }
        @media(min-width:769px){
          .hero-badges-mobile{display:none!important;}
        }
      `}</style>
    </section>
  );
}
