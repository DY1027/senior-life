// 키오스크 상태 머신 — 순수 리듀서.
// 모든 화면 전환·장바구니 변경이 이 파일 하나에 명시적으로 모여 있다.
// UI는 이벤트를 보내기만 하고, 어떤 상태에서 어떤 이벤트가 가능한지는 여기서 판단한다.
// (허용되지 않는 이벤트는 조용히 무시 — 잘못 눌러도 아무 일도 생기지 않아야 한다)
import type { Catalog, CartItem, MachineEvent, MachineState, Scenario } from "./types";

export function createInitialState(catalog: Catalog, scenario: Scenario): MachineState {
  let nextUid = 1;
  const cart: CartItem[] = (scenario.preloadCart ?? []).map((it) => ({
    uid: nextUid++,
    productId: it.productId,
    quantity: it.quantity,
    options: it.options ?? {},
  }));
  return {
    phase: "intro",
    serviceType: null,
    activeCategoryId: catalog.categories[0].id,
    editing: null,
    cart,
    // soldOutDecoy: 임무·미리 담긴 항목과 무관한 상품 하나를 품절 처리해
    // "품절 표시를 만나도 당황하지 않는" 경험을 만든다.
    soldOutIds: scenario.events?.includes("soldOutDecoy") ? [pickDecoy(catalog, scenario)] : [],
    payMethod: null,
    payAttempts: 0,
    receiptChoice: null,
    achievements: [],
    hintsUsed: 0,
    nextUid,
  };
}

function pickDecoy(catalog: Catalog, scenario: Scenario): string {
  const used = new Set([
    ...(scenario.mission?.items ?? []).map((i) => i.productId),
    ...(scenario.preloadCart ?? []).map((i) => i.productId),
  ]);
  const candidate = catalog.products.find((p) => !used.has(p.id));
  return candidate?.id ?? "";
}

function productOf(catalog: Catalog, id: string) {
  return catalog.products.find((p) => p.id === id);
}

/** 옵션 그룹의 기본값을 채운 옵션 맵 */
function defaultOptions(catalog: Catalog, productId: string): Record<string, string> {
  const p = productOf(catalog, productId);
  const out: Record<string, string> = {};
  for (const gid of p?.optionGroupIds ?? []) {
    const g = catalog.optionGroups.find((og) => og.id === gid);
    if (g?.defaultChoiceId) out[gid] = g.defaultChoiceId;
  }
  return out;
}

/** 필수 옵션이 모두 선택됐는지 */
export function missingRequiredOption(catalog: Catalog, editing: NonNullable<MachineState["editing"]>): string | null {
  const p = productOf(catalog, editing.productId);
  for (const gid of p?.optionGroupIds ?? []) {
    const g = catalog.optionGroups.find((og) => og.id === gid);
    if (g?.required && !editing.options[gid]) return gid;
  }
  return null;
}

export function itemPrice(catalog: Catalog, item: { productId: string; options: Record<string, string>; quantity: number }): number {
  const p = productOf(catalog, item.productId);
  if (!p) return 0;
  let each = p.price;
  for (const [gid, cid] of Object.entries(item.options)) {
    const g = catalog.optionGroups.find((og) => og.id === gid);
    each += g?.choices.find((c) => c.id === cid)?.priceDelta ?? 0;
  }
  return each * item.quantity;
}

export function cartTotal(catalog: Catalog, cart: CartItem[]): number {
  return cart.reduce((sum, it) => sum + itemPrice(catalog, it), 0);
}

const add = (list: string[], msg: string) => (list.includes(msg) ? list : [...list, msg]);

