"use client";
import { useState } from "react";
import Link from "next/link";
import { trackKiosk } from "@/lib/kiosk/track";

type Summary = { key: string; value: string };

const PRAISES = [
  "천천히 잘 따라오셨어요. 실제 카페에서도 이대로 하시면 돼요.",
  "한 번 해보셨으니 다음엔 훨씬 쉬워요. 여러 번 연습하면 익숙해져요.",
  "실수해도 괜찮아요. 이렇게 미리 연습해두면 당황하지 않아요.",
];

export default function ResultCard({
  brand,
  place,
  successTitle,
  summaries,
  total,
  orderNo,
  finishedAt,
  scenarioId,
  onRestart,
}: {
  brand: string;
  place: string;
  successTitle: string;
  summaries: Summary[];
  total: number;
  orderNo: number;
  finishedAt: string;
  scenarioId: string;
  onRestart: () => void;
}) {
  const [praise] = useState(() => PRAISES[Math.floor(Math.random() * PRAISES.length)]);

  const payMethod = summaries.find((s) => s.key === "계산 방법")?.value ?? "";
  const items = summaries.filter((s) => s.key !== "계산 방법");

  async function handleShare() {
    trackKiosk("kiosk_share", { scenario: scenarioId });
    const text =
      `[시니어 든든] ${place} 키오스크 연습을 마쳤어요! 👏\n` +
      `대기 번호 ${orderNo}번 · 합계 ${total.toLocaleString()}원\n\n` +
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
    <div style={{ padding: "24px 18px 26px" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 54, lineHeight: 1, marginBottom: 8 }} aria-hidden="true">🎉</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, color: "#1A1A2E", lineHeight: 1.35, marginBottom: 8 }}>{successTitle}</h1>
        <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.7 }}>{praise}</p>
      </div>

      {/* 번호표 */}
      <div style={{ background: "#F0FDF4", border: "2px dashed #34D399", borderRadius: 18, padding: "18px 20px", marginBottom: 12, textAlign: "center" }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#059669", marginBottom: 4 }}>🎫 대기 번호표</p>
        <p style={{ fontSize: 44, fontWeight: 900, color: "#065F46", lineHeight: 1.1, margin: "4px 0 8px" }}>{orderNo}번</p>
        <p style={{ fontSize: 15, color: "#065F46", lineHeight: 1.65 }}>
          이 번호가 <strong>화면에 뜨거나 방송으로 불리면</strong>, 음료 받는 곳으로 가서 받으면 돼요. 그때까지는 자리에서 기다리시면 됩니다.
        </p>
      </div>

      {/* 영수증 */}
      <div style={{ background: "#fff", border: "2px dashed #C9C7BE", borderRadius: 18, padding: "18px 20px", marginBottom: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", textAlign: "center", marginBottom: 2 }}>🧾 영수증 · {brand}</p>
        <p style={{ fontSize: 12, color: "#9B9890", textAlign: "center", marginBottom: 14 }}>연습용 · {finishedAt}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, borderTop: "1px solid #EEECE6", borderBottom: "1px solid #EEECE6", padding: "12px 0" }}>
          {items.map((s) => (
            <div key={s.key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 16 }}>
              <span style={{ color: "#6B7280" }}>{s.key}</span>
              <span style={{ color: "#1A1A2E", fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0 2px" }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#1A1A2E" }}>합계</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#1B6FC8" }}>{total.toLocaleString()}원</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 15, color: "#6B7280" }}>
          <span>결제 방법</span>
          <span style={{ color: "#1A1A2E", fontWeight: 700 }}>{payMethod} (연습)</span>
        </div>
      </div>

      {/* 영수증 설명 */}
      <div style={{ background: "#EAF3FC", border: "1px solid #BBD9F5", borderRadius: 14, padding: "14px 16px", marginBottom: 22 }}>
        <p style={{ fontSize: 15, color: "#0C447C", lineHeight: 1.7 }}>
          <strong>영수증</strong>은 내가 주문한 내용과 낸 금액이 적힌 종이예요. 주문이 잘못됐거나 문제가 있으면 이 영수증을 직원에게 보여주면 됩니다. <strong>음료를 받을 때까지 버리지 말고</strong> 가지고 계세요.
        </p>
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          type="button"
          onClick={onRestart}
          style={{ height: 60, fontSize: 19, fontWeight: 800, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 16, cursor: "pointer" }}
        >
          🔁 처음부터 다시 연습하기
        </button>
        <button
          type="button"
          onClick={handleShare}
          style={{ height: 56, fontSize: 17, fontWeight: 700, color: "#1B6FC8", background: "#EAF3FC", border: "2px solid #BBD9F5", borderRadius: 16, cursor: "pointer" }}
        >
          📤 가족에게 자랑하기 / 공유하기
        </button>
        <Link
          href="/kiosk"
          style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#6B7280", background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 16, textDecoration: "none" }}
        >
          다른 연습 고르기
        </Link>
      </div>
    </div>
  );
}
