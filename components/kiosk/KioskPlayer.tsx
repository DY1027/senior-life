"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { KioskScenario, KioskOption } from "@/lib/kiosk/types";
import { useVoice } from "./useVoice";
import { trackKiosk } from "@/lib/kiosk/track";
import BigButton from "./BigButton";
import StepGuide from "./StepGuide";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";

type Summary = { key: string; value: string };

export default function KioskPlayer({ scenario }: { scenario: KioskScenario }) {
  const [index, setIndex] = useState(0);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [done, setDone] = useState(false);
  const interacted = useRef(false);
  const { speak, stop } = useVoice();

  const total = scenario.steps.length;
  const step = scenario.steps[index];

  // 연습 시작 1회 기록
  useEffect(() => {
    trackKiosk("kiosk_start", { scenario: scenario.id });
  }, [scenario.id]);

  // 화면(단계)이 바뀔 때, 사용자가 한 번이라도 상호작용했다면 안내를 자동으로 읽어준다.
  // (iOS는 첫 소리에 사용자 제스처가 필요하므로 첫 화면은 "안내 듣기" 버튼으로 시작한다.)
  useEffect(() => {
    if (done) return;
    if (interacted.current) speak(scenario.steps[index].voice);
  }, [index, done, speak, scenario.steps]);

  function handleSelect(opt: KioskOption) {
    interacted.current = true;
    stop();
    const next = opt.summaryKey
      ? [...summaries, { key: opt.summaryKey, value: opt.summaryValue ?? opt.label }]
      : summaries;
    setSummaries(next);
    if (index >= total - 1) {
      setDone(true);
      trackKiosk("kiosk_complete", { scenario: scenario.id });
    } else {
      setIndex(index + 1);
    }
  }

  function handleBack() {
    if (index === 0) return;
    stop();
    setSummaries((prev) => prev.slice(0, -1));
    setIndex(index - 1);
  }

  function handleListen() {
    interacted.current = true;
    speak(step.voice);
  }

  function handleRestart() {
    stop();
    interacted.current = false;
    setIndex(0);
    setSummaries([]);
    setDone(false);
    trackKiosk("kiosk_restart", { scenario: scenario.id });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EAF1F8", display: "flex", flexDirection: "column" }}>
      {/* 상단 바: 나가기 + 연습용 배지 */}
      <div style={{ background: "#1B6FC8", color: "#fff", padding: "0 16px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link href="/kiosk" onClick={() => stop()} style={{ color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            ← 나가기
          </Link>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            {scenario.emoji} {scenario.place} 연습
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 999 }}>
            연습용
          </span>
        </div>
      </div>

      {/* 본문 (키오스크 화면) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 40px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #D6E4F5",
            boxShadow: "0 8px 30px rgba(27,111,200,0.12)",
            padding: "28px 22px 32px",
          }}
        >
          {done ? (
            <ResultCard
              place={scenario.place}
              successTitle={scenario.successTitle}
              summaries={summaries}
              scenarioId={scenario.id}
              onRestart={handleRestart}
            />
          ) : (
            <>
              <ProgressBar current={index + 1} total={total} />
              <StepGuide title={step.title} guide={step.guide} onListen={handleListen} />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: step.layout === "grid" ? "1fr 1fr" : "1fr",
                  gap: 14,
                }}
              >
                {step.options.map((opt) => (
                  <BigButton
                    key={opt.id}
                    emoji={opt.emoji}
                    label={opt.label}
                    sublabel={opt.sublabel}
                    onClick={() => handleSelect(opt)}
                  />
                ))}
              </div>

              {step.note && (
                <p style={{ marginTop: 18, fontSize: 15, color: "#059669", background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 12, padding: "12px 14px", lineHeight: 1.6, textAlign: "center" }}>
                  {step.note}
                </p>
              )}

              {/* 뒤로가기 (첫 화면 제외) */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{ marginTop: 18, width: "100%", height: 52, fontSize: 17, fontWeight: 700, color: "#6B7280", background: "#F7F6F3", border: "1.5px solid #E5E7EB", borderRadius: 14, cursor: "pointer" }}
                >
                  ← 이전으로
                </button>
              )}
            </>
          )}
        </div>

        {/* 상시 안내 */}
        <p style={{ marginTop: 18, fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.6, maxWidth: 560 }}>
          천천히 눌러도 괜찮아요. 이 화면은 <strong>연습용</strong>이라 실제로 결제되지 않아요.
        </p>
      </div>

      <style>{`
        .kiosk-bigbtn:hover { border-color: #1B6FC8; background: #F5FAFF; }
        .kiosk-bigbtn:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
