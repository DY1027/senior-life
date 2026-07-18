// 든든버거 — 엔진 v2 카탈로그 + 임무 시나리오.
// 가상 브랜드만 사용한다 (실제 패스트푸드 로고·UI 복제 금지).
// 세트 상품은 음료·사이드 옵션을 갖고, 단품·사이드·음료는 옵션 없이 바로 담긴다 —
// "세트 음료 변경"(명세 8.2)을 옵션 변경으로 자연스럽게 연습하게 하는 구성.
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const burgerCatalog = validateCatalog({
  kioskType: "fastfood",
  brand: "든든버거",
  emoji: "🍔",
  place: "패스트푸드점",
  unitLabel: "개",
  serviceQuestion: "어디에서 드시겠어요?",
  serviceTypes: [
    { id: "dinein", label: "매장에서 먹기", emoji: "🍽️" },
    { id: "takeout", label: "포장하기 (가져가기)", voiceLabel: "포장하기", emoji: "🥡" },
  ],
  categories: [
    { id: "set", label: "세트 메뉴" },
    { id: "single", label: "단품·사이드", voiceLabel: "단품과 사이드" },
    { id: "drink", label: "음료·디저트", voiceLabel: "음료와 디저트" },
  ],
  optionGroups: [
    {
      id: "setDrink",
      label: "세트 음료",
      defaultChoiceId: "cola",
      choices: [
        { id: "cola", label: "콜라" },
        { id: "sprite", label: "사이다" },
        { id: "juice", label: "오렌지주스", priceDelta: 300 },
      ],
    },
    {
      id: "setSide",
      label: "세트 사이드",
      defaultChoiceId: "fries",
      choices: [
        { id: "fries", label: "감자튀김" },
        { id: "cheesestick", label: "치즈스틱", priceDelta: 500 },
      ],
    },
  ],
  products: [
    { id: "bulgogi-set", name: "불고기버거 세트", emoji: "🍔", price: 6500, categoryId: "set", optionGroupIds: ["setDrink", "setSide"] },
    { id: "shrimp-set", name: "새우버거 세트", emoji: "🍤", price: 7000, categoryId: "set", optionGroupIds: ["setDrink", "setSide"] },
    { id: "chicken-set", name: "치킨버거 세트", emoji: "🍗", price: 7200, categoryId: "set", optionGroupIds: ["setDrink", "setSide"] },
    { id: "bulgogi-single", name: "불고기버거 단품", emoji: "🍔", price: 4500, categoryId: "single" },
    { id: "fries", name: "감자튀김", emoji: "🍟", price: 2000, categoryId: "single" },
    { id: "cola", name: "콜라", emoji: "🥤", price: 1500, categoryId: "drink" },
    { id: "icecream", name: "아이스크림콘", emoji: "🍦", price: 800, categoryId: "drink" },
  ],
  paymentMethods: [
    { id: "card", label: "카드", emoji: "💳", hint: "넣거나 갖다 대기" },
    { id: "cash", label: "현금", emoji: "💵", hint: "지폐 넣는 곳에 넣기" },
    { id: "mobile", label: "휴대전화 결제", emoji: "📱", hint: "화면에 휴대전화 갖다 대기" },
  ],
});

const raw: unknown[] = [
  // ── 천천히 배우기 ──
  {
    id: "burger-learn-set",
    kioskType: "fastfood",
    title: "불고기버거 세트 주문하기",
    mode: "learn",
    missionText: "불고기버거 세트 하나를 매장에서 먹기로 주문하고, 카드로 계산해 보세요.",
    mission: {
      serviceType: "dinein",
      items: [{ productId: "bulgogi-set", quantity: 1 }],
      paymentMethod: "card",
    },
  },
  {
    id: "burger-learn-snack",
    kioskType: "fastfood",
    title: "간식 포장하기",
    mode: "learn",
    missionText: "감자튀김 하나와 아이스크림콘 하나를 포장으로 주문해 보세요.",
    mission: {
      serviceType: "takeout",
      items: [
        { productId: "fries", quantity: 1 },
        { productId: "icecream", quantity: 1 },
      ],
    },
  },

  // ── 혼자 연습하기 ──
  {
    id: "burger-solo-change-drink",
    kioskType: "fastfood",
    title: "세트 음료 바꾸기",
    mode: "solo",
    missionText: "새우버거 세트를 주문하되, 음료를 콜라에서 사이다로 바꿔 보세요. 매장에서 먹고 현금으로 계산해요.",
    mission: {
      serviceType: "dinein",
      items: [{ productId: "shrimp-set", quantity: 1, options: { setDrink: "sprite" } }],
      paymentMethod: "cash",
    },
  },
  {
    id: "burger-solo-fix-cart",
    kioskType: "fastfood",
    title: "주문 정리하고 다시 담기",
    mode: "solo",
    missionText: "장바구니에 치킨버거 세트가 잘못 담겨 있어요. 삭제하고, 불고기버거 단품과 콜라를 포장 주문해 보세요.",
    mission: {
      serviceType: "takeout",
      items: [
        { productId: "bulgogi-single", quantity: 1 },
        { productId: "cola", quantity: 1 },
      ],
    },
    preloadCart: [{ productId: "chicken-set", quantity: 1, options: { setDrink: "cola", setSide: "fries" } }],
  },

  // ── 실제처럼 도전 ──
  {
    id: "burger-challenge-cardfail",
    kioskType: "fastfood",
    title: "옵션 바꾸고 결제 오류 해결",
    mode: "challenge",
    missionText: "치킨버거 세트의 사이드를 치즈스틱으로, 음료를 오렌지주스로 바꿔 포장 주문하세요. 카드 결제 중 문제가 생기면 해결하고, 영수증을 받아 보세요.",
    mission: {
      serviceType: "takeout",
      items: [{ productId: "chicken-set", quantity: 1, options: { setDrink: "juice", setSide: "cheesestick" } }],
      paymentMethod: "card",
      receipt: true,
    },
    events: ["cardFailOnce"],
    layout: "left",
  },

  // ── 자유 연습 ──
  {
    id: "burger-free",
    kioskType: "fastfood",
    title: "자유 연습 — 마음껏 눌러 보세요",
    mode: "free",
  },
];

export const burgerScenarios: Scenario[] = raw.map((r) => validateScenario(r, burgerCatalog));

export function getBurgerScenario(id: string): Scenario | undefined {
  return burgerScenarios.find((s) => s.id === id);
}
