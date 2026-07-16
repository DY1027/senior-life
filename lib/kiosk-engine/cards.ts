// 무작위 상황 카드 (명세 9.5) — 연습 시작 전에 한 장 뽑으면
// 그 판에 실제 상황(카드 오류·품절·바코드 실패)이 추가된다.
// 이미 완료한 키오스크에도 다시 들어올 이유를 만드는 장치.
// 천천히 배우기(learn) 모드에는 보여주지 않는다 (처음 배우는 사람 배려).
import type { Catalog, RandomEvent, Scenario } from "./types";

export type SituationCard = {
  id: string;
  label: string; // "💳 카드가 말썽!"
  desc: string;
  event: RandomEvent;
};

/** 이 카탈로그·시나리오 조합에서 뽑을 수 있는 카드들 */
export function availableCards(catalog: Catalog, scenario: Scenario): SituationCard[] {
  const has = new Set(scenario.events ?? []);
  const cards: SituationCard[] = [];

  if (!has.has("cardFailOnce")) {
    cards.push({
      id: "cardfail",
      label: "💳 카드가 말썽!",
      desc: "오늘은 카드가 한 번에 안 읽혀요. 침착하게 다시 시도해 보세요.",
      event: "cardFailOnce",
    });
  }

  // 품절 카드는 임무·미리 담긴 것 외의 상품이 있어야 한다 (decoy 대상 필요)
  const used = new Set([
    ...(scenario.mission?.items ?? []).map((i) => i.productId),
    ...(scenario.preloadCart ?? []).map((i) => i.productId),
  ]);
  if (!has.has("soldOutDecoy") && catalog.products.some((p) => !used.has(p.id))) {
    cards.push({
      id: "soldout",
      label: "🚫 오늘은 품절!",
      desc: "메뉴 하나가 품절이에요. 당황하지 말고 다른 것을 살펴보세요.",
      event: "soldOutDecoy",
    });
  }

  // 바코드 카드는 '스캔형' 기기(옵션 없는 상품만 있고, 요금형이 아닌 곳 — 마트)에서만
  if (
    !has.has("scanFailOnce") &&
    !catalog.singleChoice &&
    catalog.products.every((p) => (p.optionGroupIds ?? []).length === 0)
  ) {
    cards.push({
      id: "scanfail",
      label: "📛 바코드가 말썽!",
      desc: "첫 스캔이 안 읽혀요. 같은 상품을 한 번 더 스캔해 보세요.",
      event: "scanFailOnce",
    });
  }

  if (!has.has("printerFailOnce")) {
    cards.push({
      id: "printerfail",
      label: "🖨️ 영수증이 말썽!",
      desc: "영수증을 받기로 하면 프린터가 말썽이에요. 다시 출력해 보세요.",
      event: "printerFailOnce",
    });
  }

  if (!has.has("timeoutOnce")) {
    cards.push({
      id: "timeout",
      label: "⏰ 시간 초과 주의!",
      desc: "메뉴에서 잠시 멈추면 '아직 계신가요?' 안내가 나와요. 침착하게 이어가면 돼요.",
      event: "timeoutOnce",
    });
  }

  return cards;
}

export function drawRandomCard(cards: SituationCard[]): SituationCard | null {
  if (cards.length === 0) return null;
  return cards[Math.floor(Math.random() * cards.length)];
}
