export default function HomeFooter() {
  return (
    <footer style={{ background: "#1A1A2E", color: "#fff", padding: "56px 20px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="footer-grid">

          {/* 로고 + 소개 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white" opacity=".9"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>시니어 든든</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>더 쉽고 든든한 시니어 생활</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 20 }}>
              어르신과 가족이 노후자금, 건강, 병원 방문, 복지혜택을 쉽게 확인하고 활용할 수 있도록 돕는 생활정보 서비스입니다.
            </p>
            {/* 콘텐츠 출처 */}
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, fontWeight: 600 }}>콘텐츠 출처</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                보건복지부 · 국민건강보험공단 · 국민연금공단<br />복지로 · 중앙치매센터 공식 자료 기반
              </p>
            </div>
          </div>

          {/* 서비스 링크 */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>서비스</p>
            {[
              ["노후자금 계산기", "#calculator"],
              ["병원 방문 체크리스트", "#checklist"],
              ["복지혜택 정보", "/welfare"],
              ["건강정보", "/health"],
              ["생활정보", "/life-tips"],
              ["노후재정", "/finance"],
            ].map(([l, h]) => (
              <a key={l} href={h} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 10, textDecoration: "none" }}>{l}</a>
            ))}
          </div>

          {/* 이용 안내 + 문의 */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>이용 안내</p>
            {[["자주 묻는 질문","/#faq"],["개인정보처리방침","/legal/privacy"],["이용약관","/legal/terms"],["문의하기","mailto:eoduq07@naver.com"]].map(([l,h]) => (
              <a key={l} href={h} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 10, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>

        {/* 면책 */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
            ⚠️ 본 사이트의 정보는 일반적인 생활정보 제공을 목적으로 하며, 복지 수급 여부, 의료 판단, 금융 판단을 확정하지 않습니다. 정확한 내용은 관련 기관 또는 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2026 시니어 든든. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){.footer-grid{grid-template-columns:1fr!important;gap:32px!important;}}
      `}</style>
    </footer>
  );
}
