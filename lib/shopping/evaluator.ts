import { getShoppingProduct, type ShoppingCollectionSlug } from "@/content/shopping";
import type { ShoppingMission } from "@/lib/shopping/schemas";

export type ShoppingFeedback = {
  level: "good" | "check" | "info";
  title: string;
  description: string;
};

export type ShoppingEvaluation = {
  passed: boolean;
  totalPrice: number;
  remainingBudget?: number;
  score: number;
  satisfiedRuleIds: string[];
  failedRuleIds: string[];
  feedback: ShoppingFeedback[];
  collectionSlug: ShoppingCollectionSlug;
};

export type ComparisonCriterion = {
  id: "selection" | "connector" | "length" | "bundle" | "total";
  label: string;
  expected: string;
  actual: string;
  passed: boolean;
};

export function calculateShoppingTotal(productIds: string[]) {
  return productIds.reduce((total, id) => {
    const product = getShoppingProduct(id);
    return product ? total + product.examplePrice + product.shippingFee : total;
  }, 0);
}

export type GuidedMissionInput = {
  productId?: string;
  connector?: string;
  length?: string;
  quantity: number;
  detailConfirmed: boolean;
  cartAdded: boolean;
  reviewConfirmed: boolean;
};

export function evaluateGuidedMission(mission: ShoppingMission, input: GuidedMissionInput): ShoppingEvaluation {
  const checks = {
    product: input.productId === mission.correctProductId,
    connector: input.connector === "C타입-C타입",
    length: input.length === "2m",
    quantity: input.quantity === 1,
    detail: input.detailConfirmed,
    cart: input.cartAdded,
    review: input.reviewConfirmed,
  };
  const failedRuleIds = Object.entries(checks).filter(([, passed]) => !passed).map(([id]) => id);
  const product = input.productId ? getShoppingProduct(input.productId) : undefined;
  const totalPrice = product ? product.examplePrice * input.quantity + product.shippingFee : 0;
  const feedback: ShoppingFeedback[] = [];
  if (!checks.product) feedback.push({ level: "check", title: "상품을 다시 비교해요", description: "이번 연습 조건은 C타입-C타입 단자, 길이 2m인 단품이에요." });
  if (!checks.connector) feedback.push({ level: "check", title: "단자가 달라요", description: "단자 선택 화면으로 돌아가 C타입-C타입을 골라주세요." });
  if (!checks.length) feedback.push({ level: "check", title: "길이는 2m가 필요해요", description: "옵션에서 2m가 선택되었는지 확인해 주세요." });
  if (!checks.quantity) feedback.push({ level: "check", title: "필요한 수량은 1개예요", description: "장바구니에서 수량을 1개로 바꿔 주세요." });
  if (!checks.detail) feedback.push({ level: "check", title: "상세정보를 더 확인해요", description: "상품 상세 화면에서 단자와 배송비를 확인해 주세요." });
  if (!checks.cart) feedback.push({ level: "check", title: "장바구니에 담아주세요", description: "선택한 상품과 옵션을 확인한 뒤 장바구니 담기 버튼을 눌러주세요." });
  if (!checks.review) feedback.push({ level: "check", title: "주문 내용을 모두 확인해요", description: "상품, 옵션, 수량, 배송비 포함 총액을 차례로 확인해 주세요." });
  if (failedRuleIds.length === 0) feedback.push({ level: "good", title: "조건에 잘 맞는 선택이에요", description: "단자, 길이, 수량과 배송비 포함 총액을 모두 확인했어요." });
  return buildResult(mission, failedRuleIds, totalPrice, feedback);
}

