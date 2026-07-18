"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { getShoppingProduct } from "@/content/shopping";
import type { ShoppingMission } from "@/lib/shopping/schemas";
import {
  calculateShoppingTotal,
  evaluateBudgetMission,
  evaluateCompareMission,
  evaluateGuidedMission,
  evaluateMistakeMission,
  getComparisonCriteria,
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
  connector?: string;
  length?: string;
  quantity: number;
  detailChecks: string[];
  quantityConfirmed: boolean;
  cartAdded: boolean;
  reviewChecks: string[];
  selectedBudgetIds: string[];
  selectedMistakes: string[];
  mistakeLength: string;
  mistakeQuantity: number;
  mistakePurchaseType: "one-time" | "subscription";
  mistakeShippingFee: number;
  hintOpen: boolean;
  stepNotice?: { title: string; description: string };
  feedback?: ShoppingEvaluation;
};

type RunnerAction =
  | { type: "restore"; value: RunnerState }
  | { type: "step"; step: number }
  | { type: "search"; value: string }
  | { type: "product"; id: string }
  | { type: "connector"; value: string }
  | { type: "length"; value: string }
  | { type: "quantity"; value: number }
  | { type: "toggleDetail"; id: string }
  | { type: "confirmQuantity" }
  | { type: "addCart" }
  | { type: "toggleReview"; id: string }
  | { type: "toggleBudget"; id: string }
  | { type: "toggleMistake"; id: string }
  | { type: "mistakeLength"; value: string }
  | { type: "mistakeQuantity"; value: number }
  | { type: "mistakePurchaseType"; value: "one-time" | "subscription" }
  | { type: "mistakeShippingFee"; value: number }
  | { type: "hint" }
  | { type: "stepNotice"; value?: { title: string; description: string } }
  | { type: "feedback"; value?: ShoppingEvaluation };

function reducer(state: RunnerState, action: RunnerAction): RunnerState {
  switch (action.type) {
    case "restore": return action.value;
    case "step": return { ...state, step: action.step, feedback: undefined, stepNotice: undefined, hintOpen: false };
    case "search": return { ...state, searchTerm: action.value, stepNotice: undefined };
    case "product": return { ...state, selectedProductId: action.id, connector: undefined, length: undefined, quantity: 1, detailChecks: [], quantityConfirmed: false, cartAdded: false, reviewChecks: [], feedback: undefined, stepNotice: undefined };
    case "connector": return { ...state, connector: action.value, cartAdded: false, reviewChecks: [], feedback: undefined, stepNotice: undefined };
    case "length": return { ...state, length: action.value, cartAdded: false, reviewChecks: [], feedback: undefined, stepNotice: undefined };
    case "quantity": return { ...state, quantity: Math.max(1, Math.min(9, action.value)), quantityConfirmed: false, cartAdded: false, reviewChecks: [], feedback: undefined, stepNotice: undefined };
    case "toggleDetail": return { ...state, detailChecks: state.detailChecks.includes(action.id) ? state.detailChecks.filter((id) => id !== action.id) : [...state.detailChecks, action.id], stepNotice: undefined };
    case "confirmQuantity": return { ...state, quantityConfirmed: true, cartAdded: false, reviewChecks: [], stepNotice: undefined };
    case "addCart": return { ...state, cartAdded: true, reviewChecks: [], stepNotice: undefined };
    case "toggleReview": return { ...state, reviewChecks: state.reviewChecks.includes(action.id) ? state.reviewChecks.filter((id) => id !== action.id) : [...state.reviewChecks, action.id], stepNotice: undefined };
    case "toggleBudget": return { ...state, selectedBudgetIds: state.selectedBudgetIds.includes(action.id) ? state.selectedBudgetIds.filter((id) => id !== action.id) : [...state.selectedBudgetIds, action.id], feedback: undefined };
    case "toggleMistake": return { ...state, selectedMistakes: state.selectedMistakes.includes(action.id) ? state.selectedMistakes.filter((id) => id !== action.id) : [...state.selectedMistakes, action.id], feedback: undefined };
    case "mistakeLength": return { ...state, mistakeLength: action.value, feedback: undefined, stepNotice: undefined };
    case "mistakeQuantity": return { ...state, mistakeQuantity: Math.max(1, Math.min(9, action.value)), feedback: undefined, stepNotice: undefined };
    case "mistakePurchaseType": return { ...state, mistakePurchaseType: action.value, feedback: undefined, stepNotice: undefined };
    case "mistakeShippingFee": return { ...state, mistakeShippingFee: action.value, feedback: undefined, stepNotice: undefined };
    case "hint": return { ...state, hintOpen: !state.hintOpen };
    case "stepNotice": return { ...state, stepNotice: action.value };
    case "feedback": return { ...state, feedback: action.value };
  }
}

