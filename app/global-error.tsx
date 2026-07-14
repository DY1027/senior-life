"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="ko">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F7F6F3", padding: 24 }}>
          <section style={{ maxWidth: 680, textAlign: "center" }}>
            <title>문제가 발생했습니다 | 시니어 든든</title>
            <p style={{ color: "#E67E3F", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>ERROR</p>
            <h1 style={{ color: "#1A1A1A", fontSize: "clamp(30px, 7vw, 48px)", lineHeight: 1.18, fontWeight: 800, marginBottom: 18 }}>
              페이지를 표시하지 못했습니다
            </h1>
            <p style={{ color: "#6B6860", fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
              일시적인 오류일 수 있습니다. 다시 시도하거나 홈으로 이동해 주세요.
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
          </section>
        </main>
      </body>
    </html>
  );
}
