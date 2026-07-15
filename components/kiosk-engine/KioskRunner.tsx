"use client";
// 키오스크 엔진 v2 실행기 — KioskShell(공통 틀) + 화면 렌더링.
// 로직은 lib/kiosk-engine의 리듀서·판정기가 전담하고, 이 컴포넌트는
// 이벤트를 보내고 상태를 그리는 역할만 한다.
//
// 시스템 버튼 고정 배치(명세 5.1): 왼쪽 위 이전 / 가운데 위 진행 단계 /
// 오른쪽 위 도움말 / 왼쪽 아래 처음부터 / 오른쪽 아래 다음·결제.
import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Catalog, MachineEvent, Phase, Scenario } from "@/lib/kiosk-engine/types";
import {
  createInitialState,
  kioskReducer,
  cartTotal,
  itemPrice,
  missingRequiredOption,
  shouldPaymentFail,
} from "@/lib/kiosk-engine/machine";
import { evaluateMission, nextGuidance } from "@/lib/kiosk-engine/evaluator";
import { useVoice } from "@/components/kiosk/useVoice";
import { trackKiosk } from "@/lib/kiosk/track";
import { recordPracticeComplete } from "@/lib/progress";

const PHASE_LABEL: Record<Phase, string> = {
  intro: "연습 준비",
  service: "주문 방법",
  menu: "메뉴 고르기",
  options: "옵션 선택",
  cart: "주문 확인",
  payMethod: "결제 방법",
  processing: "결제 중",
  payError: "결제 확인",
  receipt: "영수증",
  done: "완료",
};

const MODE_LABEL = { learn: "천천히 배우기", solo: "혼자 연습하기", challenge: "실제처럼 도전", free: "자유 연습" } as const;

