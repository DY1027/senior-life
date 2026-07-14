"use client";

import Link from "next/link";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <section style={{ background: "#F7F6F3", padding: "72px 24px 88px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#E67E3F", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>ERROR</p>
          <h1 style={{ color: "#1A1A1A", fontSize: "clamp(30px, 7vw, 48px)", lineHeight: 1.18, fontWeight: 800, marginBottom: 18 }}>
            잠시 문제가 생겼습니다
          </h1>
          <p style={{ color: "#6B6860", fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해도 계속 보이면 홈에서 필요한 정보를 찾아주세요.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            <button
              onClick={() => unstable_retry()}
              style={{
                padding: "14px 22px",
                border: 0,
                borderRadius: 999,
                background: "#C4621A",
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              다시 시도
            </button>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 22px",
                border: "1px solid #EEECE6",
                borderRadius: 999,
                background: "#fff",
                color: "#1A1A1A",
                fontSize: 15,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
