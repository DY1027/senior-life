// 임무 판정(conditionEvaluator) + 단계별 안내(GuidanceEngine의 문장 생성부).
// - evaluateMission: 완료 화면에서 "무엇을 해냈는지" 과정 중심으로 알려준다 (점수·오답 없음)
// - nextGuidance: 지금 상태에서 임무를 이루려면 무엇을 하면 되는지 한 가지 행동만 제안.
//   천천히 배우기 모드는 이 결과의 targetId로 버튼을 강조하고, 다른 모드는 도움말 버튼에서만 쓴다.
import type { Catalog, MachineState, MissionItem, Scenario } from "./types";
import { missionAcceptsProduct, missionProductIds } from "./mission";
import { getKioskConfig } from "@/lib/kiosk-config";

export type MissionCheck = { label: string; pass: boolean };

function optionLabel(catalog: Catalog, groupId: string, choiceId: string): string {
  const g = catalog.optionGroups.find((og) => og.id === groupId);
  return g?.choices.find((c) => c.id === choiceId)?.label ?? choiceId;
}

function productName(catalog: Catalog, id: string): string {
  return catalog.products.find((p) => p.id === id)?.name ?? id;
}

/** 장바구니에서 임무 항목과 일치하는 것을 찾는다 (지정한 옵션만 비교) */
function findMatch(cart: MachineState["cart"], item: MissionItem) {
  return cart.find(
    (c) =>
      missionAcceptsProduct(item, c.productId) &&
      Object.entries(item.options ?? {}).every(([g, v]) => c.options[g] === v)
  );
}

/** 품절되지 않은 우선 상품 또는 첫 대체 상품을 안내 대상으로 고른다. */
function availableProduct(catalog: Catalog, state: MachineState, item: MissionItem) {
  const id = missionProductIds(item).find((productId) => !state.soldOutIds.includes(productId)) ?? item.productId;
  return catalog.products.find((p) => p.id === id);
}

export function evaluateMission(state: MachineState, scenario: Scenario, catalog: Catalog): MissionCheck[] {
  const mission = scenario.mission;
  if (!mission) return [];
  const checks: MissionCheck[] = [];

  if (mission.serviceType) {
    const label = catalog.serviceTypes.find((s) => s.id === mission.serviceType)?.label ?? mission.serviceType;
    checks.push({ label: `${label} 선택`, pass: state.serviceType === mission.serviceType });
  }

  for (const item of mission.items) {
    const optionText = Object.entries(item.options ?? {})
      .map(([g, v]) => optionLabel(catalog, g, v))
      .join(" · ");
    const productText = missionProductIds(item).map((id) => productName(catalog, id)).join(" 또는 ");
    const name = `${productText}${optionText ? ` (${optionText})` : ""} ${item.quantity}${catalog.unitLabel}`;
    const match = findMatch(state.cart, item);
    checks.push({ label: `${name} 담기`, pass: !!match && match.quantity === item.quantity });
  }

  // 임무에 없는 항목(잘못 담긴 것)이 남아 있으면 알려준다
  const extra = state.cart.filter((c) => !mission.items.some((m) => findMatch([c], m)));
  if ((scenario.preloadCart ?? []).length > 0) {
    checks.push({ label: "필요 없는 메뉴 정리하기", pass: extra.length === 0 });
  }

  if (mission.paymentMethod) {
    const label = catalog.paymentMethods.find((m) => m.id === mission.paymentMethod)?.label ?? mission.paymentMethod;
    checks.push({ label: `${label}로 결제`, pass: state.payMethod === mission.paymentMethod });
  }

  if (mission.receipt !== undefined) {
    checks.push({
      label: mission.receipt ? "영수증 받기" : "영수증 받지 않기",
      pass: state.receiptChoice === mission.receipt,
    });
  }

  return checks;
}

export type Guidance = {
  text: string; // "포장하기를 눌러 보세요"
  /** 강조할 요소의 data-guide 값 (천천히 배우기 모드에서 반짝임) */
  targetId?: string;
};

