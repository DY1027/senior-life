import Link from "next/link";

const footerLinks = [
  {
    title: "복지혜택",
    links: [
      { label: "기초연금 신청방법", href: "/welfare/basic-pension" },
      { label: "장기요양보험 등급", href: "/welfare/long-term-care" },
    ],
  },
  {
    title: "건강·병원",
    links: [
      { label: "건강보험 본인부담금", href: "/health/insurance-copay" },
      { label: "노인 무료 건강검진", href: "/health/checkup" },
    ],
  },
  {
    title: "노후재정",
    links: [
      { label: "국민연금 수령액 조회", href: "/finance/national-pension" },
      { label: "노후 생활비 계산기", href: "/finance/living-cost" },
    ],
  },
  {
    title: "생활팁",
    links: [
      { label: "시니어 할인 카드", href: "/life-tips/senior-discount" },
      { label: "가족 돌봄 가이드", href: "/life-tips/family-care" },
    ],
  },
];

const sources = [
  { label: "복지로", href: "https://www.bokjiro.go.kr" },
  { label: "국민건강보험공단", href: "https://www.nhis.or.kr" },
  { label: "국민연금공단", href: "https://www.nps.or.kr" },
  { label: "보건복지부", href: "https://www.mohw.go.kr" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "0.5px solid #EEECE6", marginTop: 0 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E67E3F", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px" }}>
            시니어 든든
          </span>
        </div>

        {/* 링크 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, marginBottom: 32 }}>
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 10 }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ fontSize: 12, color: "#9B9890", textDecoration: "none" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: "0.5px solid #EEECE6", paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 11, color: "#9B9890" }}>
            © 2025 시니어 든든. 본 정보는 참고용이며 정확한 내용은 관련 기관에 문의하세요.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {sources.map((src) => (
              <a
                key={src.label}
                href={src.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, color: "#9B9890", textDecoration: "underline" }}
              >
                {src.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