export default function KioskRunner({ catalog, scenario }: { catalog: Catalog; scenario: Scenario }) {
  const [state, dispatch] = useReducer(
    (s: ReturnType<typeof createInitialState>, e: MachineEvent) => kioskReducer(s, e, catalog, scenario),
    undefined,
    () => createInitialState(catalog, scenario)
  );
  const { speak, stop } = useVoice();
  const [hintOn, setHintOn] = useState(false); // 도움말을 눌러 안내를 켠 상태 (learn 모드는 항상 켜짐)
  const [notice, setNotice] = useState<string | null>(null); // 품절·필수옵션 등 짧은 안내
  const interacted = useRef(false);
  const doneRecorded = useRef(false);

  const guidance = useMemo(() => nextGuidance(state, scenario, catalog), [state, scenario, catalog]);
  const showGuide = scenario.mode === "learn" || hintOn;
  const total = cartTotal(catalog, state.cart);

  const send = (e: MachineEvent) => {
    interacted.current = true;
    setNotice(null);
    if (e.type !== "USE_HINT") setHintOn(scenario.mode === "learn"); // 화면이 진행되면 힌트는 다시 접는다
    stop();
    dispatch(e);
  };

  // 결제 지연 연출 (명세 7.1: 결제 처리 1~2초) + ErrorEngine의 카드 인식 실패
  useEffect(() => {
    if (state.phase !== "processing") return;
    const fail = shouldPaymentFail(state, scenario);
    const t = setTimeout(() => dispatch({ type: "PAY_RESULT", ok: !fail }), 1500);
    return () => clearTimeout(t);
    // payAttempts가 시도마다 바뀌므로 재시도에도 다시 실행된다
  }, [state.phase, state.payAttempts, scenario, state]);

  // 천천히 배우기: 화면이 바뀌면 안내를 자동으로 읽어준다 (첫 상호작용 후)
  useEffect(() => {
    if (scenario.mode !== "learn" || !interacted.current) return;
    if (state.phase === "processing") return;
    speak(guidance.text);
  }, [state.phase, scenario.mode, guidance.text, speak]);

  // 완료 기록 (도장판·이어하기)
  useEffect(() => {
    if (state.phase !== "done" || doneRecorded.current) return;
    doneRecorded.current = true;
    recordPracticeComplete(catalog.kioskType, scenario.id);
    trackKiosk("kiosk_complete", { scenario: scenario.id });
  }, [state.phase, catalog.kioskType, scenario.id]);

  useEffect(() => {
    trackKiosk("kiosk_start", { scenario: scenario.id });
  }, [scenario.id]);

  function useHint() {
    interacted.current = true;
    setHintOn(true);
    dispatch({ type: "USE_HINT" });
    speak(guidance.text);
    trackKiosk("kiosk_hint", { scenario: scenario.id });
  }

  // data-guide 대상 강조 클래스
  const g = (id: string) => ({
    "data-guide": id,
    className: showGuide && guidance.targetId === id ? "kg-target" : undefined,
  });

  const productById = (id: string) => catalog.products.find((p) => p.id === id);
  const leftLayout = scenario.layout === "left";
  const editingProduct = state.editing ? productById(state.editing.productId) : null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#EAF1F8] px-3 pb-11 pt-5">
      <div className="w-full max-w-[520px]">
        {/* 기계 밖: 나가기 + 연습용 표시 */}
        <div className="mb-2.5 flex items-center justify-between px-1">
          <Link href={`/kiosk/${catalog.kioskType}`} onClick={() => stop()} className="text-[16px] font-bold text-[#1B6FC8] no-underline">
            ← 나가기
          </Link>
          <span className="text-[13px] font-semibold text-[#6B7280]">
            {MODE_LABEL[scenario.mode]} · 연습용 화면
          </span>
        </div>

        {/* 임무 안내 (기계 밖 고정) */}
        {scenario.missionText && state.phase !== "intro" && state.phase !== "done" && (
          <div className="mb-2.5 rounded-2xl border-2 border-[#F5D9A8] bg-[#FDF4DF] px-4 py-2.5 text-center">
            <span className="text-[14px] font-extrabold text-[#C4621A]">📋 임무 </span>
            <span className="break-keep text-[15px] font-bold leading-snug text-[#5C4A32]">{scenario.missionText}</span>
          </div>
        )}

        {/* 키오스크 기계 프레임 */}
        <div className="overflow-hidden rounded-[30px] border-[9px] border-[#1A1A2E] bg-white shadow-[0_12px_34px_rgba(26,26,46,0.28)]">
          {/* 브랜드 헤더 */}
          <div className="flex items-center justify-between bg-[#1B6FC8] px-4 py-3 text-white">
            <span className="text-[19px] font-extrabold">{catalog.emoji} {catalog.brand}</span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold">연습용</span>
          </div>

          {/* 시스템 버튼 줄 (고정 배치: 이전 | 단계 | 도움말) */}
          {state.phase !== "done" && (
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F4F8FC] px-3 py-2">
              <button
                type="button"
                onClick={() => send({ type: "BACK" })}
                disabled={state.phase === "intro" || state.phase === "processing" || state.phase === "receipt"}
                className="min-h-[44px] rounded-xl border-[1.5px] border-[#C9D8E8] bg-white px-3.5 text-[15px] font-bold text-[#3D5A78] disabled:opacity-40"
              >
                ← 이전
              </button>
              <span className="text-[14px] font-extrabold text-[#3D5A78]">{PHASE_LABEL[state.phase]}</span>
              <button
                type="button"
                onClick={useHint}
                disabled={state.phase === "processing"}
                className="min-h-[44px] rounded-xl border-[1.5px] border-[#F5D9A8] bg-[#FDF4DF] px-3.5 text-[15px] font-bold text-[#C4621A] disabled:opacity-40"
              >
                🙋 도움말
              </button>
            </div>
          )}

          {/* 안내 배너 (learn 모드 상시 / 도움말 눌렀을 때) */}
          {showGuide && state.phase !== "done" && state.phase !== "intro" && (
            <div className="border-b border-[#DDEBDD] bg-[#F0FDF4] px-4 py-2.5">
              <p className="break-keep text-center text-[15px] font-bold leading-relaxed text-[#166534]">💬 {guidance.text}</p>
            </div>
          )}

          {/* 짧은 알림 (품절 등) */}
          {notice && (
            <div className="border-b border-[#FECACA] bg-[#FEF2F2] px-4 py-2.5">
              <p className="break-keep text-center text-[15px] font-bold leading-relaxed text-[#B91C1C]">{notice}</p>
            </div>
          )}

          {/* ── 화면 본문 ── */}
          <div className="p-4">
            {state.phase === "intro" && (
              <div className="text-center">
                <p className="text-[44px]" aria-hidden="true">{catalog.emoji}</p>
                <h1 className="mt-1 break-keep text-[22px] font-extrabold leading-snug text-[#1A1A2E]">{scenario.title}</h1>
                {scenario.missionText && (
                  <p className="mx-auto mt-3 max-w-[380px] break-keep rounded-2xl bg-[#FDF4DF] px-4 py-3 text-[16px] font-bold leading-relaxed text-[#5C4A32]">
                    📋 {scenario.missionText}
                  </p>
                )}
                {(scenario.events ?? []).length > 0 && (
                  <p className="mx-auto mt-3 max-w-[380px] break-keep text-[14px] leading-relaxed text-[#6B7280]">
                    이번 연습에서는 실제 기기에서 생길 수 있는 상황이 나타날 수 있어요. 모든 상황은 연습용이고, 언제든 처음부터 다시 할 수 있어요.
                  </p>
                )}
                <button
                  type="button"
                  {...g("start")}
                  onClick={() => send({ type: "START" })}
                  className={`mt-5 h-[64px] w-full rounded-2xl bg-[#1B6FC8] text-[20px] font-extrabold text-white ${g("start").className ?? ""}`}
                >
                  연습 시작 →
                </button>
                <p className="mt-3 text-[13px] text-[#9CA3AF]">실제 주문·결제는 되지 않아요.</p>
              </div>
            )}

            {state.phase === "service" && (
              <div className="flex flex-col gap-3.5">
                <h2 className="text-center text-[21px] font-extrabold text-[#1A1A2E]">어디에서 드시겠어요?</h2>
                {catalog.serviceTypes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    data-guide={`service-${s.id}`}
                    onClick={() => send({ type: "SELECT_SERVICE", serviceType: s.id })}
                    className={`flex min-h-[76px] items-center justify-center gap-3 rounded-2xl border-[2.5px] border-[#D7E3F0] bg-white text-[21px] font-extrabold text-[#1A1A2E] active:scale-[0.98] ${showGuide && guidance.targetId === `service-${s.id}` ? "kg-target" : ""}`}
                  >
                    <span className="text-[30px]" aria-hidden="true">{s.emoji}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {state.phase === "menu" && (
              <div className={leftLayout ? "flex gap-3" : ""}>
                {/* 카테고리 — 배치 변형: 위쪽(기본) 또는 왼쪽 */}
                <div className={leftLayout ? "flex w-[104px] flex-shrink-0 flex-col gap-2" : "mb-3 flex gap-2 overflow-x-auto"}>
                  {catalog.categories.map((c) => {
                    const active = c.id === state.activeCategoryId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        data-guide={`category-${c.id}`}
                        onClick={() => send({ type: "SELECT_CATEGORY", categoryId: c.id })}
                        className={`min-h-[52px] whitespace-nowrap rounded-xl px-4 text-[16px] font-extrabold ${active ? "bg-[#1B6FC8] text-white" : "border-[1.5px] border-[#D7E3F0] bg-white text-[#3D5A78]"} ${showGuide && guidance.targetId === `category-${c.id}` ? "kg-target" : ""}`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* 상품 */}
                <div className="grid flex-1 grid-cols-2 gap-2.5">
                  {catalog.products
                    .filter((p) => p.categoryId === state.activeCategoryId)
                    .map((p) => {
                      const soldOut = state.soldOutIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          data-guide={`product-${p.id}`}
                          onClick={() =>
                            soldOut
                              ? setNotice(`${p.name}은(는) 품절이에요. 당황하지 말고 다른 메뉴를 고르면 돼요.`)
                              : send({ type: "OPEN_PRODUCT", productId: p.id })
                          }
                          className={`relative flex min-h-[108px] flex-col items-center justify-center gap-1 rounded-2xl border-[2.5px] px-2 py-3 active:scale-[0.98] ${soldOut ? "border-[#E5E7EB] bg-[#F3F4F6] opacity-70" : "border-[#D7E3F0] bg-white"} ${showGuide && guidance.targetId === `product-${p.id}` ? "kg-target" : ""}`}
                        >
                          {soldOut && (
                            <span className="absolute right-2 top-2 rounded-full bg-[#6B7280] px-2 py-0.5 text-[11px] font-bold text-white">품절</span>
                          )}
                          <span className="text-[30px]" aria-hidden="true">{p.emoji}</span>
                          <span className="break-keep text-center text-[16px] font-extrabold leading-tight text-[#1A1A2E]">{p.name}</span>
                          <span className="text-[14px] font-bold text-[#1B6FC8]">{p.price.toLocaleString()}원</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {state.phase === "options" && state.editing && editingProduct && (
                <div>
                  <h2 className="text-center text-[20px] font-extrabold text-[#1A1A2E]">
                    {editingProduct.emoji} {editingProduct.name}
                  </h2>
                  {(editingProduct.optionGroupIds ?? []).map((gid) => {
                    const og = catalog.optionGroups.find((o) => o.id === gid)!;
                    return (
                      <div key={gid} className="mt-4">
                        <p className="mb-2 text-[15px] font-extrabold text-[#3D5A78]">{og.label}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {og.choices.map((c) => {
                            const selected = state.editing!.options[gid] === c.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                data-guide={`option-${gid}-${c.id}`}
                                onClick={() => send({ type: "SET_OPTION", groupId: gid, choiceId: c.id })}
                                className={`min-h-[56px] rounded-xl border-[2.5px] px-3 text-[16px] font-extrabold ${selected ? "border-[#1B6FC8] bg-[#EAF3FC] text-[#0C447C]" : "border-[#D7E3F0] bg-white text-[#1A1A2E]"} ${showGuide && guidance.targetId === `option-${gid}-${c.id}` ? "kg-target" : ""}`}
                              >
                                {selected ? "✓ " : ""}{c.label}
                                {c.priceDelta ? <span className="ml-1 text-[13px] text-[#6B7280]">+{c.priceDelta.toLocaleString()}원</span> : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* 수량 */}
                  <div className={showGuide && guidance.targetId === "qty" ? "kg-target mt-4 rounded-xl" : "mt-4"} data-guide="qty">
                    <p className="mb-2 text-[15px] font-extrabold text-[#3D5A78]">수량</p>
                    <div className="flex items-center justify-center gap-4">
                      <button type="button" aria-label="수량 줄이기" onClick={() => send({ type: "SET_QTY", quantity: state.editing!.quantity - 1 })} className="h-[56px] w-[56px] rounded-xl border-[2.5px] border-[#D7E3F0] bg-white text-[26px] font-extrabold text-[#1A1A2E]">−</button>
                      <span className="min-w-[64px] text-center text-[24px] font-extrabold text-[#1A1A2E]">{state.editing.quantity}{catalog.unitLabel}</span>
                      <button type="button" aria-label="수량 늘리기" onClick={() => send({ type: "SET_QTY", quantity: state.editing!.quantity + 1 })} className="h-[56px] w-[56px] rounded-xl border-[2.5px] border-[#D7E3F0] bg-white text-[26px] font-extrabold text-[#1A1A2E]">＋</button>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2.5">
                    <button type="button" onClick={() => send({ type: "CANCEL_ITEM" })} className="h-[56px] flex-1 rounded-2xl border-[1.5px] border-[#E5E7EB] bg-[#F7F6F3] text-[16px] font-bold text-[#6B7280]">
                      취소
                    </button>
                    <button
                      type="button"
                      data-guide="confirm-item"
                      onClick={() => {
                        const missing = missingRequiredOption(catalog, state.editing!);
                        if (missing) {
                          const og = catalog.optionGroups.find((o) => o.id === missing);
                          setNotice(`${og?.label}을(를) 먼저 골라 주세요.`);
                          return;
                        }
                        send({ type: "CONFIRM_ITEM" });
                      }}
                      className={`h-[56px] flex-[2] rounded-2xl bg-[#1B6FC8] text-[18px] font-extrabold text-white ${showGuide && guidance.targetId === "confirm-item" ? "kg-target" : ""}`}
                    >
                      담기 · {itemPrice(catalog, state.editing).toLocaleString()}원
                    </button>
                  </div>
                </div>
            )}

            {state.phase === "cart" && (
              <div>
                <h2 className="text-center text-[20px] font-extrabold text-[#1A1A2E]">주문 내역을 확인해요</h2>
                {state.cart.length === 0 ? (
                  <p className="py-8 text-center text-[16px] text-[#6B7280]">장바구니가 비어 있어요.<br />메뉴로 돌아가 담아 보세요.</p>
                ) : (
                  <div className="mt-3 flex flex-col gap-2.5">
                    {state.cart.map((it) => {
                      const p = productById(it.productId)!;
                      const optText = Object.entries(it.options)
                        .map(([gid, cid]) => catalog.optionGroups.find((o) => o.id === gid)?.choices.find((c) => c.id === cid)?.label)
                        .filter(Boolean)
                        .join(" · ");
                      return (
                        <div key={it.uid} className="rounded-2xl border-[1.5px] border-[#E5E7EB] bg-white p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[17px] font-extrabold text-[#1A1A2E]">{p.emoji} {p.name}</p>
                              {optText && <p className="mt-0.5 text-[13px] font-semibold text-[#6B7280]">{optText}</p>}
                            </div>
                            <p className="whitespace-nowrap text-[16px] font-extrabold text-[#1B6FC8]">{itemPrice(catalog, it).toLocaleString()}원</p>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <button type="button" aria-label="수량 줄이기" onClick={() => send({ type: "CHANGE_ITEM_QTY", uid: it.uid, quantity: it.quantity - 1 })} className="h-[44px] w-[44px] rounded-lg border-[1.5px] border-[#D7E3F0] bg-white text-[20px] font-extrabold text-[#1A1A2E]">−</button>
                              <span className="min-w-[44px] text-center text-[17px] font-extrabold">{it.quantity}{catalog.unitLabel}</span>
                              <button type="button" aria-label="수량 늘리기" onClick={() => send({ type: "CHANGE_ITEM_QTY", uid: it.uid, quantity: it.quantity + 1 })} className="h-[44px] w-[44px] rounded-lg border-[1.5px] border-[#D7E3F0] bg-white text-[20px] font-extrabold text-[#1A1A2E]">＋</button>
                            </div>
                            <button
                              type="button"
                              data-guide={`remove-${it.uid}`}
                              onClick={() => send({ type: "REMOVE_ITEM", uid: it.uid })}
                              className={`min-h-[44px] rounded-lg border-[1.5px] border-[#FECACA] bg-[#FEF2F2] px-3.5 text-[15px] font-bold text-[#B91C1C] ${showGuide && guidance.targetId === `remove-${it.uid}` ? "kg-target" : ""}`}
                            >
                              🗑 삭제
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F4F8FC] px-4 py-3">
                  <span className="text-[16px] font-extrabold text-[#3D5A78]">합계</span>
                  <span className="text-[22px] font-extrabold text-[#1B6FC8]">{total.toLocaleString()}원</span>
                </div>

                <div className="mt-4 flex gap-2.5">
                  <button
                    type="button"
                    data-guide="close-cart"
                    onClick={() => send({ type: "CLOSE_CART" })}
                    className={`h-[60px] flex-1 rounded-2xl border-[1.5px] border-[#D7E3F0] bg-white text-[15px] font-bold text-[#3D5A78] ${showGuide && guidance.targetId === "close-cart" ? "kg-target" : ""}`}
                  >
                    ← 메뉴로<br />돌아가기
                  </button>
                  <button
                    type="button"
                    data-guide="checkout"
                    disabled={state.cart.length === 0}
                    onClick={() => send({ type: "CHECKOUT" })}
                    className={`h-[60px] flex-[2] rounded-2xl bg-[#1B6FC8] text-[19px] font-extrabold text-white disabled:bg-[#EDEDED] disabled:text-[#9CA3AF] ${showGuide && guidance.targetId === "checkout" ? "kg-target" : ""}`}
                  >
                    결제하기 →
                  </button>
                </div>
              </div>
            )}

            {state.phase === "payMethod" && (
              <div className="flex flex-col gap-3.5">
                <h2 className="text-center text-[20px] font-extrabold text-[#1A1A2E]">
                  {total.toLocaleString()}원, 어떻게 계산할까요?
                </h2>
                {catalog.paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    data-guide={`pay-${m.id}`}
                    onClick={() => send({ type: "SELECT_PAY", methodId: m.id })}
                    className={`flex min-h-[72px] flex-col items-center justify-center rounded-2xl border-[2.5px] border-[#D7E3F0] bg-white active:scale-[0.98] ${showGuide && guidance.targetId === `pay-${m.id}` ? "kg-target" : ""}`}
                  >
                    <span className="text-[19px] font-extrabold text-[#1A1A2E]">{m.emoji} {m.label}</span>
                    {m.hint && <span className="mt-0.5 text-[13px] font-semibold text-[#6B7280]">{m.hint}</span>}
                  </button>
                ))}
                <p className="text-center text-[13px] text-[#9CA3AF]">연습이라 실제로 돈이 나가지 않아요.</p>
              </div>
            )}

            {state.phase === "processing" && (
              <div className="py-10 text-center" role="status">
                <p className="kg-spin mx-auto h-[52px] w-[52px] rounded-full border-4 border-[#D7E3F0] border-t-[#1B6FC8]" aria-hidden="true" />
                <p className="mt-5 text-[18px] font-extrabold text-[#1A1A2E]">결제 정보를 확인하고 있어요</p>
                <p className="mt-1 text-[15px] text-[#6B7280]">잠시만 기다려 주세요…</p>
              </div>
            )}

            {state.phase === "payError" && (
              <div className="text-center">
                <p className="text-[44px]" aria-hidden="true">💳</p>
                <h2 className="mt-1 text-[20px] font-extrabold text-[#1A1A2E]">카드를 읽지 못했어요</h2>
                <p className="mx-auto mt-2 max-w-[360px] break-keep text-[16px] leading-relaxed text-[#4A5568]">
                  괜찮아요, 실제 기기에서도 자주 있는 일이에요.<br />
                  카드 방향(금색 칩이 위)을 확인하고 다시 시도해 보세요.
                </p>
                <button
                  type="button"
                  data-guide="retry-pay"
                  onClick={() => send({ type: "RETRY_PAY" })}
                  className={`mt-5 h-[64px] w-full rounded-2xl bg-[#1B6FC8] text-[19px] font-extrabold text-white ${showGuide && guidance.targetId === "retry-pay" ? "kg-target" : ""}`}
                >
                  🔄 카드 다시 넣고 시도하기
                </button>
                <button
                  type="button"
                  onClick={() => send({ type: "BACK" })}
                  className="mt-2.5 h-[52px] w-full rounded-2xl border-[1.5px] border-[#D7E3F0] bg-white text-[16px] font-bold text-[#3D5A78]"
                >
                  다른 결제 방법 고르기
                </button>
                <button
                  type="button"
                  onClick={() => setNotice("직원을 불렀어요. 실제 매장에서는 잠시 기다리면 직원이 와서 도와드려요.")}
                  className="mt-2.5 h-[52px] w-full rounded-2xl border-[1.5px] border-[#F5D9A8] bg-[#FDF4DF] text-[16px] font-bold text-[#C4621A]"
                >
                  🙋 직원 호출 (도움 요청)
                </button>
              </div>
            )}

            {state.phase === "receipt" && (
              <div className="text-center">
                <p className="text-[44px]" aria-hidden="true">🧾</p>
                <h2 className="mt-1 text-[20px] font-extrabold text-[#1A1A2E]">영수증을 받으시겠어요?</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">영수증에는 주문 내용과 낸 금액이 적혀 있어요.</p>
                <div className="mt-5 flex gap-2.5">
                  <button
                    type="button"
                    data-guide="receipt-yes"
                    onClick={() => send({ type: "SELECT_RECEIPT", want: true })}
                    className={`h-[64px] flex-1 rounded-2xl border-[2.5px] border-[#D7E3F0] bg-white text-[18px] font-extrabold text-[#1A1A2E] ${showGuide && guidance.targetId === "receipt-yes" ? "kg-target" : ""}`}
                  >
                    받기
                  </button>
                  <button
                    type="button"
                    data-guide="receipt-no"
                    onClick={() => send({ type: "SELECT_RECEIPT", want: false })}
                    className={`h-[64px] flex-1 rounded-2xl border-[2.5px] border-[#D7E3F0] bg-white text-[18px] font-extrabold text-[#1A1A2E] ${showGuide && guidance.targetId === "receipt-no" ? "kg-target" : ""}`}
                  >
                    받지 않기
                  </button>
                </div>
              </div>
            )}

            {state.phase === "done" && (
              <DoneScreen state={state} scenario={scenario} catalog={catalog} total={total} onRestart={() => { doneRecorded.current = false; send({ type: "RESTART" }); }} />
            )}
          </div>

          {/* 하단 고정 줄: 처음부터 | 주문 확인(메뉴 화면) */}
          {state.phase !== "done" && state.phase !== "intro" && (
            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F4F8FC] px-3 py-2.5">
              <button
                type="button"
                onClick={() => { doneRecorded.current = false; send({ type: "RESTART" }); trackKiosk("kiosk_restart", { scenario: scenario.id }); }}
                className="min-h-[48px] rounded-xl border-[1.5px] border-[#C9D8E8] bg-white px-3.5 text-[14px] font-bold text-[#3D5A78]"
              >
                ⟲ 처음부터
              </button>
              {state.phase === "menu" && (
                <button
                  type="button"
                  data-guide="open-cart"
                  onClick={() => send({ type: "OPEN_CART" })}
                  className={`min-h-[48px] rounded-xl bg-[#1B6FC8] px-5 text-[16px] font-extrabold text-white ${showGuide && guidance.targetId === "open-cart" ? "kg-target" : ""}`}
                >
                  🛒 주문 확인 {state.cart.length > 0 ? `(${state.cart.length}) · ${total.toLocaleString()}원` : ""}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[14px] leading-relaxed text-[#6B7280]">
          천천히 눌러도 괜찮아요. 잘못 눌러도 <strong>이전</strong>이나 <strong>처음부터</strong>로 언제든 되돌릴 수 있어요.
        </p>
      </div>

      <style>{`
        @keyframes kgPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(230,126,63,0.55) } 50% { box-shadow: 0 0 0 7px rgba(230,126,63,0) } }
        .kg-target { outline: 3px solid #E67E3F; outline-offset: 2px; animation: kgPulse 1.4s ease-out infinite; border-radius: 14px; }
        @keyframes kgSpin { to { transform: rotate(360deg) } }
        .kg-spin { animation: kgSpin 0.9s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .kg-target { animation: none } .kg-spin { animation-duration: 1.8s } }
      `}</style>
    </div>
  );
}

// ── 완료 화면: 점수 대신 "무엇을 해냈는지" 과정을 알려준다 ──
function DoneScreen({
  state,
  scenario,
  catalog,
  total,
  onRestart,
}: {
  state: ReturnType<typeof createInitialState>;
  scenario: Scenario;
  catalog: Catalog;
  total: number;
  onRestart: () => void;
}) {
  const checks = evaluateMission(state, scenario, catalog);
  const allPass = checks.length > 0 && checks.every((c) => c.pass);
  const passCount = checks.filter((c) => c.pass).length;

  return (
    <div className="text-center">
      <p className="text-[48px]" aria-hidden="true">🎉</p>
      <h2 className="mt-1 text-[22px] font-extrabold leading-snug text-[#1A1A2E]">
        {scenario.mode === "free" ? "자유 연습을 끝냈어요!" : allPass ? "임무 완수! 정말 잘하셨어요." : "오늘 연습을 완료했어요!"}
      </h2>
      {!allPass && checks.length > 0 && (
        <p className="mt-1.5 text-[15px] text-[#4A5568]">{checks.length}가지 중 {passCount}가지를 해냈어요. 실수해도 괜찮아요 — 다시 해보면 돼요.</p>
      )}

      {/* 임무 점검표 */}
      {checks.length > 0 && (
        <div className="mt-4 rounded-2xl border-[1.5px] border-[#E5E7EB] bg-white p-4 text-left">
          {checks.map((c) => (
            <p key={c.label} className="flex items-start gap-2 py-1 text-[15px] font-bold leading-relaxed">
              <span aria-hidden="true">{c.pass ? "✅" : "🔁"}</span>
              <span className={c.pass ? "text-[#166534]" : "text-[#92400E]"}>
                {c.label}
                {!c.pass && <span className="font-semibold text-[#B45309]"> — 다음에 다시 해봐요</span>}
              </span>
            </p>
          ))}
        </div>
      )}

      {/* 과정 피드백 (실수 복구 등) */}
      {state.achievements.length > 0 && (
        <div className="mt-3 rounded-2xl border border-[#BBD9F5] bg-[#EAF3FC] p-4 text-left">
          {state.achievements.map((a) => (
            <p key={a} className="py-0.5 text-[15px] font-bold text-[#0C447C]">👏 {a}</p>
          ))}
        </div>
      )}

      {/* 주문 요약 */}
      <div className="mt-3 rounded-2xl border-2 border-dashed border-[#C9C7BE] bg-white p-4 text-left">
        <p className="mb-2 text-center text-[14px] font-extrabold text-[#1A1A2E]">🧾 주문 내역 · {catalog.brand} (연습)</p>
        {state.cart.map((it) => {
          const p = catalog.products.find((pp) => pp.id === it.productId)!;
          return (
            <p key={it.uid} className="flex justify-between py-0.5 text-[15px]">
              <span className="text-[#4A5568]">{p.name} × {it.quantity}</span>
              <span className="font-bold text-[#1A1A2E]">{itemPrice(catalog, it).toLocaleString()}원</span>
            </p>
          );
        })}
        <p className="mt-2 flex justify-between border-t border-[#EEECE6] pt-2 text-[16px] font-extrabold">
          <span>합계</span>
          <span className="text-[#1B6FC8]">{total.toLocaleString()}원</span>
        </p>
        <p className="mt-1 text-[13px] text-[#9B9890]">
          {catalog.paymentMethods.find((m) => m.id === state.payMethod)?.label ?? ""} 결제(연습) · 영수증 {state.receiptChoice ? "받음" : "받지 않음"}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <button type="button" onClick={onRestart} className="h-[60px] rounded-2xl bg-[#1B6FC8] text-[18px] font-extrabold text-white">
          🔁 같은 임무 다시 하기
        </button>
        <Link href={`/kiosk/${catalog.kioskType}`} className="flex h-[56px] items-center justify-center rounded-2xl border-2 border-[#BBD9F5] bg-[#EAF3FC] text-[17px] font-bold text-[#1B6FC8] no-underline">
          다른 임무 고르기
        </Link>
        <Link href="/kiosk" className="flex h-[52px] items-center justify-center rounded-2xl border-[1.5px] border-[#E5E7EB] bg-white text-[16px] font-bold text-[#6B7280] no-underline">
          다른 연습 고르기
        </Link>
      </div>
    </div>
  );
}
