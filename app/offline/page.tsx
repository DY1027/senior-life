import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "인터넷 연결이 필요해요",
  robots: { index: false, follow: false },
};

// 오프라인 폴백 화면 — 아직 저장되지 않은 페이지를 인터넷 없이 열었을 때.
// (한 번 열어본 연습은 서비스워커가 저장해 두므로 이 화면 없이 바로 열린다)
export default function OfflinePage() {
  return (
    <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "#FDF7E7" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <p style={{ fontSize: 52, marginBottom: 12 }} aria-hidden="true">📴</p>
        <h1 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, color: "#3B3226", lineHeight: 1.35, marginBottom: 12 }}>
          지금은 인터넷이 연결되어 있지 않아요
        </h1>
        <p style={{ fontSize: 16, color: "#6E5C49", lineHeight: 1.8, marginBottom: 24 }}>
          괜찮아요 — <strong>한 번 열어봤던 연습</strong>은 인터넷 없이도 할 수 있어요.
          <br />
          이 화면이 보이는 건 아직 저장되지 않은 페이지를 열었기 때문이에요.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href="/kiosk"
            style={{ display: "inline-flex", minHeight: 56, alignItems: "center", justifyContent: "center", background: "#E67E3F", color: "#fff", borderRadius: 999, fontSize: 18, fontWeight: 800, textDecoration: "none" }}
          >
            연습 목록 열어 보기 →
          </Link>
          <Link
            href="/"
            style={{ display: "inline-flex", minHeight: 52, alignItems: "center", justifyContent: "center", background: "#fff", border: "2px solid #EFDFC0", color: "#6E5C49", borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none" }}
          >
            처음 화면으로
          </Link>
        </div>
        <p style={{ marginTop: 18, fontSize: 13, color: "#9B9890", lineHeight: 1.7 }}>
          연습 기록과 도장은 이 기기에 저장되어 있으니 사라지지 않아요.
        </p>
      </div>
    </main>
  );
}