const initialState: RunnerState = {
  step: 0,
  searchTerm: "충전 케이블",
  quantity: 1,
  detailChecks: [],
  quantityConfirmed: false,
  cartAdded: false,
  reviewChecks: [],
  selectedBudgetIds: [],
  selectedMistakes: [],
  mistakeLength: "1m",
  mistakeQuantity: 2,
  mistakePurchaseType: "subscription",
  mistakeShippingFee: 3000,
  hintOpen: false,
};

const RUNNER_DRAFT_PREFIX = "dd-shopping-runner-draft-v1:";

function readRunnerDraft(missionSlug: string): RunnerState | undefined {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${RUNNER_DRAFT_PREFIX}${missionSlug}`) ?? "null") as Partial<RunnerState> | null;
    if (!parsed || typeof parsed.step !== "number") return undefined;
    return {
      ...initialState,
      ...parsed,
      detailChecks: Array.isArray(parsed.detailChecks) ? parsed.detailChecks : [],
      reviewChecks: Array.isArray(parsed.reviewChecks) ? parsed.reviewChecks : [],
      selectedBudgetIds: Array.isArray(parsed.selectedBudgetIds) ? parsed.selectedBudgetIds : [],
      selectedMistakes: Array.isArray(parsed.selectedMistakes) ? parsed.selectedMistakes : [],
    };
  } catch {
    return undefined;
  }
}

function writeRunnerDraft(missionSlug: string, state: RunnerState) {
  try {
    localStorage.setItem(`${RUNNER_DRAFT_PREFIX}${missionSlug}`, JSON.stringify(state));
  } catch {
    // 저장이 막혀도 현재 연습은 계속한다.
  }
}

function clearRunnerDraft(missionSlug: string) {
  try {
    localStorage.removeItem(`${RUNNER_DRAFT_PREFIX}${missionSlug}`);
  } catch {
    // 저장소를 사용할 수 없어도 완료 화면으로 이동한다.
  }
}

export default function ShoppingPracticeRunner({ mission }: { mission: ShoppingMission }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const skipNextDraftWrite = useRef(true);
  const skipNextProgressWrite = useRef(true);
  const products = useMemo(() => mission.productIds.map(getShoppingProduct).filter(Boolean), [mission.productIds]);
  const selectedProduct = state.selectedProductId ? getShoppingProduct(state.selectedProductId) : undefined;
  const maxStep = mission.steps.length - 1;
  const progress = Math.round(((state.step + 1) / mission.steps.length) * 100);

  useEffect(() => {
    skipNextDraftWrite.current = true;
    skipNextProgressWrite.current = true;
    const draft = readRunnerDraft(mission.slug);
    if (draft) dispatch({ type: "restore", value: { ...draft, step: Math.max(0, Math.min(maxStep, draft.step)) } });
    else {
      skipNextDraftWrite.current = false;
      skipNextProgressWrite.current = false;
    }
  }, [maxStep, mission.slug]);

  useEffect(() => {
    if (skipNextDraftWrite.current) {
      skipNextDraftWrite.current = false;
      return;
    }
    writeRunnerDraft(mission.slug, state);
  }, [mission.slug, state]);

  useEffect(() => {
    if (skipNextProgressWrite.current) {
      skipNextProgressWrite.current = false;
      return;
    }
    saveShoppingStep(mission.slug, state.step);
    if (state.step === 0) track("mission_started", { missionId: mission.slug, mode: mission.mode });
  }, [mission.mode, mission.slug, state.step]);

  function finish(result: ShoppingEvaluation) {
    if (!result.passed) {
      dispatch({ type: "feedback", value: result });
      track("validation_failed", { missionId: mission.slug, ruleType: result.failedRuleIds[0] ?? "unknown" });
      return;
    }
    clearRunnerDraft(mission.slug);
    completeShoppingMission(mission.slug, result);
    track("mission_completed", { missionId: mission.slug, scoreBand: result.score >= 90 ? "high" : "mid" });
    router.push(`/shopping/missions/${mission.slug}/result`);
  }

  function next() {
    if (mission.mode === "guided") {
      const guidedInput = {
        productId: state.selectedProductId,
        connector: state.connector,
        length: state.length,
        quantity: state.quantity,
        detailConfirmed: ["connector", "shipping"].every((id) => state.detailChecks.includes(id)),
        cartAdded: state.cartAdded,
        reviewConfirmed: ["product", "options", "quantity", "total"].every((id) => state.reviewChecks.includes(id)),
      };
      const compactSearch = state.searchTerm.replace(/\s/g, "");
      if (state.step === 0 && (!compactSearch.includes("C타입") || !compactSearch.includes("케이블"))) return showStepNotice("검색어를 조금 더 자세히 써요", "‘C타입 충전 케이블’처럼 단자와 상품 종류를 함께 입력해 주세요.");
      if (state.step === 1 && !state.selectedProductId) return showStepNotice("상품을 하나 골라주세요", "검색 결과에서 상세정보를 확인할 상품을 눌러주세요.");
      if (state.step === 2 && !guidedInput.detailConfirmed) return showStepNotice("상세정보 두 곳을 확인해요", "단자와 배송비를 확인했다는 칸을 모두 눌러주세요.");
      if (state.step === 3 && !state.connector) return showStepNotice("단자를 선택해 주세요", "내 기기에 맞는 케이블 단자를 하나 골라주세요.");
      if (state.step === 4 && !state.length) return showStepNotice("길이를 선택해 주세요", "사용할 장소를 생각하고 케이블 길이를 하나 골라주세요.");
      if (state.step === 5 && !state.quantityConfirmed) return showStepNotice("수량을 확인해 주세요", "수량을 맞춘 뒤 ‘수량 확인했어요’ 버튼을 눌러주세요.");
      if (state.step === 6 && !state.cartAdded) return showStepNotice("장바구니에 담아주세요", "선택한 상품과 옵션을 확인한 뒤 담기 버튼을 눌러주세요.");
      if (state.step === maxStep && !guidedInput.reviewConfirmed) return showStepNotice("주문 내용을 모두 확인해요", "상품, 옵션, 수량, 배송비 포함 총액 네 곳을 모두 확인해 주세요.");
      if (state.step === maxStep) return finish(evaluateGuidedMission(mission, guidedInput));
    }
    if (mission.mode === "budget" && state.step === maxStep) return finish(evaluateBudgetMission(mission, state.selectedBudgetIds));
    if (mission.mode === "compare") {
      if (state.step === 1 && !state.selectedProductId) return showStepNotice("상품을 하나 골라주세요", "단자, 길이, 구성 수량과 총비용을 비교한 뒤 상품 하나를 눌러주세요.");
      if (state.step === maxStep) return finish(evaluateCompareMission(mission, state.selectedProductId));
    }
    if (mission.mode === "mistake" && state.step === maxStep) return finish(evaluateMistakeMission(mission, {
      selectedMistakes: state.selectedMistakes,
      length: state.mistakeLength,
      quantity: state.mistakeQuantity,
      purchaseType: state.mistakePurchaseType,
      shippingFee: state.mistakeShippingFee,
    }));
    dispatch({ type: "step", step: Math.min(maxStep, state.step + 1) });
  }

  function showStepNotice(title: string, description: string) {
    dispatch({ type: "stepNotice", value: { title, description } });
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

        {state.stepNotice && <StepNotice title={state.stepNotice.title} description={state.stepNotice.description} />}
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
        <div>
          <div className={styles.infoTable}><p>온라인 쇼핑 연습을 위해 만든 가상 상품입니다.</p>{Object.entries(selectedProduct.features).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}<div><span>배송비</span><strong>{selectedProduct.shippingFee.toLocaleString("ko-KR")}원</strong></div></div>
          <fieldset className={styles.checkboxGroup}>
            <legend>확인한 상세정보를 눌러주세요</legend>
            <CheckChoice id="detail-connector" label="단자를 확인했어요" checked={state.detailChecks.includes("connector")} onChange={() => dispatch({ type: "toggleDetail", id: "connector" })} />
            <CheckChoice id="detail-shipping" label="배송비를 확인했어요" checked={state.detailChecks.includes("shipping")} onChange={() => dispatch({ type: "toggleDetail", id: "shipping" })} />
          </fieldset>
        </div>
      </div>
    );
    if (state.step === 3) return (
      <div className={styles.practicePanel}>
        <p className={styles.noteText}>케이블 양쪽 끝의 모양이 내 기기와 충전기에 맞아야 해요.</p>
        <OptionGroup label="단자 선택" values={["C타입-C타입", "USB-A-C타입", "8핀-USB"]} selected={state.connector} onSelect={(value) => dispatch({ type: "connector", value })} />
      </div>
    );
    if (state.step === 4) return (
      <div className={styles.practicePanel}>
        <p className={styles.noteText}>침대나 소파처럼 충전기에서 거리가 있는 곳에서는 길이도 확인해요.</p>
        <OptionGroup label="길이 선택" values={["1m", "2m", "3m"]} selected={state.length} onSelect={(value) => dispatch({ type: "length", value })} />
      </div>
    );
    if (state.step === 5) return (
      <div className={styles.practicePanel}>
        <div className={styles.quantityRow}><span>수량</span><button type="button" aria-label="수량 줄이기" onClick={() => dispatch({ type: "quantity", value: state.quantity - 1 })}>−</button><strong>{state.quantity}개</strong><button type="button" aria-label="수량 늘리기" onClick={() => dispatch({ type: "quantity", value: state.quantity + 1 })}>＋</button></div>
        <button type="button" className={state.quantityConfirmed ? styles.confirmButtonDone : styles.confirmButton} aria-pressed={state.quantityConfirmed} onClick={() => dispatch({ type: "confirmQuantity" })}>{state.quantityConfirmed ? "✓ 수량 확인 완료" : `수량 ${state.quantity}개 확인했어요`}</button>
      </div>
    );
    if (state.step === 6 && selectedProduct) return (
      <div className={styles.practicePanel}>
        <div className={styles.cartTitle}><CartIcon /><strong>연습 장바구니</strong></div>
        <PracticeProductCard product={selectedProduct} compact />
        <div className={styles.summaryRows}><div><span>단자</span><strong>{state.connector ?? "선택 안 함"}</strong></div><div><span>길이</span><strong>{state.length ?? "선택 안 함"}</strong></div><div><span>수량</span><strong>{state.quantity}개</strong></div></div>
        <button type="button" className={state.cartAdded ? styles.confirmButtonDone : styles.primaryPanelButton} aria-pressed={state.cartAdded} onClick={() => dispatch({ type: "addCart" })}>{state.cartAdded ? "✓ 장바구니에 담았어요" : "장바구니에 담아보기"}</button>
      </div>
    );
    if (state.step === 7 && selectedProduct) {
      const productSubtotal = selectedProduct.examplePrice * state.quantity;
      const total = productSubtotal + selectedProduct.shippingFee;
      return (
        <div className={styles.practicePanel}>
          <div className={styles.cartTitle}><CartIcon /><strong>배송비 포함 총액</strong></div>
          <div className={styles.totalBreakdown}>
            <div><span>상품 금액</span><strong>{selectedProduct.examplePrice.toLocaleString("ko-KR")}원 × {state.quantity}개</strong></div>
            <div><span>상품 소계</span><strong>{productSubtotal.toLocaleString("ko-KR")}원</strong></div>
            <div><span>배송비</span><strong>{selectedProduct.shippingFee.toLocaleString("ko-KR")}원</strong></div>
            <div className={styles.totalRow}><span>배송비 포함 총액</span><strong>{total.toLocaleString("ko-KR")}원</strong></div>
          </div>
          <p className={styles.noteText}>배송비는 상품 수량과 따로 한 번만 더했어요.</p>
        </div>
      );
    }
    const productSubtotal = (selectedProduct?.examplePrice ?? 0) * state.quantity;
    const total = productSubtotal + (selectedProduct?.shippingFee ?? 0);
    return (
      <div className={styles.practicePanel}>
        <div className={styles.noticeBox}><CheckIcon /><p><strong>마지막으로 확인해요</strong> 실제 주문이나 결제가 이루어지지 않는 연습 화면입니다.</p></div>
        <div className={styles.summaryRows}><div><span>상품</span><strong>{selectedProduct?.title ?? "선택 안 함"}</strong></div><div><span>단자 · 길이</span><strong>{state.connector ?? "미선택"} · {state.length ?? "미선택"}</strong></div><div><span>수량</span><strong>{state.quantity}개</strong></div><div><span>상품 소계</span><strong>{productSubtotal.toLocaleString("ko-KR")}원</strong></div><div><span>배송비</span><strong>{(selectedProduct?.shippingFee ?? 0).toLocaleString("ko-KR")}원</strong></div><div><span>배송비 포함 총액</span><strong>{total.toLocaleString("ko-KR")}원</strong></div></div>
        <fieldset className={styles.checkboxGroup}>
          <legend>확인한 내용을 모두 눌러주세요</legend>
          <CheckChoice id="review-product" label="상품을 확인했어요" checked={state.reviewChecks.includes("product")} onChange={() => dispatch({ type: "toggleReview", id: "product" })} />
          <CheckChoice id="review-options" label="단자와 길이를 확인했어요" checked={state.reviewChecks.includes("options")} onChange={() => dispatch({ type: "toggleReview", id: "options" })} />
          <CheckChoice id="review-quantity" label="수량을 확인했어요" checked={state.reviewChecks.includes("quantity")} onChange={() => dispatch({ type: "toggleReview", id: "quantity" })} />
          <CheckChoice id="review-total" label="배송비 포함 총액을 확인했어요" checked={state.reviewChecks.includes("total")} onChange={() => dispatch({ type: "toggleReview", id: "total" })} />
        </fieldset>
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
    if (state.step === 1) return (
      <div className={styles.compareGrid}>
        {products.map((product) => product && (
          <div key={product.id}>
            <PracticeProductCard testId={`compare-product-${product.id}`} product={product} selected={state.selectedProductId === product.id} onSelect={() => dispatch({ type: "product", id: product.id })} />
            <div className={styles.infoTable}>
              {Object.entries(product.features).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}
              <div><span>상품 가격</span><strong>{product.examplePrice.toLocaleString("ko-KR")}원</strong></div>
              <div><span>배송비</span><strong>{product.shippingFee.toLocaleString("ko-KR")}원</strong></div>
              <div><span>배송비 포함 총비용</span><strong>{(product.examplePrice + product.shippingFee).toLocaleString("ko-KR")}원</strong></div>
            </div>
          </div>
        ))}
      </div>
    );
    const criteria = getComparisonCriteria(state.selectedProductId);
    return (
      <div data-testid="comparison-review" className={styles.practicePanel}>
        <div className={styles.cartTitle}><CompareIcon /><strong>조건을 하나씩 대조해요</strong></div>
        {selectedProduct ? <PracticeProductCard product={selectedProduct} compact /> : <p className={styles.emptyText}>이전 화면에서 상품 하나를 골라주세요.</p>}
        <ul className={styles.comparisonCriteria} aria-label="상품 비교 결과">
          {criteria.map((criterion) => (
            <li key={criterion.id} data-testid={`comparison-criterion-${criterion.id}`} className={criterion.passed ? styles.criterionPassed : styles.criterionFailed}>
              <span>{criterion.passed ? "✓ 맞음" : "! 다시 확인"}</span>
              <div><strong>{criterion.label}</strong><p>선택: {criterion.actual} · 조건: {criterion.expected}</p></div>
            </li>
          ))}
        </ul>
        <p className={styles.noteText}>아래 ‘확인하고 완료’를 누르면 조건이 다른 부분을 정확히 알려드려요. 틀려도 이전 화면으로 돌아가 다시 고를 수 있어요.</p>
      </div>
    );
  }

  function renderMistakeStep() {
    if (state.step === 0) return <MissionBrief title="원래 주문하려던 조건" bullets={["C타입-C타입 케이블", "길이 2m · 화이트", "수량 1개", "한 번만 구매", "무료배송"]} note="다음 화면의 주문 내용에서 잘못된 곳을 모두 찾아보세요." />;
    if (state.step === 1) return (
      <div className={styles.practicePanel}>
        <div className={styles.fakeOrder} data-testid="mistake-order-preview"><span>주문 상품</span><strong>C타입-C타입 케이블 (화이트)</strong><span>길이 옵션</span><strong className={styles.dangerText}>1m</strong><span>수량</span><strong className={styles.dangerText}>2개</strong><span>구매 방식</span><strong className={styles.dangerText}>매달 정기배송</strong><span>상품 금액</span><strong>13,800원</strong><span>배송비</span><strong className={styles.dangerText}>3,000원</strong><span>배송비 포함 총액</span><strong>16,800원</strong></div>
        <fieldset className={styles.checkboxGroup}><legend>잘못된 곳을 모두 눌러주세요</legend><CheckChoice id="option" label="길이 옵션" checked={state.selectedMistakes.includes("option")} onChange={() => dispatch({ type: "toggleMistake", id: "option" })} /><CheckChoice id="quantity" label="수량" checked={state.selectedMistakes.includes("quantity")} onChange={() => dispatch({ type: "toggleMistake", id: "quantity" })} /><CheckChoice id="subscription" label="정기배송 선택" checked={state.selectedMistakes.includes("subscription")} onChange={() => dispatch({ type: "toggleMistake", id: "subscription" })} /><CheckChoice id="shipping" label="배송비" checked={state.selectedMistakes.includes("shipping")} onChange={() => dispatch({ type: "toggleMistake", id: "shipping" })} /><CheckChoice id="product" label="상품 이름" checked={state.selectedMistakes.includes("product")} onChange={() => dispatch({ type: "toggleMistake", id: "product" })} /></fieldset>
      </div>
    );
    const correctedTotal = 6900 * state.mistakeQuantity + state.mistakeShippingFee;
    const correctionRows = [
      { id: "length", label: "길이", value: state.mistakeLength, correct: state.mistakeLength === "2m" },
      { id: "quantity", label: "수량", value: `${state.mistakeQuantity}개`, correct: state.mistakeQuantity === 1 },
      { id: "purchase", label: "구매 방식", value: state.mistakePurchaseType === "one-time" ? "한 번 구매" : "매달 정기배송", correct: state.mistakePurchaseType === "one-time" },
      { id: "shipping", label: "배송비", value: `${state.mistakeShippingFee.toLocaleString("ko-KR")}원`, correct: state.mistakeShippingFee === 0 },
    ];
    return (
      <div className={styles.practicePanel} data-testid="mistake-correction-panel">
        <div className={styles.noticeBox}><CheckIcon /><p><strong>찾은 실수를 직접 고쳐보세요.</strong> 네 가지 값이 모두 원래 주문 조건과 같아야 완료할 수 있어요.</p></div>
        <OptionGroup label="길이 옵션 고치기" values={["1m", "2m", "3m"]} selected={state.mistakeLength} onSelect={(value) => dispatch({ type: "mistakeLength", value })} />
        <div className={styles.mistakeCorrectionBlock}>
          <strong>수량 고치기</strong>
          <div className={styles.quantityRow}><span>수량</span><button type="button" aria-label="실수 주문 수량 줄이기" onClick={() => dispatch({ type: "mistakeQuantity", value: state.mistakeQuantity - 1 })}>−</button><strong>{state.mistakeQuantity}개</strong><button type="button" aria-label="실수 주문 수량 늘리기" onClick={() => dispatch({ type: "mistakeQuantity", value: state.mistakeQuantity + 1 })}>＋</button></div>
        </div>
        <OptionGroup label="구매 방식 고치기" values={["한 번 구매", "매달 정기배송"]} selected={state.mistakePurchaseType === "one-time" ? "한 번 구매" : "매달 정기배송"} onSelect={(value) => dispatch({ type: "mistakePurchaseType", value: value === "한 번 구매" ? "one-time" : "subscription" })} />
        <div className={styles.mistakeCorrectionBlock}>
          <strong>배송비 다시 확인하기</strong>
          <p>실제 쇼핑에서는 배송비 숫자를 직접 고치지 않고, 무료배송 상품과 조건을 다시 선택해요.</p>
          <button type="button" data-testid="fix-mistake-shipping" className={state.mistakeShippingFee === 0 ? styles.confirmButtonDone : styles.confirmButton} aria-pressed={state.mistakeShippingFee === 0} onClick={() => dispatch({ type: "mistakeShippingFee", value: 0 })}>{state.mistakeShippingFee === 0 ? "✓ 무료배송 조건 확인 완료" : "무료배송 상품으로 다시 확인"}</button>
        </div>
        <div className={styles.correctionStatus} aria-label="고친 주문 내용">
          {correctionRows.map((row) => <div key={row.id} data-testid={`mistake-status-${row.id}`}><span>{row.label}</span><strong>{row.value}</strong><em className={row.correct ? styles.statusCorrect : styles.statusCheck}>{row.correct ? "맞게 고침" : "다시 확인"}</em></div>)}
          <div className={styles.correctionTotal}><span>배송비 포함 총액</span><strong>{correctedTotal.toLocaleString("ko-KR")}원</strong></div>
        </div>
        <div className={styles.smsSafety}><AlertIcon /><div><strong>배송 지연 문자에 링크가 있다면?</strong><p>문자 링크를 누르지 말고 쇼핑몰 공식 앱의 주문내역에서 직접 확인하세요.</p></div></div>
      </div>
    );
  }

  function hintText() {
    if (mission.mode === "guided") return "상품 이름보다 단자, 길이, 수량과 배송비를 순서대로 확인해 보세요.";
    if (mission.mode === "budget") return "필수 품목 세 가지를 먼저 담은 뒤 남은 예산으로 선택 품목을 결정해 보세요.";
    if (mission.mode === "compare") return "가격과 배송비를 더한 총비용, 단자, 길이와 묶음 수량을 함께 보세요.";
    return "원래 원한 조건과 주문 화면의 옵션·수량·구매 방식·배송비를 한 줄씩 비교해 보세요.";
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

function StepNotice({ title, description }: { title: string; description: string }) {
  return <div className={styles.feedbackPanel} role="alert"><AlertIcon /><div><strong>{title}</strong><p>{description}</p></div></div>;
}

function FeedbackPanel({ result }: { result: ShoppingEvaluation }) {
  return <div data-testid="shopping-feedback" className={styles.feedbackPanel} role="alert"><AlertIcon /><div>{result.feedback.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.description}</p></div>)}</div></div>;
}
