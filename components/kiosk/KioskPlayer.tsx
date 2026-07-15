"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { KioskScenario, KioskOption } from "@/lib/kiosk/types";
import { useVoice } from "./useVoice";
import { trackKiosk } from "@/lib/kiosk/track";
import { recordPracticeComplete } from "@/lib/progress";
import BigButton from "./BigButton";
import StepGuide from "./StepGuide";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";

export default function KioskPlayer({ scenario }: { scenario: KioskScenario }) {
  const stepCount = scenario.steps.length;
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<(KioskOption | null)[]>(() => Array(stepCount).fill(null));
  const [done, setDone] = useState(false);
  const [finishedAt, setFinishedAt] = useState("");
  const [orderNo, setOrderNo] = useState(() => 10 + Math.floor(Math.random() * 90));
  const interacted = useRef(false);
  const { speak, stop } = useVoice();

  const step = scenario.steps[index];
  const currentChoice = choices[index];
  const isLast = index === stepCount - 1;

  // 합계 금액 = (메뉴 단가) × (수량). 선택된 것들에서 찾아 계산.
  const menuChoice = choices.find((c) => c && c.price != null) || null;
  const qtyChoice = choices.find((c) => c && c.qty != null) || null;
  const priceEach = menuChoice?.price ?? null;
  const qty = qtyChoice?.qty ?? 1;
  const total = priceEach != null ? priceEach * qty : null;

  // 시나리오에 가격이 하나라도 있으면 결제형(카페·패스트푸드·민원발급기),
  // 없으면 접수형(병원)으로 보고 금액·결제 표시를 통째로 숨긴다.
  const hasPayment = scenario.steps.some((s) => s.options.some((o) => o.price != null));
  const unitLabel = scenario.unitLabel ?? "잔";
  const finishLabel = scenario.finishLabel ?? "결제하기";

  // 주문 요약(요약값이 있는 선택만)
  const summaries = choices
    .filter((c): c is KioskOption => !!c && !!c.summaryKey)
    .map((c) => ({ key: c.summaryKey as string, value: c.summaryValue ?? c.label }));

  useEffect(() => {
    trackKiosk("kiosk_start", { scenario: scenario.id });
  }, [scenario.id]);

  // 화면이 바뀔 때, 한 번이라도 상호작용했다면 안내를 자동으로 읽어준다.
  useEffect(() => {
    if (done) return;
    if (interacted.current) speak(scenario.steps[index].voice);
  }, [index, done, speak, scenario.steps]);

  function selectOption(opt: KioskOption) {
    interacted.current = true;
    stop();
    setChoices((prev) => {
      const copy = [...prev];
      copy[index] = opt;
      return copy;
    });
  }

  function goNext() {
    if (!currentChoice) return;
    stop();
    if (isLast) {
      setFinishedAt(new Date().toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }));
      setDone(true);
      trackKiosk("kiosk_complete", { scenario: scenario.id });
      // 도장판·이어하기용 기록 — 이용자 브라우저에만 저장된다
      recordPracticeComplete(scenario.id);
    } else {
      setIndex(index + 1);
    }
  }

  function goBack() {
    if (index === 0) return;
    stop();
    setIndex(index - 1);
  }

  function handleListen() {
    interacted.current = true;
    speak(step.voice);
  }

  function handleRestart() {
    stop();
    interacted.current = false;
    setChoices(Array(stepCount).fill(null));
    setIndex(0);
    setDone(false);
    setFinishedAt("");
    setOrderNo(10 + Math.floor(Math.random() * 90));
    trackKiosk("kiosk_restart", { scenario: scenario.id });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EAF1F8", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 14px 44px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* 나가기 (기계 위) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 4px" }}>
          <Link href="/kiosk" onClick={() => stop()} style={{ color: "#1B6FC8", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            ← 나가기
          </Link>
          <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>연습용 화면</span>
        </div>

        {/* 키오스크 기계 프레임 */}
        <div style={{ border: "9px solid #1A1A2E", borderRadius: 30, background: "#fff", overflow: "hidden", boxShadow: "0 12px 34px rgba(26,26,46,0.28)" }}>
          {/* 브랜드 헤더 */}
          <div style={{ background: "#1B6FC8", color: "#fff", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 20, fontWeight: 800 }}>{scenario.emoji} {scenario.brand}</span>
            <span style={{ fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "4px 11px", borderRadius: 999 }}>연습용</span>
          </div>

          {done ? (
            <ResultCard
              brand={scenario.brand}
              place={scenario.place}
              successTitle={scenario.successTitle}
              summaries={summaries}
              total={total ?? 0}
              orderNo={orderNo}
              finishedAt={finishedAt}
              scenarioId={scenario.id}
              onRestart={handleRestart}
              hasPayment={hasPayment}
              showTicket={scenario.showTicket ?? true}
              ticketNote={scenario.ticketNote}
              receiptTitle={scenario.receiptTitle}
              receiptNote={scenario.receiptNote}
            />
          ) : (
            <div style={{ padding: "22px 18px 20px" }}>
              <ProgressBar current={index + 1} total={stepCount} />
              <StepGuide title={step.title} guide={step.guide} onListen={handleListen} />

              <div style={{ display: "grid", gridTemplateColumns: step.layout === "grid" ? "1fr 1fr" : "1fr", gap: 14 }}>
                {step.options.map((opt) => (
                  <BigButton
                    key={opt.id}
                    emoji={opt.emoji}
                    label={opt.label}
                    sublabel={opt.sublabel}
                    selected={currentChoice?.id === opt.id}
                    onClick={() => selectOption(opt)}
                  />
                ))}
              </div>

              {step.note && (
                <p style={{ marginTop: 16, fontSize: 15, color: "#059669", background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 12, padding: "12px 14px", lineHeight: 1.6, textAlign: "center" }}>
                  {step.note}
                </p>
              )}

              {/* 하단 주문내역 + 다음 (실제 키오스크처럼) */}
              <div style={{ marginTop: 18, borderTop: "1px solid #E5E7EB", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: hasPayment ? "space-between" : "flex-end", gap: 12, flexWrap: "wrap" }}>
                {hasPayment && (
                  <div style={{ fontSize: 15, color: "#4A5568", lineHeight: 1.5, minWidth: 130 }}>
                    {menuChoice ? (
                      <>
                        담은 것 <span style={{ color: "#1A1A2E", fontWeight: 800 }}>{menuChoice.summaryValue}{qty > 1 ? ` ${qty}${unitLabel}` : ""}</span>
                        <br />합계 <span style={{ color: "#1B6FC8", fontWeight: 800, fontSize: 18 }}>{(total ?? 0).toLocaleString()}원</span>
                      </>
                    ) : (
                      <span style={{ color: "#9CA3AF" }}>{scenario.cartEmptyText ?? "메뉴를 고르면 금액이 나와요"}</span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!currentChoice}
                  style={{
                    height: 60,
                    padding: "0 26px",
                    fontSize: 20,
                    fontWeight: 800,
                    color: currentChoice ? "#fff" : "#9CA3AF",
                    background: currentChoice ? "#1B6FC8" : "#EDEDED",
                    border: "none",
                    borderRadius: 16,
                    cursor: currentChoice ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentChoice ? (isLast ? `${finishLabel} →` : "다음 →") : "위에서 골라 주세요"}
                </button>
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  style={{ marginTop: 12, width: "100%", height: 50, fontSize: 16, fontWeight: 700, color: "#6B7280", background: "#F7F6F3", border: "1.5px solid #E5E7EB", borderRadius: 14, cursor: "pointer" }}
                >
                  ← 이전으로
                </button>
              )}
            </div>
          )}
        </div>

        <p style={{ marginTop: 16, fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.6 }}>
          천천히 눌러도 괜찮아요. 이 화면은 <strong>연습용</strong>이라 실제로 접수·결제되지 않아요.
        </p>
      </div>

      <style>{`
        .kiosk-bigbtn:hover { border-color: #1B6FC8; }
        .kiosk-bigbtn:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
