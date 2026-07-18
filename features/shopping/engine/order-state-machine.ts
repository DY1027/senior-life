import type {
  OrderHistoryEntry,
  OrderState,
  PracticeOrder,
  RefundSummary,
  ReturnReason,
} from "@/features/shopping/domain/types";

export type OrderAction = "cancel" | "tracking" | "return" | "exchange" | "refund";

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
  PAID: "결제완료",
  PREPARING: "상품준비중",
  SHIPPED: "배송중",
  OUT_FOR_DELIVERY: "배송출발",
  DELIVERED: "배송완료",
  CANCELLED: "취소완료",
  RETURN_REQUESTED: "반품 신청완료",
  EXCHANGE_REQUESTED: "교환 신청완료",
};

const VALID_STATES = new Set<OrderState>(Object.keys(ORDER_STATE_LABELS) as OrderState[]);

export function isOrderState(value: unknown): value is OrderState {
  return typeof value === "string" && VALID_STATES.has(value as OrderState);
}

export function getAvailableOrderActions(state: OrderState): OrderAction[] {
  if (state === "PAID" || state === "PREPARING") return ["cancel"];
  if (state === "SHIPPED" || state === "OUT_FOR_DELIVERY") return ["tracking"];
  if (state === "DELIVERED") return ["tracking", "return", "exchange"];
  if (state === "CANCELLED" || state === "RETURN_REQUESTED") return ["refund"];
  return [];
}

export function makeHistoryEntry(state: OrderState, occurredAt = new Date().toISOString()): OrderHistoryEntry {
  return { state, label: ORDER_STATE_LABELS[state], occurredAt };
}

const ALLOWED_TRANSITIONS: Record<OrderState, OrderState[]> = {
  PAID: ["PREPARING", "CANCELLED"],
  PREPARING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURN_REQUESTED", "EXCHANGE_REQUESTED"],
  CANCELLED: [],
  RETURN_REQUESTED: [],
  EXCHANGE_REQUESTED: [],
};

export function transitionOrder(order: PracticeOrder, nextState: OrderState, occurredAt = new Date().toISOString()): PracticeOrder {
  if (!ALLOWED_TRANSITIONS[order.state].includes(nextState)) {
    throw new Error(`${ORDER_STATE_LABELS[order.state]} 상태에서는 ${ORDER_STATE_LABELS[nextState]} 상태로 바꿀 수 없습니다.`);
  }
  return {
    ...order,
    state: nextState,
    history: [...order.history, makeHistoryEntry(nextState, occurredAt)],
  };
}

export function calculateCancellationRefund(order: PracticeOrder): RefundSummary {
  return {
    originalPayment: order.paymentSummary.paymentTotal,
    merchandiseRefund: order.paymentSummary.merchandiseTotal,
    shippingRefund: order.paymentSummary.shippingTotal,
    returnShippingFee: 0,
    refundTotal: order.paymentSummary.paymentTotal,
    methodLabel: order.paymentMethodLabel,
  };
}

export function calculateReturnRefund(order: PracticeOrder, reason: ReturnReason): RefundSummary {
  const sellerFault = reason === "damaged" || reason === "wrong-item";
  const returnShippingFee = sellerFault ? 0 : Math.min(6_000, order.paymentSummary.paymentTotal);
  return {
    originalPayment: order.paymentSummary.paymentTotal,
    merchandiseRefund: order.paymentSummary.merchandiseTotal,
    shippingRefund: order.paymentSummary.shippingTotal,
    returnShippingFee,
    refundTotal: Math.max(0, order.paymentSummary.paymentTotal - returnShippingFee),
    methodLabel: order.paymentMethodLabel,
  };
}

export function nextDeliveryState(state: OrderState): OrderState | undefined {
  if (state === "PAID") return "PREPARING";
  if (state === "PREPARING") return "SHIPPED";
  if (state === "SHIPPED") return "OUT_FOR_DELIVERY";
  if (state === "OUT_FOR_DELIVERY") return "DELIVERED";
  return undefined;
}
