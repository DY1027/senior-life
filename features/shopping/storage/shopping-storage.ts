import type { CartLine, CartSnapshot, CommerceMissionCompletion, CommerceProduct, OrderState, OrdersSnapshot, PracticeOrder, SelectedOptions } from "@/features/shopping/domain/types";
import { calculateCheckoutSummary, calculateUnitPrice } from "@/features/shopping/engine/price-calculator";
import { isOrderState, makeHistoryEntry } from "@/features/shopping/engine/order-state-machine";

export const CART_STORAGE_KEY = "seniordeundun:shopping:cart:v2";
export const ORDERS_STORAGE_KEY = "seniordeundun:shopping:orders:v2";
export const PROGRESS_STORAGE_KEY = "seniordeundun:shopping:progress:v2";
export const MISSION_COMPLETIONS_STORAGE_KEY = "seniordeundun:shopping:mission-completions:v1";
export const SHOPPING_STORAGE_EVENT = "seniordeundun-shopping-storage";

const EMPTY_CART: CartSnapshot = { version: 2, lines: [] };
const EMPTY_ORDERS: OrdersSnapshot = { version: 2, orders: [] };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(SHOPPING_STORAGE_EVENT));
  } catch {
    // 저장이 차단된 환경에서도 현재 화면의 연습은 계속할 수 있다.
  }
}

export function saveShoppingProgress(stage: "search" | "cart" | "checkout" | "complete", details: Record<string, string> = {}) {
  writeJson(PROGRESS_STORAGE_KEY, { version: 2, stage, details, updatedAt: new Date().toISOString() });
}

export function readCart(): CartSnapshot {
  const stored = readJson<Partial<CartSnapshot>>(CART_STORAGE_KEY, EMPTY_CART);
  if (stored.version !== 2 || !Array.isArray(stored.lines)) return EMPTY_CART;
  return { version: 2, lines: stored.lines, activeBudget: stored.activeBudget, activeMissionSlug: stored.activeMissionSlug };
}

export function setActiveMission(activeMissionSlug?: string) {
  writeJson(CART_STORAGE_KEY, { version: 2, lines: [], activeMissionSlug });
  if (activeMissionSlug) saveShoppingProgress("search", { missionSlug: activeMissionSlug });
}

export function addProductToCart(product: CommerceProduct, selectedOptions: SelectedOptions, quantity: number) {
  const cart = readCart();
  const optionLabels = product.optionGroups.flatMap((group) => {
    const value = group.values.find((candidate) => candidate.id === selectedOptions[group.id]);
    return value ? [`${group.label}: ${value.label}`] : [];
  });
  const line: CartLine = {
    id: product.id,
    productId: product.id,
    title: product.id === "usb-c-2m-white" ? "C타입 고속 충전 케이블" : product.title,
    image: product.image,
    selectedOptions,
    optionLabels,
    quantity: Math.max(1, Math.floor(quantity)),
    unitPrice: calculateUnitPrice(product, selectedOptions),
    shippingFee: product.shippingFee,
  };
  const index = cart.lines.findIndex((candidate) => candidate.id === line.id);
  const lines = [...cart.lines];
  if (index >= 0) lines[index] = line;
  else lines.push(line);
  writeJson(CART_STORAGE_KEY, { ...cart, lines });
  saveShoppingProgress("cart", { productId: product.id });
}

export function updateCartLineQuantity(lineId: string, quantity: number) {
  const cart = readCart();
  const lines = cart.lines.map((line) => line.id === lineId ? { ...line, quantity: Math.max(1, Math.floor(quantity)) } : line);
  writeJson(CART_STORAGE_KEY, { ...cart, lines });
}

export function removeCartLine(lineId: string) {
  const cart = readCart();
  writeJson(CART_STORAGE_KEY, { ...cart, lines: cart.lines.filter((line) => line.id !== lineId) });
}

export function setActiveBudget(activeBudget?: number) {
  writeJson(CART_STORAGE_KEY, { ...readCart(), activeBudget });
}

