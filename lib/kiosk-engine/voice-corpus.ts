import { nextGuidance } from "./evaluator";
import { createInitialState } from "./machine";
import { missionProductIds } from "./mission";
import type { Catalog, CartItem, MachineState, Scenario } from "./types";

export type KioskVoiceBundle = { catalog: Catalog; scenarios: readonly Scenario[] };

function cartItem(productId: string, quantity: number, options: Record<string, string>, uid: number): CartItem {
  return { productId, quantity, options, uid };
}

/**
 * 모든 시나리오의 상태를 대표 값으로 순회해 실제 GuidanceEngine이 만들 수 있는
 * 안내 문장을 모은다. 생성 스크립트와 전수 검사에서 같은 목록을 사용한다.
 */
export function collectKioskVoiceCorpus(bundles: readonly KioskVoiceBundle[]): string[] {
  const corpus = new Set<string>();

  for (const { catalog, scenarios } of bundles) {
    for (const scenario of scenarios) {
      const initial = createInitialState(catalog, scenario);
      const add = (state: MachineState) => corpus.add(nextGuidance(state, scenario, catalog).text);
      const at = (phase: MachineState["phase"], changes: Partial<MachineState> = {}): MachineState => ({
        ...initial,
        phase,
        ...changes,
      });

      add(initial);
      if (catalog.keypad) {
        add(at("keypad", { keypadValue: "" }));
        add(at("keypad", { keypadValue: "0".repeat(catalog.keypad.length) }));
      }
      if (catalog.carSelect) add(at("carSelect"));
      if (catalog.serviceTypes.length > 0) add(at("service"));

      const mission = scenario.mission;
      if (mission) {
        const completed: CartItem[] = [];
        let uid = 1;

        for (const item of mission.items) {
          const productId = missionProductIds(item).find((id) => !initial.soldOutIds.includes(id)) ?? item.productId;
          const product = catalog.products.find((candidate) => candidate.id === productId);
          if (!product) continue;

          if (catalog.singleChoice) {
            add(at("menu"));
          } else {
            const otherCategory = catalog.categories.find((category) => category.id !== product.categoryId);
            if (otherCategory) add(at("menu", { activeCategoryId: otherCategory.id, cart: [...completed] }));
            add(at("menu", { activeCategoryId: product.categoryId, cart: [...completed] }));

            const desiredOptions = item.options ?? {};
            const progressiveOptions: Record<string, string> = {};
            for (const [groupId, choiceId] of Object.entries(desiredOptions)) {
              add(at("options", {
                editing: { productId, options: { ...progressiveOptions }, quantity: item.quantity },
              }));
              progressiveOptions[groupId] = choiceId;
            }

            if ((product.optionGroupIds?.length ?? 0) > 0) {
              const wrongQuantity = item.quantity === 1 ? 2 : 1;
              add(at("options", {
                editing: { productId, options: { ...desiredOptions }, quantity: wrongQuantity },
              }));
              add(at("options", {
                editing: { productId, options: { ...desiredOptions }, quantity: item.quantity },
              }));
            }
          }

          completed.push(cartItem(productId, item.quantity, item.options ?? {}, uid));
          uid += 1;
        }

        if (!catalog.singleChoice) {
          add(at("menu", { cart: [...completed] }));
          if ((scenario.preloadCart?.length ?? 0) > 0) add(at("cart", { cart: initial.cart }));
          add(at("cart", { cart: [] }));
          add(at("cart", { cart: completed }));
        }
      } else {
        add(at("menu"));
        if (!catalog.singleChoice) add(at("cart"));
      }

      add(at("payMethod"));
      add(at("processing"));
      add(at("payError"));
      add(at("receipt"));
      add(at("printerFail"));
      add(at("done"));
    }
  }

  return [...corpus].sort((left, right) => left.localeCompare(right, "ko"));
}
