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

export function calculateShoppingTotal(productIds: string[]) {
  return productIds.reduce((total, id) => {
    const product = getShoppingProduct(id);
    return product ? total + product.examplePrice + product.shippingFee : total;
  }, 0);
}

export function evaluateGuidedMission(mission: ShoppingMission, input: { productId?: string; length?: string; color?: string; quantity: number }): ShoppingEvaluation {
  const checks = {
    product: input.productId === mission.correctProductId,
    length: input.length === "2m",
    color: input.color === "화이트",
    quantity: input.quantity === 1,
  };
  const failedRuleIds = Object.entries(checks).filter(([, passed]) => !passed).map(([id]) => id);
  const product = input.productId ? getShoppingProduct(input.productId) : undefined;
  const totalPrice = product ? (product.examplePrice + product.shippingFee) * input.quantity : 0;
  const feedback: ShoppingFeedback[] = [];
  if (!checks.product) feedback.push({ level: "check", title: "단자를 다시 확인해요", description: "이번 미션은 C타입 단자 제품을 찾는 연습이에요." });
  if (!checks.length) feedback.push({ level: "check", title: "길이는 2m가 필요해요", description: "옵션에서 2m가 선택되었는지 확인해 주세요." });
  if (!checks.color) feedback.push({ level: "check", title: "색상은 화이트로 골라요", description: "옵션에서 화이트가 선택되었는지 확인해 주세요." });
  if (!checks.quantity) feedback.push({ level: "check", title: "필요한 수량은 1개예요", description: "장바구니에서 수량을 1개로 바꿔 주세요." });
  if (failedRuleIds.length === 0) feedback.push({ level: "good", title: "조건에 잘 맞는 선택이에요", description: "단자, 길이, 색상과 수량을 모두 확인했어요." });
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

export function evaluateCompareMission(mission: ShoppingMission, productId?: string): ShoppingEvaluation {
  const failedRuleIds = productId === mission.correctProductId ? [] : ["comparison"];
  const product = productId ? getShoppingProduct(productId) : undefined;
  const feedback: ShoppingFeedback[] = failedRuleIds.length
    ? [{ level: "check", title: "가격 말고 조건도 다시 봐요", description: "C타입, 2m, 단품, 총비용 15,000원 이하 조건을 모두 확인해 주세요." }]
    : [{ level: "good", title: "필요한 조건을 모두 비교했어요", description: "단자와 길이뿐 아니라 배송비와 구성 수량도 살폈어요." }];
  return buildResult(mission, failedRuleIds, product ? product.examplePrice + product.shippingFee : 0, feedback);
}

export function evaluateMistakeMission(mission: ShoppingMission, selectedMistakes: string[]): ShoppingEvaluation {
  const required = mission.requiredMistakeIds ?? [];
  const failedRuleIds = required.filter((id) => !selectedMistakes.includes(id));
  const extra = selectedMistakes.filter((id) => !required.includes(id));
  if (extra.length) failedRuleIds.push("extra-selection");
  const feedback: ShoppingFeedback[] = failedRuleIds.length
    ? [{ level: "check", title: "주문 화면을 한 번 더 살펴봐요", description: "원하는 수량과 한 번 구매인지 정기배송인지 확인해 주세요." }]
    : [{ level: "good", title: "놓치기 쉬운 실수 두 곳을 찾았어요", description: "수량을 1개로 바꾸고 정기배송 대신 한 번 구매를 선택하면 돼요." }];
  return buildResult(mission, failedRuleIds, 13800, feedback);
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