export function kioskReducer(
  state: MachineState,
  event: MachineEvent,
  catalog: Catalog,
  scenario: Scenario
): MachineState {
  switch (event.type) {
    case "RESTART":
      return createInitialState(catalog, scenario);

    case "USE_HINT":
      return { ...state, hintsUsed: state.hintsUsed + 1 };

    case "START":
      if (state.phase !== "intro") return state;
      return { ...state, phase: "service" };

    case "SELECT_SERVICE":
      if (state.phase !== "service") return state;
      return { ...state, serviceType: event.serviceType, phase: "menu" };

    case "SELECT_CATEGORY":
      if (state.phase !== "menu") return state;
      return { ...state, activeCategoryId: event.categoryId };

    case "OPEN_PRODUCT": {
      if (state.phase !== "menu") return state;
      if (state.soldOutIds.includes(event.productId)) return state; // 품절은 UI가 안내
      const p = productOf(catalog, event.productId);
      if (!p) return state;
      const editing = { productId: p.id, options: defaultOptions(catalog, p.id), quantity: 1 };
      // 옵션이 하나도 없는 상품은 바로 담는다
      if ((p.optionGroupIds ?? []).length === 0) {
        return {
          ...state,
          cart: [...state.cart, { uid: state.nextUid, productId: p.id, quantity: 1, options: {} }],
          nextUid: state.nextUid + 1,
        };
      }
      return { ...state, phase: "options", editing };
    }

    case "SET_OPTION":
      if (state.phase !== "options" || !state.editing) return state;
      return { ...state, editing: { ...state.editing, options: { ...state.editing.options, [event.groupId]: event.choiceId } } };

    case "SET_QTY": {
      if (state.phase !== "options" || !state.editing) return state;
      const quantity = Math.min(9, Math.max(1, event.quantity));
      return { ...state, editing: { ...state.editing, quantity } };
    }

    case "CONFIRM_ITEM": {
      if (state.phase !== "options" || !state.editing) return state;
      if (missingRequiredOption(catalog, state.editing)) return state; // UI가 안내
      const item: CartItem = {
        uid: state.nextUid,
        productId: state.editing.productId,
        quantity: state.editing.quantity,
        options: state.editing.options,
      };
      return { ...state, phase: "menu", editing: null, cart: [...state.cart, item], nextUid: state.nextUid + 1 };
    }

    case "CANCEL_ITEM":
      if (state.phase !== "options") return state;
      return { ...state, phase: "menu", editing: null };

    case "OPEN_CART":
      if (state.phase !== "menu") return state;
      return { ...state, phase: "cart" };

    case "REMOVE_ITEM": {
      if (state.phase !== "cart") return state;
      const removed = state.cart.find((it) => it.uid === event.uid);
      const wasPreloaded = (scenario.preloadCart ?? []).some((p) => p.productId === removed?.productId);
      return {
        ...state,
        cart: state.cart.filter((it) => it.uid !== event.uid),
        achievements: wasPreloaded ? add(state.achievements, "잘못 담긴 메뉴를 직접 삭제했어요") : state.achievements,
      };
    }

    case "CHANGE_ITEM_QTY": {
      if (state.phase !== "cart") return state;
      const quantity = Math.min(9, Math.max(1, event.quantity));
      return { ...state, cart: state.cart.map((it) => (it.uid === event.uid ? { ...it, quantity } : it)) };
    }

    case "CLOSE_CART":
      if (state.phase !== "cart") return state;
      return { ...state, phase: "menu" };

    case "CHECKOUT":
      if (state.phase !== "cart" || state.cart.length === 0) return state;
      return { ...state, phase: "payMethod" };

    case "SELECT_PAY":
      if (state.phase !== "payMethod") return state;
      return { ...state, payMethod: event.methodId, phase: "processing" };

    case "PAY_RESULT": {
      if (state.phase !== "processing") return state;
      const attempts = state.payAttempts + 1;
      if (event.ok) {
        const achievements = state.payAttempts > 0
          ? add(state.achievements, "카드 인식 실패를 해결하고 결제를 다시 시도했어요")
          : state.achievements;
        return { ...state, payAttempts: attempts, achievements, phase: "receipt" };
      }
      return { ...state, payAttempts: attempts, phase: "payError" };
    }

    case "RETRY_PAY":
      if (state.phase !== "payError") return state;
      return { ...state, phase: "processing" };

    case "SELECT_RECEIPT":
      if (state.phase !== "receipt") return state;
      return { ...state, receiptChoice: event.want, phase: "done" };

    case "FINISH":
      return state;

    case "BACK": {
      // 모든 화면에서 이전으로 — 막히는 상태가 없어야 한다 (명세 14장 상태 머신 테스트 기준)
      switch (state.phase) {
        case "service":
          return { ...state, phase: "intro" };
        case "menu":
          return { ...state, phase: "service" };
        case "options":
          return { ...state, phase: "menu", editing: null };
        case "cart":
          return { ...state, phase: "menu" };
        case "payMethod":
          return { ...state, phase: "cart" };
        case "payError":
          return { ...state, phase: "payMethod" }; // 결제 수단부터 다시 고를 수 있게
        case "receipt":
          return state; // 결제 후에는 되돌리지 않는다 (실제 기기와 동일)
        default:
          return state;
      }
    }

    default:
      return state;
  }
}

/** 이번 결제 시도가 실패해야 하는가 (ErrorEngine: cardFailOnce는 첫 시도만 실패) */
export function shouldPaymentFail(state: MachineState, scenario: Scenario): boolean {
  return (scenario.events ?? []).includes("cardFailOnce") && state.payAttempts === 0;
}
