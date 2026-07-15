import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRACTICES, UPCOMING_PRACTICE, type Practice } from "@/lib/practices";

export const metadata: Metadata = {
  title: "생활기기 연습 — 카페·주차·무인기기 미리 눌러보기",
  description:
    "카페 주문, 햄버거 주문, 주차요금 정산, 무인민원발급기까지 생활 속 디지털 기기를 집에서 미리 눌러보며 연습하세요. 큰 글씨·큰 버튼·음성 안내로 어르신도 쉽게. 실제 결제는 되지 않는 연습용입니다.",
  alternates: { canonical: "/kiosk" },
};

// 카테고리 순서 — 자주 마주치는 것부터
const CATEGORY_ORDER: Practice["category"][] = ["먹고 마시기", "이동하기", "장보고 이용하기", "공공생활"];

function PracticeCard({ p }: { p: Practice }) {
  return (
    <Link
      href={p.href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 20px",
        background: "#fff",
        border: "2.5px solid #EFDFC0",
        borderRadius: 20,
        textDecoration: "none",
      }}
    >
      {p.img ? (
        <Image src={p.img} alt="" width={84} height={66} style={{ width: 84, height: "auto", borderRadius: 14, flexShrink: 0 }} />
      ) : (
        <span style={{ width: 84, height: 66, borderRadius: 14, flexShrink: 0, background: "#EAF1F8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }} aria-hidden="true">
          {p.emoji}
        </span>
      )}
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 22, fontWeight: 800, color: "#3B3226", marginBottom: 4, wordBreak: "keep-all" }}>{p.title}</span>
        <span style={{ display: "block", fontSize: 15, color: "#6B7280", lineHeight: 1.5, wordBreak: "keep-all" }}>{p.desc}</span>
      </span>
      <span style={{ fontSize: 15, fontWeight: 800, color: "#C4621A", whiteSpace: "nowrap" }}>연습하기 →</span>
    </Link>
  );
}

export default function KioskHubPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FDF0E0", color: "#C4621A", fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 999, marginBottom: 14 }}>
            🖐️ 실제 생활기기 연습
          </div>
          <h1 style={{ fontSize: "clamp(24px,5vw,34px)", fontWeight: 800, color: "#3B3226", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>
            무엇을 연습해 볼까요?
          </h1>
          <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.7 }}>
            눌러보고, 실수하고, 다시 해보세요.<br />
            실제 결제나 접수는 되지 않으니 <strong>마음 편하게</strong> 연습할 수 있어요.
          </p>
        </div>

        {CATEGORY_ORDER.map((cat) => {
          const items = PRACTICES.filter((p) => p.category === cat);
          const upcoming = UPCOMING_PRACTICE.category === cat ? UPCOMING_PRACTICE : null;
          if (items.length === 0 && !upcoming) return null;
          return (
            <section key={cat} style={{ marginBottom: 26 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#6E5C49", margin: "0 0 10px 4px" }}>{cat}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((p) => (
                  <PracticeCard key={p.id} p={p} />
                ))}
                {upcoming && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: "22px 20px",
                      background: "#F7F6F3",
                      border: "2px solid #EEECE6",
                      borderRadius: 20,
                      opacity: 0.8,
                    }}
                  >
                    <span style={{ width: 84, height: 66, borderRadius: 14, flexShrink: 0, background: "#EEECE6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }} aria-hidden="true">
                      {upcoming.emoji}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontSize: 22, fontWeight: 800, color: "#6B6860", marginBottom: 4, wordBreak: "keep-all" }}>{upcoming.title}</span>
                      <span style={{ display: "block", fontSize: 15, color: "#9B9890", lineHeight: 1.5, wordBreak: "keep-all" }}>다음에 열릴 연습이에요</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#9B9890", background: "#EEECE6", padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>준비 중</span>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <p style={{ marginTop: 8, fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.7 }}>
          모든 연습은 <strong>실제 결제가 되지 않는 연습용</strong>입니다. 편하게 여러 번 눌러 보세요.
        </p>
      </main>
      <Footer />
    </>
  );
}
