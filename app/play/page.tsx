import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "오늘의 놀이터",
  description: "생활기기 연습과 가벼운 놀이를 매일 부담 없이 즐겨보세요.",
  alternates: { canonical: "/play" },
};

// 오늘의 놀이터 허브 — 연습 사이의 쉼표.
// 두뇌 건강 '효과'는 내세우지 않는다 (하루 5분 가벼운 놀이로만 소개).
const plays = [
  {
    img: "/tiles/tile-brain.webp",
    alt: "할아버지가 든든이와 함께 퍼즐을 맞추는 그림",
    title: "카드 짝 맞추기",
    desc: "같은 그림 카드를 찾아 뒤집는 놀이예요. 난이도를 고를 수 있어요.",
    href: "/brain/matching",
    tag: "놀이",
  },
  {
    img: "/mascot-cheer.webp",
    alt: "앞발을 내밀며 다정하게 알려주는 든든이",
    title: "보이스피싱 문자 구별하기",
    desc: "가짜 문자와 진짜 문자를 구별하는 법을 그림과 쉬운 설명으로 확인해요.",
    href: "/stories/phishing",
    tag: "생활안전",
  },
  {
    img: "/tiles/tile-making.webp",
    alt: "할머니가 든든이와 함께 색종이로 만들기를 하는 그림",
    title: "사진 달력 만들기",
    desc: "가족 사진으로 세상에 하나뿐인 달력을 만들어 인쇄할 수 있어요.",
    href: "/making/calendar",
    tag: "만들기",
  },
];

export default function PlayHubPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF5E9", color: "#4F7245", fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 999, marginBottom: 14 }}>
            🎈 오늘의 놀이터
          </div>
          <h1 style={{ fontSize: "clamp(24px,5vw,34px)", fontWeight: 800, color: "#3B3226", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>
            하루 5분, 가볍게 즐겨요
          </h1>
          <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.7 }}>
            연습하다 쉬고 싶을 때, 부담 없이 즐기는 놀이입니다.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {plays.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "22px 20px",
                background: "#fff",
                border: "2.5px solid #DCE8CE",
                borderRadius: 20,
                textDecoration: "none",
              }}
            >
              <Image src={p.img} alt={p.alt} width={84} height={66} style={{ width: 84, height: "auto", borderRadius: 14, flexShrink: 0 }} />
              {/* CTA는 글 아래로 — 좁은 화면·글자 확대에서 글 칸이 꺾이지 않게 */}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "#4F7245", background: "#EFF5E9", padding: "3px 10px", borderRadius: 999, marginBottom: 6 }}>{p.tag}</span>
                <span style={{ display: "block", fontSize: 22, fontWeight: 800, color: "#3B3226", marginBottom: 4, wordBreak: "keep-all" }}>{p.title}</span>
                <span style={{ display: "block", fontSize: 15, color: "#6B7280", lineHeight: 1.5, wordBreak: "keep-all" }}>{p.desc}</span>
                <span style={{ display: "block", marginTop: 6, fontSize: 15, fontWeight: 800, color: "#C4621A" }}>놀러가기 →</span>
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
