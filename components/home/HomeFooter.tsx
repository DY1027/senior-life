export default function HomeFooter() {
  return (
    <footer style={{ background: "#1A1A2E", color: "#fff", padding: "56px 24px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40, marginBottom: 48 }}>
          {/* 로고 + 회사 정보 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>시니어 든든</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>더 쉽고 든든한 시니어 생활</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
              (주)시니어든든 | 대표이사: 홍길동<br />
              서울특별시 강남구 테헤란로 123, 10층<br />
              사업자등록번호: 123-45-67890
            </p>
          </div>
          {/* 서비스 */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>서비스</p>
            {["노후자금 계산기","연금 정보","건강정보","병원도우미","생활정보","디지털도움"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          {/* 이용 안내 */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>이용 안내</p>
            {["이용 가이드","공지사항","자주 묻는 질문","이용약관","개인정보처리방침"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          {/* 고객센터 */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>고객센터</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#38BDF8", marginBottom: 4 }}>☎ 02-1234-5678</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>평일 09:00 ~ 18:00</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>(점심 12:00 ~ 13:00)</p>
            <a href="#" style={{ display: "inline-block", padding: "10px 20px", background: "#1B6FC8", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 20 }}>
              1:1 문의하기
            </a>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>연결하기</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["💬","카카오톡 채널"],["▶","유튜브"],["📝","블로그"]].map(([ic,lb]) => (
                <a key={lb} href="#" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)", padding: "6px 10px", borderRadius: 8, textDecoration: "none" }}>
                  <span>{ic}</span>{lb}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2025 시니어든든. All rights reserved.</p>
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="1.4fr"]{grid-template-columns:1fr 1fr!important;}}`}</style>
    </footer>
  );
}