export function readCommerceMissionCompletions() {
  const stored = readJson<CommerceMissionCompletion[]>(MISSION_COMPLETIONS_STORAGE_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

export function clearCart() {
  writeJson(CART_STORAGE_KEY, EMPTY_CART);
}

export function readOrders(): OrdersSnapshot {
  const stored = readJson<Partial<OrdersSnapshot>>(ORDERS_STORAGE_KEY, EMPTY_ORDERS);
  if (stored.version !== 2 || !Array.isArray(stored.orders)) return EMPTY_ORDERS;
  const orders = stored.orders.flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object" || !isOrderState(candidate.state)) return [];
    const order = candidate as PracticeOrder;
    return [{
      ...order,
      history: Array.isArray(order.history) && order.history.length > 0
        ? order.history
        : [makeHistoryEntry(order.state, order.createdAt)],
    }];
  });
  return { version: 2, orders };
}

export function readOrder(orderId: string) {
  return readOrders().orders.find((order) => order.id === orderId);
}

export function updatePracticeOrder(orderId: string, update: (order: PracticeOrder) => PracticeOrder) {
  let updated: PracticeOrder | undefined;
  const orders = readOrders().orders.map((order) => {
    if (order.id !== orderId) return order;
    updated = update(order);
    return updated;
  });
  if (!updated) return undefined;
  writeJson(ORDERS_STORAGE_KEY, { version: 2, orders });
  return updated;
}

const FIXTURE_LINE: CartLine = {
  id: "fixture-cable",
  productId: "usb-c-2m-white",
  title: "C타입 고속 충전 케이블 2m",
  image: {
    src: "/images/shopping/products/digital/usb-c-cable-white-2m.jpg",
    alt: "흰색 USB C타입 충전 케이블 연습용 예시 사진",
    width: 800,
    height: 800,
  },
  selectedOptions: { connector: "usb-c", length: "2m" },
  optionLabels: ["단자: C타입-C타입", "길이: 2m"],
  quantity: 1,
  unitPrice: 6900,
  shippingFee: 3000,
};

export function createOrderFixture(state: Extract<OrderState, "PAID" | "SHIPPED" | "DELIVERED">) {
  const createdAt = "2026-07-18T00:10:00.000Z";
  const stateHistory: OrderState[] = state === "PAID"
    ? ["PAID"]
    : state === "SHIPPED"
      ? ["PAID", "PREPARING", "SHIPPED"]
      : ["PAID", "PREPARING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const order: PracticeOrder = {
    id: `fixture-${state.toLowerCase()}`,
    orderNumber: `DD-20260718-${state === "PAID" ? "1001" : state === "SHIPPED" ? "1002" : "1003"}`,
    lines: [FIXTURE_LINE],
    paymentSummary: calculateCheckoutSummary([FIXTURE_LINE]),
    state,
    addressLabel: "김든든 · 서울시 든든구 연습로 12 · 010-0000-0000",
    paymentMethodLabel: "연습카드 **** 1234",
    createdAt,
    history: stateHistory.map((historyState, index) => makeHistoryEntry(historyState, new Date(Date.parse(createdAt) + index * 3_600_000).toISOString())),
  };
  const orders = readOrders().orders.filter((candidate) => candidate.id !== order.id);
  writeJson(ORDERS_STORAGE_KEY, { version: 2, orders: [order, ...orders] });
  return order;
}

export function createPracticeOrder(lines: CartLine[]) {
  const now = new Date();
  const id = `${now.getTime()}`;
  const activeMissionSlug = readCart().activeMissionSlug;
  const order: PracticeOrder = {
    id,
    orderNumber: `DD-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(-4)}`,
    lines,
    paymentSummary: calculateCheckoutSummary(lines),
    state: "PAID",
    addressLabel: "김든든 · 서울시 든든구 연습로 12 · 010-0000-0000",
    paymentMethodLabel: "연습카드 **** 1234",
    createdAt: now.toISOString(),
    history: [makeHistoryEntry("PAID", now.toISOString())],
    missionSlug: activeMissionSlug,
  };
  const orders = readOrders().orders;
  writeJson(ORDERS_STORAGE_KEY, { version: 2, orders: [order, ...orders] });
  if (activeMissionSlug) {
    const previous = readCommerceMissionCompletions();
    const completion: CommerceMissionCompletion = {
      missionSlug: activeMissionSlug,
      orderId: order.id,
      completedAt: now.toISOString(),
      paymentTotal: order.paymentSummary.paymentTotal,
    };
    writeJson(MISSION_COMPLETIONS_STORAGE_KEY, [completion, ...previous].slice(0, 30));
  }
  saveShoppingProgress("complete", { orderId: order.id });
  clearCart();
  return order;
}
