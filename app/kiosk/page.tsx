import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "키오스크 연습 — 카페·병원·무인기기 미리 연습하기",
  description:
    "카페, 병원 접수, 패스트푸드, 무인민원발급기 키오스크를 집에서 미리 눌러보며 연습하세요. 큰 글씨·큰 버튼·음성 안내로 어르신도 쉽게. 실제 결제는 되지 않는 연습용입니다.",
  alternates: { canonical: "/kiosk" },
};

const practices = [
  { id: "cafe", img: "/tiles/kiosk-cafe.webp", title: "카페 키오스크", desc: "매장·포장, 메뉴, 온도, 잔 수, 계산까지", href: "/kiosk/cafe", ready: true },
  { id: "hospital", img: "/tiles/kiosk-hospital.webp", title: "병원 접수 키오스크", desc: "접수, 진료과 선택, 번호표 발급", href: "/kiosk/hospital", ready: true },
  { id: "fastfood", img: "/tiles/kiosk-fastfood.webp", title: "패스트푸드 주문", desc: "세트 메뉴, 음료 변경, 결제", href: "/kiosk/fastfood", ready: true },
  { id: "civil", img: "/tiles/kiosk-civil.webp", title: "무인민원발급기", desc: "등본·가족관계증명서 발급", href: "/kiosk/civil", ready: true },
];

export default function KioskHubPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EAF3FC", color: "#1B6FC8", fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 999, marginBottom: 14 }}>
            🖐️ 눌러보며 배우는 연습 도구
          </div>
          <h1 style={{ fontSize: "clamp(24px,5vw,34px)", fontWeight: 800, color: "#1A1A2E", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>
            무엇을 연습해 볼까요?
          </h1>
          <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.7 }}>
            카페, 병원, 무인기기를 <strong>집에서 미리</strong> 눌러보며 연습해요.<br />
            큰 글씨·큰 버튼·음성 안내로 천천히 따라 하면 됩니다.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {practices.map((p) =>
            p.ready ? (
              <Link
                key={p.id}
                href={p.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "22px 20px",
                  background: "#fff",
                  border: "2.5px solid #BBD9F5",
                  borderRadius: 20,
                  textDecoration: "none",
                }}
              >
                <Image src={p.img} alt="" width={84} height={66} style={{ width: 84, height: "auto", borderRadius: 14, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 4, wordBreak: "keep-all" }}>{p.title}</span>
                  <span style={{ display: "block", fontSize: 15, color: "#6B7280", lineHeight: 1.5, wordBreak: "keep-all" }}>{p.desc}</span>
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1B6FC8", whiteSpace: "nowrap" }}>연습하기 →</span>
              </Link>
            ) : (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "22px 20px",
                  background: "#F7F6F3",
                  border: "2px solid #EEECE6",
                  borderRadius: 20,
                  opacity: 0.75,
                }}
              >
                <Image src={p.img} alt="" width={84} height={66} style={{ width: 84, height: "auto", borderRadius: 14, flexShrink: 0, filter: "grayscale(0.3)", opacity: 0.8 }} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 22, fontWeight: 800, color: "#6B6860", marginBottom: 4, wordBreak: "keep-all" }}>{p.title}</span>
                  <span style={{ display: "block", fontSize: 15, color: "#9B9890", lineHeight: 1.5, wordBreak: "keep-all" }}>{p.desc}</span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#9B9890", background: "#EEECE6", padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>준비 중</span>
              </div>
            )
          )}
        </div>

        <p style={{ marginTop: 26, fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.7 }}>
          모든 연습은 <strong>실제 결제가 되지 않는 연습용</strong>입니다. 편하게 여러 번 눌러 보세요.
        </p>
      </main>
      <Footer />
    </>
  );
}
