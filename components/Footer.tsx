import Link from "next/link";

// 푸터는 최소한으로 — 연습 사이트라는 정체성과 법적 고지만 남긴다.
const legalLinks = [
  { label: "이용약관", href: "/legal/terms" },
  { label: "개인정보처리방침", href: "/legal/privacy" },
  { label: "광고·제휴 안내", href: "/guide#ads" },
  { label: "콘텐츠 이용안내", href: "/guide" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "0.5px solid #EEECE6", marginTop: 0 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 40px" }}>
        {/* 로고 + 한 줄 정의 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E67E3F", display: "inline-block" }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.3px" }}>
            시니어 든든
          </span>
        </div>
        <p style={{ fontSize: 15, color: "#6B6860", marginBottom: 20 }}>
          실제처럼 눌러보는 시니어 디지털 놀이터
        </p>

        {/* 약관/정책 링크 */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          {legalLinks.map((l) => (
            <Link key={l.label} href={l.href} style={{ fontSize: 14, color: "#6B6860", textDecoration: "none", fontWeight: l.label === "개인정보처리방침" ? 700 : 600 }}>
              {l.label}
            </Link>
          ))}
          <a href="mailto:eoduq07@naver.com" style={{ fontSize: 14, color: "#6B6860", textDecoration: "none", fontWeight: 600 }}>문의하기</a>
        </div>

        <div style={{ borderTop: "0.5px solid #EEECE6", paddingTop: 16 }}>
          <p style={{ fontSize: 14, color: "#6B6860", lineHeight: 1.7 }}>
            모든 연습은 모의 화면이며 실제 주문·결제·발급·송금이 이루어지지 않습니다.
            <br />
            실제 기기의 화면과 절차는 장소와 기기에 따라 달라질 수 있습니다.
          </p>
          <p style={{ fontSize: 13, color: "#8A8578", marginTop: 10 }}>© 2026 시니어든든.</p>
        </div>
      </div>
      {/* 모바일 하단 메뉴에 가리지 않도록 여백 */}
      <div className="h-16 md:hidden" />
    </footer>
  );
}