export function evaluateBudgetMission(mission: ShoppingMission, selectedIds: string[]): ShoppingEvaluation {
  const totalPrice = calculateShoppingTotal(selectedIds);
  const categories = new Set(selectedIds.map((id) => getShoppingProduct(id)?.categoryId).filter(Boolean));
  const missing = (mission.requiredCategoryIds ?? []).filter((category) => !categories.has(category));
  const failedRuleIds = [
    ...missing.map((category) => `category:${category}`),
    ...(mission.budget !== undefined && totalPrice > mission.budget ? ["budget"] : []),
  ];
  const feedback: ShoppingFeedback[] = [];
  if (missing.length) feedback.push({ level: "check", title: "필수 준비물이 더 있어요", description: "우산, 제습제와 미끄럼방지용품을 하나씩 골라보세요." });
  if (mission.budget !== undefined && totalPrice > mission.budget) feedback.push({ level: "check", title: "예산을 넘었어요", description: `${(totalPrice - mission.budget).toLocaleString("ko-KR")}원을 줄이면 예산 안에 들어와요.` });
  if (failedRuleIds.length === 0) feedback.push({ level: "good", title: "필수 준비물을 예산 안에서 골랐어요", description: "선택 품목은 남은 예산을 보고 결정하면 돼요." });
  const result = buildResult(mission, failedRuleIds, totalPrice, feedback);
  return { ...result, remainingBudget: (mission.budget ?? 0) - totalPrice };
}

export function getComparisonCriteria(productId?: string): ComparisonCriterion[] {
  const product = productId ? getShoppingProduct(productId) : undefined;
  if (!product) {
    return [{ id: "selection", label: "상품 선택", expected: "상품 1개", actual: "선택 안 함", passed: false }];
  }

  const connector = product.features["단자"] ?? "표시 없음";
  const length = product.features["길이"] ?? "표시 없음";
  const lengthMeters = Number.parseFloat(length.replace(/[^0-9.]/g, ""));
  const total = product.examplePrice + product.shippingFee;

  return [
    { id: "connector", label: "단자", expected: "C타입-C타입", actual: connector, passed: connector === "C타입-C타입" },
    { id: "length", label: "길이", expected: "2m 이상", actual: length, passed: Number.isFinite(lengthMeters) && lengthMeters >= 2 },
    { id: "bundle", label: "구성 수량", expected: "단품 1개", actual: product.bundleQuantity === 1 ? "단품 1개" : `${product.bundleQuantity}개 묶음`, passed: product.bundleQuantity === 1 },
    { id: "total", label: "배송비 포함 총비용", expected: "15,000원 이하", actual: `${total.toLocaleString("ko-KR")}원`, passed: total <= 15_000 },
  ];
}

export function evaluateCompareMission(mission: ShoppingMission, productId?: string): ShoppingEvaluation {
  const criteria = getComparisonCriteria(productId);
  const failedRuleIds = criteria.filter((criterion) => !criterion.passed).map((criterion) => criterion.id);
  const product = productId ? getShoppingProduct(productId) : undefined;
  const feedback: ShoppingFeedback[] = [];

  if (!product) feedback.push({ level: "check", title: "상품을 하나 골라주세요", description: "세 상품의 단자, 길이, 구성 수량과 총비용을 비교해 하나를 선택해 주세요." });
  for (const criterion of criteria.filter((item) => !item.passed && item.id !== "selection")) {
    if (criterion.id === "connector") feedback.push({ level: "check", title: "단자가 조건과 달라요", description: `선택한 상품은 ${criterion.actual}입니다. C타입-C타입 상품을 골라주세요.` });
    if (criterion.id === "length") feedback.push({ level: "check", title: "길이가 짧아요", description: `선택한 상품은 ${criterion.actual}입니다. 2m 이상인지 확인해 주세요.` });
    if (criterion.id === "bundle") feedback.push({ level: "check", title: "필요한 수량보다 많아요", description: `선택한 상품은 ${criterion.actual}입니다. 이번 연습에는 단품 1개만 필요해요.` });
    if (criterion.id === "total") feedback.push({ level: "check", title: "총비용이 예산을 넘어요", description: `배송비 포함 ${criterion.actual}입니다. 15,000원 이하 상품을 골라주세요.` });
  }
  if (failedRuleIds.length === 0) feedback.push({ level: "good", title: "필요한 조건을 모두 비교했어요", description: "단자와 길이뿐 아니라 배송비와 구성 수량도 살폈어요." });
  return buildResult(mission, failedRuleIds, product ? product.examplePrice + product.shippingFee : 0, feedback);
}

