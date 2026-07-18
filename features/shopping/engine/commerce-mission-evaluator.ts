import type { CartSnapshot } from "@/features/shopping/domain/types";
import { calculateCheckoutSummary } from "@/features/shopping/engine/price-calculator";

export const FIRST_CABLE_MISSION_SLUG = "first-usb-c-cable";
export const RAINY_BUDGET_MISSION_SLUG = "rainy-budget-30000";

export type CommerceMissionFeedback = {
  missionSlug: string;
  title: string;
  instruction: string;
  complete: boolean;
  reasons: string[];
};

export function getCommerceMissionLabel(missionSlug?: string) {
  if (missionSlug === FIRST_CABLE_MISSION_SLUG) {
    return "C타입 2m 충전 케이블 주문하기";
  }
  if (missionSlug === RAINY_BUDGET_MISSION_SLUG) {
    return "3만 원으로 장마철 준비하기";
  }
  return undefined;
}

export function getCommerceMissionPracticeHref(missionSlug?: string) {
  if (missionSlug === RAINY_BUDGET_MISSION_SLUG) return "/shopping/practice/rainy-season-budget-30000";
  return "/shopping/catalog";
}

export function evaluateCommerceMission(cart: CartSnapshot): CommerceMissionFeedback | undefined {
  if (cart.activeMissionSlug === RAINY_BUDGET_MISSION_SLUG) return evaluateRainyBudgetMission(cart);
  if (cart.activeMissionSlug !== FIRST_CABLE_MISSION_SLUG) return undefined;

  const reasons: string[] = [];
  const cableLines = cart.lines.filter((line) => line.productId === "usb-c-2m-white");
  const targetLine = cableLines[0];

  if (!targetLine) {
    reasons.push("C타입 충전 케이블을 장바구니에 담아주세요.");
  } else {
    if (targetLine.selectedOptions.connector !== "usb-c") {
      reasons.push("단자가 달라요. ‘C타입-C타입’을 선택해 주세요.");
    }
    if (targetLine.selectedOptions.length !== "2m") {
      reasons.push("길이가 달라요. ‘2m’를 선택해 주세요.");
    }
    if (targetLine.quantity !== 1) {
      reasons.push(`수량이 ${targetLine.quantity}개예요. 필요한 수량은 1개입니다.`);
    }
  }

  if (cart.lines.length > 1 || cableLines.length > 1) {
    reasons.push("이번 미션에는 충전 케이블 한 종류만 필요해요. 다른 상품은 제거해 주세요.");
  }

  const paymentTotal = calculateCheckoutSummary(cart.lines).paymentTotal;
  if (paymentTotal > 15_000) {
    reasons.push(`배송비 포함 총액이 15,000원을 넘었어요. 옵션과 수량을 다시 확인해 주세요.`);
  }

  return {
    missionSlug: FIRST_CABLE_MISSION_SLUG,
    title: "오늘의 미션",
    instruction: "C타입-C타입 · 길이 2m · 수량 1개를 배송비 포함 15,000원 이하로 주문해 보세요.",
    complete: reasons.length === 0,
    reasons,
  };
}

function evaluateRainyBudgetMission(cart: CartSnapshot): CommerceMissionFeedback {
  const reasons: string[] = [];
  const productIds = new Set(cart.lines.map((line) => line.productId));

  if (!productIds.has("umbrella")) {
    reasons.push("우산이 빠졌어요. 장마철에 사용할 우산을 하나 담아주세요.");
  }
  if (!productIds.has("dehumidifier-pack")) {
    reasons.push("제습용품이 빠졌어요. 옷장용 제습제를 담아주세요.");
  }
  if (!["anti-slip-tape", "waterproof-shoe-covers"].some((productId) => productIds.has(productId))) {
    reasons.push("미끄럼 예방용품이 빠졌어요. 테이프나 미끄럼방지 밑창 신발커버를 담아주세요.");
  }

  const paymentTotal = calculateCheckoutSummary(cart.lines).paymentTotal;
  if (paymentTotal > 30_000) {
    reasons.push("배송비 포함 총액이 30,000원을 넘었어요. 비슷한 용도의 더 저렴한 상품으로 바꿔보세요.");
  }

  return {
    missionSlug: RAINY_BUDGET_MISSION_SLUG,
    title: "장마철 3만 원 미션",
    instruction: "우산 · 제습용품 · 미끄럼 예방용품을 하나씩 담고 배송비 포함 30,000원 이하로 맞춰보세요.",
    complete: reasons.length === 0,
    reasons,
  };
}
