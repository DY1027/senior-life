import type { CartLine, CartSnapshot, CommerceProduct, OrdersSnapshot, PracticeOrder, SelectedOptions } from "@/features/shopping/domain/types";
import { calculateCheckoutSummary, calculateUnitPrice } from "@/features/shopping/engine/price-calculator";

export const CART_STORAGE_KEY = "seniordeundun:shopping:cart:v2";
export const ORDERS_STORAGE_KEY = "seniordeundun:shopping:orders:v2";
export const PROGRESS_STORAGE_KEY = "seniordeundun:shopping:progress:v2";
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
  return { version: 2, lines: stored.lines, activeBudget: stored.activeBudget };
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

export function clearCart() {
  writeJson(CART_STORAGE_KEY, EMPTY_CART);
}

export function readOrders(): OrdersSnapshot {
  const stored = readJson<Partial<OrdersSnapshot>>(ORDERS_STORAGE_KEY, EMPTY_ORDERS);
  if (stored.version !== 2 || !Array.isArray(stored.orders)) return EMPTY_ORDERS;
  return { version: 2, orders: stored.orders };
}

export function createPracticeOrder(lines: CartLine[]) {
  const now = new Date();
  const id = `${now.getTime()}`;
  const order: PracticeOrder = {
    id,
    orderNumber: `DD-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(-4)}`,
    lines,
    paymentSummary: calculateCheckoutSummary(lines),
    state: "PAID",
    addressLabel: "김든든 · 서울시 든든구 연습로 12 · 010-0000-0000",
    paymentMethodLabel: "연습카드 **** 1234",
    createdAt: now.toISOString(),
  };
  const orders = readOrders().orders;
  writeJson(ORDERS_STORAGE_KEY, { version: 2, orders: [order, ...orders] });
  saveShoppingProgress("complete", { orderId: order.id });
  clearCart();
  return order;
}