export type MistakeMissionInput = {
  selectedMistakes: string[];
  length: string;
  quantity: number;
  purchaseType: "one-time" | "subscription";
  shippingFee: number;
};

const MISTAKE_LABELS: Record<string, string> = {
  option: "길이 옵션",
  quantity: "수량",
  subscription: "구매 방식",
  shipping: "배송비",
};

export function evaluateMistakeMission(mission: ShoppingMission, input: MistakeMissionInput): ShoppingEvaluation {
  const required = mission.requiredMistakeIds ?? [];
  const failedRuleIds: string[] = [];
  const feedback: ShoppingFeedback[] = [];

  for (const id of required) {
    if (!input.selectedMistakes.includes(id)) {
      failedRuleIds.push(`find:${id}`);
      feedback.push({ level: "check", title: `${MISTAKE_LABELS[id] ?? id} 오류를 아직 찾지 못했어요`, description: "이전 화면으로 돌아가 원래 주문 조건과 주문서를 한 줄씩 비교해 보세요." });
    }
  }

  const extra = input.selectedMistakes.filter((id) => !required.includes(id));
  if (extra.length) {
    failedRuleIds.push("extra-selection");
    feedback.push({ level: "check", title: "정상인 상품명도 실수로 골랐어요", description: "상품명은 주문 조건과 같으므로 체크를 해제해 주세요." });
  }

  const corrections = [
    { id: "correction:length", passed: input.length === "2m", title: "길이를 2m로 고쳐주세요", description: "주문하려던 길이는 2m인데 주문서에는 1m로 되어 있어요." },
    { id: "correction:quantity", passed: input.quantity === 1, title: "수량을 1개로 고쳐주세요", description: "2개가 아니라 필요한 수량 1개만 주문해요." },
    { id: "correction:purchase", passed: input.purchaseType === "one-time", title: "한 번 구매로 고쳐주세요", description: "매달 오는 정기배송이 아니라 이번에 한 번만 구매해요." },
    { id: "correction:shipping", passed: input.shippingFee === 0, title: "배송비를 다시 확인해 주세요", description: "무료배송 조건의 상품을 선택해야 배송비 포함 총액이 6,900원이 돼요." },
  ];
  for (const correction of corrections) {
    if (!correction.passed) {
      failedRuleIds.push(correction.id);
      feedback.push({ level: "check", title: correction.title, description: correction.description });
    }
  }

  if (failedRuleIds.length === 0) {
    feedback.push({ level: "good", title: "주문 실수 네 곳을 모두 찾아 고쳤어요", description: "옵션, 수량, 구매 방식과 배송비를 고친 뒤 최종금액까지 다시 확인했어요." });
  }

  return buildResult(mission, failedRuleIds, 6900 * input.quantity + input.shippingFee, feedback);
}

function buildResult(mission: ShoppingMission, failedRuleIds: string[], totalPrice: number, feedback: ShoppingFeedback[]): ShoppingEvaluation {
  const ruleCount = Math.max(failedRuleIds.length + 1, 3);
  const score = Math.max(0, Math.round(((ruleCount - failedRuleIds.length) / ruleCount) * 100));
  return {
    passed: failedRuleIds.length === 0,
    totalPrice,
    score,
    satisfiedRuleIds: failedRuleIds.length === 0 ? ["all"] : [],
    failedRuleIds,
    feedback,
    collectionSlug: mission.collectionSlug as ShoppingCollectionSlug,
  };
}
