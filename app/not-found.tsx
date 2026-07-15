import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청하신 시니어 든든 페이지를 찾을 수 없습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

const quickLinks = [
  { label: "생활기기 연습", href: "/kiosk" },
  { label: "오늘의 놀이터", href: "/play" },
  { label: "생활안전", href: "/stories" },
  { label: "이용안내", href: "/guide" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <section style={{ background: "#F7F6F3", padding: "72px 24px 88px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#E67E3F", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>404</p>
          <h1 style={{ color: "#1A1A1A", fontSize: "clamp(32px, 7vw, 52px)", lineHeight: 1.18, fontWeight: 800, marginBottom: 18 }}>
            찾으시는 페이지가 없습니다
          </h1>
          <p style={{ color: "#6B6860", fontSize: 17, lineHeight: 1.75, marginBottom: 32 }}>
            주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래 바로가기에서 다시 찾아보세요.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 34 }}>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  minWidth: 132,
                  padding: "12px 16px",
                  border: "1px solid #EEECE6",
                  borderRadius: 999,
                  background: "#fff",
                  color: "#1A1A1A",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 22px",
              borderRadius: 999,
              background: "#C4621A",
              color: "#fff",
              fontSize: 15,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
