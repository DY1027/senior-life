"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";
import { getShoppingProduct } from "@/content/shopping";
import type { ShoppingMission } from "@/lib/shopping/schemas";
import {
  calculateShoppingTotal,
  evaluateBudgetMission,
  evaluateCompareMission,
  evaluateGuidedMission,
  evaluateMistakeMission,
  type ShoppingEvaluation,
} from "@/lib/shopping/evaluator";
import { completeShoppingMission, saveShoppingStep } from "@/lib/shopping/progress";
import { track } from "@/lib/track";
import { AlertIcon, CartIcon, CheckIcon, CompareIcon, SearchIcon } from "./ShoppingIcons";
import { PracticeProductCard } from "./PracticeProductCard";
import styles from "./shopping.module.css";

type RunnerState = {
  step: number;
  searchTerm: string;
  selectedProductId?: string;
  length?: string;
  color?: string;
  quantity: number;
  selectedBudgetIds: string[];
  selectedMistakes: string[];
  hintOpen: boolean;
  feedback?: ShoppingEvaluation;
};

type RunnerAction =
  | { type: "step"; step: number }
  | { type: "search"; value: string }
  | { type: "product"; id: string }
  | { type: "length"; value: string }
  | { type: "color"; value: string }
  | { type: "quantity"; value: number }
  | { type: "toggleBudget"; id: string }
  | { type: "toggleMistake"; id: string }
  | { type: "hint" }
  | { type: "feedback"; value?: ShoppingEvaluation };

function reducer(state: RunnerState, action: RunnerAction): RunnerState {
  switch (action.type) {
    case "step": return { ...state, step: action.step, feedback: undefined, hintOpen: false };
    case "search": return { ...state, searchTerm: action.value };
    case "product": return { ...state, selectedProductId: action.id, feedback: undefined };
    case "length": return { ...state, length: action.value, feedback: undefined };
    case "color": return { ...state, color: action.value, feedback: undefined };
    case "quantity": return { ...state, quantity: Math.max(1, Math.min(9, action.value)), feedback: undefined };
    case "toggleBudget": return { ...state, selectedBudgetIds: state.selectedBudgetIds.includes(action.id) ? state.selectedBudgetIds.filter((id) => id !== action.id) : [...state.selectedBudgetIds, action.id], feedback: undefined };
    case "toggleMistake": return { ...state, selectedMistakes: state.selectedMistakes.includes(action.id) ? state.selectedMistakes.filter((id) => id !== action.id) : [...state.selectedMistakes, action.id], feedback: undefined };
    case "hint": return { ...state, hintOpen: !state.hintOpen };
    case "feedback": return { ...state, feedback: action.value };
  }
}

const initialState: RunnerState = {
  step: 0,
  searchTerm: "충전 케이블",
  quantity: 1,
  selectedBudgetIds: [],
  selectedMistakes: [],
  hintOpen: false,
};

