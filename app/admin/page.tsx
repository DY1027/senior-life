import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A2E", marginBottom: 6, letterSpacing: "-0.4px" }}>
        관리자 개요
      </h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>
        시니어 든든 운영 도구입니다.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        <Link
          href="/admin/backup"
          style={{
            display: "block",
            background: "#fff",
            border: "1px solid #EEECE6",
            borderRadius: 14,
            padding: "22px 20px",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 10 }}>💾</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>데이터 백업</p>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.55 }}>
            회원 등 주요 데이터를 파일로 내려받습니다.
          </p>
        </Link>
      </div>
    </div>
  );
}
