"use client";
import { useState } from "react";
import Link from "next/link";
import { trackKiosk } from "@/lib/kiosk/track";

type Summary = { key: string; value: string };

// 시니어 응원 문구 (완료 시 하나를 보여준다).
const PRAISES = [
  "천천히 잘 따라오셨어요. 실제 카페에서도 이대로 하시면 돼요.",
  "한 번 해보셨으니 다음엔 훨씬 쉬워요. 여러 번 연습하면 익숙해져요.",
  "실수해도 괜찮아요. 이렇게 미리 연습해두면 당황하지 않아요.",
];

export default function ResultCard({
  place,
  successTitle,
  summaries,
  scenarioId,
  onRestart,
}: {
  place: string;
  successTitle: string;
  summaries: Summary[];
  scenarioId: string;
  onRestart: () => void;
}) {
  // 마운트 시 1회만 응원 문구를 뽑는다(렌더마다 바뀌지 않도록).
  const [praise] = useState(() => PRAISES[Math.floor(Math.random() * PRAISES.length)]);

  async function handleShare() {
    trackKiosk("kiosk_share", { scenario: scenarioId });
    const lines = summaries.map((s) => `· ${s.key}: ${s.value}`).join("\n");
    const text =
      `[시니어 든든] ${place} 키오스크 연습을 마쳤어요! 👏\n\n` +
      `${lines}\n\n` +
      `함께 연습해보세요 → https://seniordeundun.com/kiosk`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "키오스크 연습 완료", text });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("연습 결과를 복사했어요. 자녀나 가족에게 붙여넣어 보내보세요.");
      }
    } catch {
      /* 공유 취소 등은 무시 */
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 12 }} aria-hidden="true">🎉</div>
      <h1 style={{ fontSize: "clamp(24px,5vw,32px)", fontWeight: 800, color: "#1A1A2E", lineHeight: 1.35, marginBottom: 10 }}>
        {successTitle}
      </h1>
      <p style={{ fontSize: 18, color: "#4A5568", lineHeight: 1.7, marginBottom: 24 }}>{praise}</p>

      {/* 주문 요약 */}
      <div
        style={{
          textAlign: "left",
          background: "#F0F7FF",
          border: "2px solid #BBD9F5",
          borderRadius: 18,
          padding: "20px 22px",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1B6FC8", marginBottom: 12 }}>
          내가 연습한 {place} 주문
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {summaries.map((s) => (
            <div key={s.key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 19 }}>
              <span style={{ color: "#6B7280", fontWeight: 600 }}>{s.key}</span>
              <span style={{ color: "#1A1A2E", fontWeight: 800 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          type="button"
          onClick={onRestart}
          style={{ height: 62, fontSize: 20, fontWeight: 800, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 16, cursor: "pointer" }}
        >
          🔁 처음부터 다시 연습하기
        </button>
        <button
          type="button"
          onClick={handleShare}
          style={{ height: 58, fontSize: 18, fontWeight: 700, color: "#1B6FC8", background: "#EAF3FC", border: "2px solid #BBD9F5", borderRadius: 16, cursor: "pointer" }}
        >
          📤 가족에게 자랑하기 / 공유하기
        </button>
        <Link
          href="/kiosk"
          style={{ height: 54, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#6B7280", background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 16, textDecoration: "none" }}
        >
          다른 연습 고르기
        </Link>
      </div>
    </div>
  );
}