export default function ShoppingPracticeRunner({ mission }: { mission: ShoppingMission }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const products = useMemo(() => mission.productIds.map(getShoppingProduct).filter(Boolean), [mission.productIds]);
  const selectedProduct = state.selectedProductId ? getShoppingProduct(state.selectedProductId) : undefined;
  const maxStep = mission.steps.length - 1;
  const progress = Math.round(((state.step + 1) / mission.steps.length) * 100);

  useEffect(() => {
    saveShoppingStep(mission.slug, state.step);
    if (state.step === 0) track("mission_started", { missionId: mission.slug, mode: mission.mode });
  }, [mission.mode, mission.slug, state.step]);

  function finish(result: ShoppingEvaluation) {
    if (!result.passed) {
      dispatch({ type: "feedback", value: result });
      track("validation_failed", { missionId: mission.slug, ruleType: result.failedRuleIds[0] ?? "unknown" });
      return;
    }
    completeShoppingMission(mission.slug, result);
    track("mission_completed", { missionId: mission.slug, scoreBand: result.score >= 90 ? "high" : "mid" });
    router.push(`/shopping/missions/${mission.slug}/result`);
  }

  function next() {
    if (mission.mode === "guided") {
      const guidedInput = { productId: state.selectedProductId, length: state.length, color: state.color, quantity: state.quantity };
      if (state.step === 1 && !state.selectedProductId) return dispatch({ type: "feedback", value: evaluateGuidedMission(mission, guidedInput) });
      if (state.step === maxStep) return finish(evaluateGuidedMission(mission, guidedInput));
    }
    if (mission.mode === "budget" && state.step === maxStep) return finish(evaluateBudgetMission(mission, state.selectedBudgetIds));
    if (mission.mode === "compare" && state.step === maxStep) return finish(evaluateCompareMission(mission, state.selectedProductId));
    if (mission.mode === "mistake" && state.step === maxStep) return finish(evaluateMistakeMission(mission, state.selectedMistakes));
    dispatch({ type: "step", step: Math.min(maxStep, state.step + 1) });
  }

  return (
    <main className={styles.practicePage}>
      <header className={styles.runnerHeader}>
        <Link href={`/shopping/missions/${mission.slug}`} className={styles.exitLink}>연습 나가기</Link>
        <div className={styles.runnerTitle}>
          <span>{state.step + 1}/{mission.steps.length}</span>
          <strong>{mission.title}</strong>
        </div>
        <span className={styles.noPayment}>실제 결제 없음</span>
      </header>

      <div className={styles.progressTrack} aria-label={`진행률 ${progress}%`}><span style={{ width: `${progress}%` }} /></div>

      <section className={styles.runnerShell} aria-live="polite">
        <div className={styles.stepHeading}>
          <span>현재 단계</span>
          <h1>{mission.steps[state.step]}</h1>
        </div>

        {mission.mode === "guided" && renderGuidedStep()}
        {mission.mode === "budget" && renderBudgetStep()}
        {mission.mode === "compare" && renderCompareStep()}
        {mission.mode === "mistake" && renderMistakeStep()}

        {state.feedback && <FeedbackPanel result={state.feedback} />}
        {state.hintOpen && <div className={styles.hintPanel}><strong>힌트</strong><p>{hintText()}</p></div>}
      </section>

      <footer className={styles.runnerFooter}>
        <button type="button" className={styles.secondaryButton} onClick={() => dispatch({ type: "step", step: Math.max(0, state.step - 1) })} disabled={state.step === 0}>이전</button>
        <button type="button" className={styles.hintButton} onClick={() => { dispatch({ type: "hint" }); track("hint_opened", { missionId: mission.slug, step: state.step }); }}>힌트</button>
        <button type="button" className={styles.primaryButton} onClick={next}>{state.step === maxStep ? "확인하고 완료" : "다음"}</button>
      </footer>
    </main>
  );

  function renderGuidedStep() {
    if (state.step === 0) return (
      <div className={styles.practicePanel}>
        <label className={styles.fieldLabel} htmlFor="shopping-search">어떤 상품을 찾을까요?</label>
        <div className={styles.searchRow}>
          <SearchIcon className={styles.inputIcon} />
          <input id="shopping-search" value={state.searchTerm} onChange={(event) => dispatch({ type: "search", value: event.target.value })} autoComplete="off" />
          <button type="button" onClick={next}>검색</button>
        </div>
        <div className={styles.suggestionBox}><strong>추천 검색어</strong><button type="button" onClick={() => dispatch({ type: "search", value: "C타입 충전 케이블 2m" })}>C타입 충전 케이블 2m</button></div>
      </div>
    );
    if (state.step === 1) return <div className={styles.productGrid}>{products.map((product) => product && <PracticeProductCard key={product.id} product={product} selected={state.selectedProductId === product.id} onSelect={() => dispatch({ type: "product", id: product.id })} />)}</div>;
    if (state.step === 2 && selectedProduct) return (
      <div className={styles.detailGrid}>
        <PracticeProductCard product={selectedProduct} />
        <div className={styles.infoTable}><p>온라인 쇼핑 연습을 위해 만든 가상 상품입니다.</p>{Object.entries(selectedProduct.features).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div>
      </div>
    );
    if (state.step === 3) return (
      <div className={styles.practicePanel}>
        <OptionGroup label="길이 선택" values={["1m", "2m", "3m"]} selected={state.length} onSelect={(value) => dispatch({ type: "length", value })} />
        <OptionGroup label="색상 선택" values={["화이트", "블랙"]} selected={state.color} onSelect={(value) => dispatch({ type: "color", value })} />
        <div className={styles.quantityRow}><span>수량</span><button type="button" onClick={() => dispatch({ type: "quantity", value: state.quantity - 1 })}>−</button><strong>{state.quantity}</strong><button type="button" onClick={() => dispatch({ type: "quantity", value: state.quantity + 1 })}>＋</button></div>
      </div>
    );
    if (state.step === 4 && selectedProduct) return (
      <div className={styles.practicePanel}>
        <div className={styles.cartTitle}><CartIcon /><strong>연습 장바구니</strong></div>
        <PracticeProductCard product={selectedProduct} compact />
        <div className={styles.summaryRows}><div><span>선택한 옵션</span><strong>{state.length ?? "선택 안 함"} / {state.color ?? "선택 안 함"}</strong></div><div><span>수량</span><strong>{state.quantity}개</strong></div><div><span>총 주문금액</span><strong>{((selectedProduct.examplePrice + selectedProduct.shippingFee) * state.quantity).toLocaleString("ko-KR")}원</strong></div></div>
      </div>
    );
    return (
      <div className={styles.practicePanel}>
        <div className={styles.noticeBox}><CheckIcon /><p><strong>마지막으로 확인해요</strong> 실제 주문이나 결제가 이루어지지 않는 연습 화면입니다.</p></div>
        <ReviewChecklist items={[`상품: ${selectedProduct?.title ?? "선택 안 함"}`, `옵션: ${state.length ?? "미선택"} / ${state.color ?? "미선택"}`, `수량: ${state.quantity}개`, `배송비: ${(selectedProduct?.shippingFee ?? 0).toLocaleString("ko-KR")}원`]} />
      </div>
    );
  }

  function renderBudgetStep() {
    const total = calculateShoppingTotal(state.selectedBudgetIds);
    const remaining = (mission.budget ?? 0) - total;
    if (state.step === 0) return <MissionBrief title="3만 원 안에서 필요한 것을 골라요" bullets={["우산 또는 우비", "제습용품", "미끄럼방지용품"]} note="방수 신발 덮개는 남은 예산이 있을 때 고르는 선택 품목이에요." />;
    if (state.step === 1) return (
      <>
        <BudgetMeter budget={mission.budget ?? 0} total={total} />
        <div className={styles.productGrid}>{products.map((product) => product && <PracticeProductCard key={product.id} product={product} selected={state.selectedBudgetIds.includes(product.id)} onSelect={() => dispatch({ type: "toggleBudget", id: product.id })} />)}</div>
      </>
    );
    if (state.step === 2) return (
      <div className={styles.practicePanel}>
        <div className={styles.cartTitle}><CartIcon /><strong>장바구니 확인</strong></div>
        {state.selectedBudgetIds.length === 0 ? <p className={styles.emptyText}>아직 고른 상품이 없어요. 이전 화면에서 필요한 상품을 골라주세요.</p> : state.selectedBudgetIds.map((id) => { const product = getShoppingProduct(id); return product ? <PracticeProductCard key={id} product={product} compact /> : null; })}
        <BudgetMeter budget={mission.budget ?? 0} total={total} />
      </div>
    );
    return <div className={styles.practicePanel}><div className={remaining >= 0 ? styles.successBox : styles.warningBox}><strong>{remaining >= 0 ? "예산 안에 들어왔어요" : "예산을 넘었어요"}</strong><span>총 {total.toLocaleString("ko-KR")}원 · {remaining >= 0 ? `남은 예산 ${remaining.toLocaleString("ko-KR")}원` : `${Math.abs(remaining).toLocaleString("ko-KR")}원 줄이기`}</span></div><ReviewChecklist items={state.selectedBudgetIds.map((id) => getShoppingProduct(id)?.title ?? id)} /></div>;
  }

  function renderCompareStep() {
    if (state.step === 0) return <MissionBrief title="다음 조건을 모두 만족하는 상품을 골라요" bullets={["C타입 단자", "길이 2m 이상", "총비용 15,000원 이하", "필요한 수량은 1개"]} />;
    if (state.step === 1) return <div className={styles.compareGrid}>{products.map((product) => product && <div key={product.id}><PracticeProductCard product={product} selected={state.selectedProductId === product.id} onSelect={() => dispatch({ type: "product", id: product.id })} /><div className={styles.infoTable}>{Object.entries(product.features).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}<div><span>총비용</span><strong>{(product.examplePrice + product.shippingFee).toLocaleString("ko-KR")}원</strong></div></div></div>)}</div>;
    return <div className={styles.practicePanel}><div className={styles.cartTitle}><CompareIcon /><strong>선택한 상품 확인</strong></div>{selectedProduct ? <PracticeProductCard product={selectedProduct} /> : <p className={styles.emptyText}>이전 화면에서 상품 하나를 골라주세요.</p>}</div>;
  }

  function renderMistakeStep() {
    if (state.step === 0) return <MissionBrief title="원래 주문하려던 조건" bullets={["C타입 케이블 2m", "화이트", "수량 1개", "한 번만 구매"]} note="다음 화면의 주문 내용에서 잘못된 곳을 모두 찾아보세요." />;
    if (state.step === 1) return (
      <div className={styles.practicePanel}>
        <div className={styles.fakeOrder}><span>주문 상품</span><strong>C타입 케이블 2m (화이트)</strong><span>수량</span><strong className={styles.dangerText}>2개</strong><span>구매 방식</span><strong className={styles.dangerText}>매달 정기배송</strong><span>예상 금액</span><strong>13,800원</strong></div>
        <fieldset className={styles.checkboxGroup}><legend>잘못된 곳을 눌러주세요</legend><CheckChoice id="quantity" label="수량" checked={state.selectedMistakes.includes("quantity")} onChange={() => dispatch({ type: "toggleMistake", id: "quantity" })} /><CheckChoice id="subscription" label="정기배송 선택" checked={state.selectedMistakes.includes("subscription")} onChange={() => dispatch({ type: "toggleMistake", id: "subscription" })} /><CheckChoice id="product" label="상품 이름" checked={state.selectedMistakes.includes("product")} onChange={() => dispatch({ type: "toggleMistake", id: "product" })} /></fieldset>
      </div>
    );
    return <div className={styles.practicePanel}><div className={styles.noticeBox}><CheckIcon /><p><strong>바르게 고치면</strong> 수량은 1개, 구매 방식은 한 번 구매가 됩니다.</p></div><div className={styles.smsSafety}><AlertIcon /><div><strong>배송 지연 문자에 링크가 있다면?</strong><p>문자 링크를 누르지 말고 쇼핑몰 공식 앱의 주문내역에서 직접 확인하세요.</p></div></div></div>;
  }

  function hintText() {
    if (mission.mode === "guided") return "상품 이름보다 단자, 길이, 수량과 배송비를 순서대로 확인해 보세요.";
    if (mission.mode === "budget") return "필수 품목 세 가지를 먼저 담은 뒤 남은 예산으로 선택 품목을 결정해 보세요.";
    if (mission.mode === "compare") return "가격과 배송비를 더한 총비용, 단자, 길이와 묶음 수량을 함께 보세요.";
    return "원래 원한 조건과 주문 화면의 수량·구매 방식을 한 줄씩 비교해 보세요.";
  }
}

function OptionGroup({ label, values, selected, onSelect }: { label: string; values: string[]; selected?: string; onSelect: (value: string) => void }) {
  return <fieldset className={styles.optionGroup}><legend>{label}</legend><div>{values.map((value) => <button type="button" key={value} aria-pressed={selected === value} className={selected === value ? styles.optionSelected : ""} onClick={() => onSelect(value)}>{selected === value && "✓ "}{value}</button>)}</div></fieldset>;
}

function MissionBrief({ title, bullets, note }: { title: string; bullets: string[]; note?: string }) {
  return <div className={styles.practicePanel}><h2 className={styles.panelTitle}>{title}</h2><ul className={styles.briefList}>{bullets.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>{note && <p className={styles.noteText}>{note}</p>}</div>;
}

function BudgetMeter({ budget, total }: { budget: number; total: number }) {
  const percent = Math.min(100, Math.round((total / budget) * 100));
  const over = total > budget;
  return <div className={`${styles.budgetMeter} ${over ? styles.budgetOver : ""}`}><div><span>현재 합계</span><strong>{total.toLocaleString("ko-KR")}원</strong><span>예산 {budget.toLocaleString("ko-KR")}원</span></div><div className={styles.budgetTrack}><span style={{ width: `${percent}%` }} /></div><p>{over ? `${(total - budget).toLocaleString("ko-KR")}원을 줄여야 해요.` : `${(budget - total).toLocaleString("ko-KR")}원이 남았어요.`}</p></div>;
}

function ReviewChecklist({ items }: { items: string[] }) {
  return <ul className={styles.reviewList}>{items.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>;
}

function CheckChoice({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return <label className={checked ? styles.checkChoiceSelected : styles.checkChoice}><input id={`mistake-${id}`} type="checkbox" checked={checked} onChange={onChange} /><span>{checked ? "✓ " : ""}{label}</span></label>;
}

function FeedbackPanel({ result }: { result: ShoppingEvaluation }) {
  return <div className={styles.feedbackPanel} role="alert"><AlertIcon /><div>{result.feedback.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.description}</p></div>)}</div></div>;
}
