import type { ShoppingMission } from "@/lib/shopping/schemas";

export const SHOPPING_VOICE_GUIDANCE = {
  hub: "오늘 할 연습을 하나 골라보세요. 처음이라면 처음 쇼핑 배우기를 눌러보세요.",
  missionIntro: "연습 시작하기 버튼을 누르면 상품 검색부터 한 단계씩 시작합니다.",
  catalog: "검색창에 필요한 상품이나 상황을 입력하고 검색 버튼을 눌러보세요.",
  searchResults: "상품 이름과 가격, 배송비를 비교한 뒤 하나를 눌러 상세 정보를 확인하세요.",
  noSearchResults: "찾는 상품이 없다면 추천 검색어를 참고해 더 짧은 말로 다시 검색해보세요.",
  productDetail: "필수 옵션을 고르고 수량을 확인한 다음 장바구니에 담기 버튼을 눌러보세요.",
  rainyBudget: "필수 품목을 하나씩 장바구니에 담고 배송비를 포함한 합계가 삼만 원 이하인지 확인하세요.",
  cart: "상품과 옵션, 수량, 배송비 포함 결제 예정 금액을 확인하세요. 잘못 담았다면 수정하거나 제거할 수 있습니다.",
  checkout: "상품과 배송비 포함 최종 금액을 확인하세요. 확인란을 누른 뒤 모의 결제 버튼을 누르면 연습 주문이 완료됩니다.",
  orderComplete: "연습 주문이 완료됐습니다. 실제 결제나 배송은 이루어지지 않았습니다.",
  orderHelp: "연습할 문제를 하나 골라보세요. 배송 조회, 주문 취소, 반품, 교환을 연습할 수 있습니다.",
  orderList: "연습 주문 목록입니다. 확인할 주문의 주문 상세 보기 버튼을 눌러보세요.",
  orderDetail: "주문 상태와 상품, 최종 금액을 확인하세요. 현재 상태에서 가능한 연습 버튼만 표시됩니다.",
  tracking: "배송 진행 상태를 순서대로 확인해보세요. 다음 상태로 진행 버튼을 누르면 배송 과정이 바뀝니다.",
  cancel: "취소 사유를 고른 다음 취소 신청 완료 버튼을 눌러 환불 금액을 확인해보세요.",
  return: "반품 사유를 고르고 반품 배송비와 환불 예정 금액을 확인해보세요.",
  exchange: "재고가 있는 새 옵션을 고른 다음 교환 신청 완료 버튼을 눌러보세요.",
  refund: "환불된 상품 금액과 차감된 반품 배송비, 최종 환불 금액을 차례로 확인해보세요.",
} as const;

const RUNNER_GUIDANCE: Record<ShoppingMission["mode"], readonly string[]> = {
  guided: [
    "검색창에 씨 타입 충전 케이블 이 미터라고 입력한 뒤 검색 버튼을 눌러보세요.",
    "검색 결과에서 상품 이름과 가격, 배송비를 비교하고 상품 하나를 골라보세요.",
    "상품 상세정보에서 단자와 배송비를 확인한 뒤 확인한 항목을 모두 눌러보세요.",
    "내 기기와 충전기에 맞는 단자를 골라보세요.",
    "사용할 장소를 생각해서 케이블 길이를 골라보세요.",
    "필요한 수량이 한 개인지 확인하고 수량 확인 버튼을 눌러보세요.",
    "선택한 단자와 길이, 수량을 다시 보고 장바구니에 담아보세요.",
    "상품 금액에 배송비를 더한 최종 금액을 확인해보세요.",
    "주문 전 상품, 옵션, 수량, 배송비 포함 총액을 모두 확인해보세요.",
  ],
  budget: [
    "장마철에 꼭 필요한 세 가지 품목과 삼만 원 예산을 먼저 확인하세요.",
    "우산, 제습용품, 미끄럼 방지용품을 하나씩 고르세요. 배송비도 함께 비교해야 합니다.",
    "배송비 포함 합계와 남은 예산을 확인하세요. 예산을 넘었다면 상품을 빼고 다시 고를 수 있습니다.",
    "필수 품목이 모두 있고 총액이 삼만 원 이하인지 마지막으로 확인하세요.",
  ],
  compare: [
    "비교할 조건을 먼저 확인하세요. 단자, 길이, 구성 수량, 배송비를 함께 봐야 합니다.",
    "비슷한 상품들의 조건과 배송비 포함 총비용을 비교한 뒤 하나를 골라보세요.",
    "고른 상품이 필요한 조건에 맞는지 마지막으로 확인해보세요.",
  ],
  mistake: [
    "원래 주문하려던 조건을 먼저 기억해보세요.",
    "주문 화면에서 잘못된 옵션, 수량, 정기배송, 배송비를 찾아 모두 눌러보세요.",
    "잘못된 선택을 올바른 값으로 고친 다음 확인하고 완료 버튼을 눌러보세요.",
  ],
};

export function getRunnerVoiceGuidance(mode: ShoppingMission["mode"], step: number): string {
  const messages = RUNNER_GUIDANCE[mode];
  return messages[Math.min(Math.max(step, 0), messages.length - 1)];
}

export function collectShoppingVoiceCorpus(): string[] {
  return [...new Set([
    ...Object.values(SHOPPING_VOICE_GUIDANCE),
    ...Object.values(RUNNER_GUIDANCE).flat(),
  ])].sort((left, right) => left.localeCompare(right, "ko"));
}
