"use client";
import { useState } from "react";

type Status = { kind: "idle" | "loading" | "done" | "error"; message?: string };

export default function BackupPage() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function download(format: "json" | "csv") {
    setStatus({ kind: "loading" });
    try {
      const res = await fetch(`/api/admin/backup?format=${format}`, { cache: "no-store" });
      if (!res.ok) {
        let msg = `백업에 실패했습니다 (${res.status})`;
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          /* 응답이 JSON이 아닐 수 있음 */
        }
        setStatus({ kind: "error", message: msg });
        return;
      }
      // Content-Disposition의 파일명을 사용하고, 없으면 기본값 생성
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const today = new Date().toISOString().slice(0, 10);
      const filename =
        match?.[1] ??
        (format === "csv"
          ? `senior-life-members-${today}.csv`
          : `senior-life-backup-${today}.json`);

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setStatus({ kind: "done", message: `${filename} 다운로드를 시작했습니다.` });
    } catch {
      setStatus({ kind: "error", message: "네트워크 오류로 백업에 실패했습니다." });
    }
  }

  const busy = status.kind === "loading";

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A2E", marginBottom: 6, letterSpacing: "-0.4px" }}>
        데이터 백업
      </h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 1.65 }}>
        회원 등 주요 데이터를 파일로 내려받습니다. 아래 버튼을 누르면 브라우저로 바로 다운로드됩니다.
      </p>

      {/* 민감정보 제외 안내 */}
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #A7F3D0",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 24,
          fontSize: 13,
          color: "#065F46",
          lineHeight: 1.7,
        }}
      >
        🔒 비밀번호·API 키·토큰·결제 비밀값·카드번호 등 <strong>민감정보는 백업 파일에서 자동으로 제외</strong>됩니다.
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EEECE6",
          borderRadius: 14,
          padding: "24px 20px",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => download("json")}
            disabled={busy}
            style={{
              height: 52,
              padding: "0 24px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background: "#1B6FC8",
              border: "none",
              borderRadius: 12,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "백업 중…" : "백업 (JSON)"}
          </button>
          <button
            onClick={() => download("csv")}
            disabled={busy}
            style={{
              height: 52,
              padding: "0 24px",
              fontSize: 15,
              fontWeight: 700,
              color: "#1B6FC8",
              background: "#EAF3FC",
              border: "1.5px solid #BBD9F5",
              borderRadius: 12,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            회원 목록 (CSV)
          </button>
        </div>

        {status.kind === "done" && (
          <p style={{ marginTop: 16, fontSize: 13, color: "#059669", fontWeight: 600 }}>
            ✅ {status.message}
          </p>
        )}
        {status.kind === "error" && (
          <p style={{ marginTop: 16, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>
            ⚠️ {status.message}
          </p>
        )}

        <p style={{ marginTop: 18, fontSize: 12, color: "#9CA3AF", lineHeight: 1.7 }}>
          · JSON: 전체 데이터를 구조 그대로 담습니다(복원·이전용).
          <br />· CSV: 회원 목록을 표 형태로 담습니다(엑셀에서 열기 좋음).
        </p>
      </div>
    </div>
  );
}