export function nextGuidance(state: MachineState, scenario: Scenario, catalog: Catalog): Guidance {
  const mission = scenario.mission;
  const flow = getKioskConfig(catalog.kioskType).flowLabels;

  switch (state.phase) {
    case "intro":
      return { text: "아래의 '연습 시작' 버튼을 눌러 보세요.", targetId: "start" };

    case "keypad": {
      const kp = catalog.keypad;
      if (!kp) return { text: "숫자를 눌러 보세요." };
      if (state.keypadValue.length < kp.length) {
        return { text: kp.guide ?? `숫자판에서 ${kp.length}자리를 눌러 보세요. 연습이니 아무 숫자나 괜찮아요.`, targetId: "keypad" };
      }
      return { text: "다 입력했어요. '확인' 버튼을 눌러 보세요.", targetId: "keypad-done" };
    }

    case "carSelect":
      return { text: catalog.carSelect?.guide ?? "사진과 들어온 시간을 보고 내 차를 골라 보세요. 연습이니 아무 차나 괜찮아요." };

    case "service": {
      if (!mission?.serviceType) return { text: "매장에서 드실지, 가져가실지 골라 보세요." };
      const svc = catalog.serviceTypes.find((s) => s.id === mission.serviceType);
      return { text: `이번 임무는 ${svc?.label}이에요. '${svc?.label}'를 눌러 보세요.`, targetId: `service-${mission.serviceType}` };
    }

    case "menu": {
      // 요금형 기기(주차): 하나를 고르면 바로 결제로 넘어간다
      if (catalog.singleChoice) {
        const want = mission?.items[0];
        if (want) {
          const p = availableProduct(catalog, state, want);
          return { text: `'${p?.name}'을(를) 눌러 보세요. 누르면 ${flow.paymentStep} 화면으로 넘어가요.`, targetId: `product-${p?.id}` };
        }
        return { text: `원하는 항목을 눌러 보세요. 누르면 ${flow.paymentStep} 화면으로 넘어가요.` };
      }
      if (!mission) return { text: "원하는 메뉴를 눌러 자유롭게 담아 보세요." };
      // 아직 안 담긴 임무 항목 → 카테고리 → 상품 순으로 안내
      const missing = mission.items.find((it) => {
        const match = findMatch(state.cart, it);
        return !match || match.quantity !== it.quantity;
      });
      if (missing) {
        const p = availableProduct(catalog, state, missing);
        if (p && p.categoryId !== state.activeCategoryId) {
          const cat = catalog.categories.find((c) => c.id === p.categoryId);
          return { text: `'${cat?.label}' 칸을 눌러 보세요. ${p.name}이(가) 거기 있어요.`, targetId: `category-${p.categoryId}` };
        }
        return { text: `'${p?.name}'을(를) 눌러 보세요.`, targetId: `product-${p?.id}` };
      }
      // 다 담았으면 장바구니로
      return { text: `다 골랐어요. '${flow.reviewButton}' 버튼을 눌러 선택한 내용을 확인해 보세요.`, targetId: "open-cart" };
    }

    case "options": {
      if (!state.editing) return { text: "옵션을 골라 보세요." };
      const item = mission?.items.find((it) => missionAcceptsProduct(it, state.editing!.productId));
      // 임무 옵션과 다른 것부터 안내
      for (const [gid, want] of Object.entries(item?.options ?? {})) {
        if (state.editing.options[gid] !== want) {
          const g = catalog.optionGroups.find((og) => og.id === gid);
          return { text: `${g?.label}은(는) '${optionLabel(catalog, gid, want)}'를 골라 보세요.`, targetId: `option-${gid}-${want}` };
        }
      }
      if (item && state.editing.quantity !== item.quantity) {
        return { text: `수량을 ${item.quantity}${catalog.unitLabel}로 맞춰 보세요.`, targetId: "qty" };
      }
      return { text: "'담기' 버튼을 눌러 장바구니에 담아 보세요.", targetId: "confirm-item" };
    }

    case "cart": {
      const checkoutLabel = catalog.checkoutLabel ?? "결제하기";
      if (!mission) return { text: `내역을 확인하고 '${checkoutLabel}'를 눌러 보세요.`, targetId: "checkout" };
      const extra = state.cart.filter((c) => !mission.items.some((m) => findMatch([c], m)));
      if (extra.length > 0) {
        const name = productName(catalog, extra[0].productId);
        return { text: `'${name}'은(는) 임무에 없는 메뉴예요. 옆의 '삭제'를 눌러 빼 보세요.`, targetId: `remove-${extra[0].uid}` };
      }
      const missing = mission.items.find((it) => {
        const match = findMatch(state.cart, it);
        return !match || match.quantity !== it.quantity;
      });
      if (missing) {
        return { text: "아직 임무 메뉴가 다 담기지 않았어요. '메뉴로 돌아가기'를 눌러 보세요.", targetId: "close-cart" };
      }
      return { text: `선택한 내용이 맞아요. '${checkoutLabel}'를 눌러 보세요.`, targetId: "checkout" };
    }

    case "payMethod": {
      if (!mission?.paymentMethod) return { text: flow.paymentPrompt };
      const m = catalog.paymentMethods.find((mm) => mm.id === mission.paymentMethod);
      return { text: `'${m?.label}'를 눌러 보세요.`, targetId: `pay-${mission.paymentMethod}` };
    }

    case "processing":
      return { text: `${flow.processingMessage}. 잠시만 기다려 주세요.` };

    case "payError":
      return { text: "괜찮아요, 실제로도 자주 있는 일이에요. '다시 시도'를 눌러 보세요.", targetId: "retry-pay" };

    case "receipt": {
      if (mission?.receipt === undefined) return { text: "영수증이 필요하면 '받기', 아니면 '받지 않기'를 눌러 보세요." };
      return mission.receipt
        ? { text: "이번 임무는 영수증을 받는 거예요. '영수증 받기'를 눌러 보세요.", targetId: "receipt-yes" }
        : { text: "이번 임무는 영수증을 받지 않는 거예요. '받지 않기'를 눌러 보세요.", targetId: "receipt-no" };
    }

    case "printerFail":
      return { text: "괜찮아요, 종이가 걸리면 생기는 일이에요. '다시 출력하기'를 눌러 보세요.", targetId: "retry-print" };

    case "done":
      return { text: "연습을 끝냈어요!" };
  }
}
