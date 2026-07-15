// 든든카페 — 엔진 v2 카탈로그 + 임무 시나리오.
// 가상 브랜드만 사용한다 (실제 카페 로고·상품 사진·UI 복제 금지).
// 여기 데이터는 모듈 로드 시점(빌드·서버 렌더)에 Zod 검증을 통과해야 한다 —
// 없는 상품·옵션을 참조하면 빌드가 실패하므로 데이터 실수가 배포되지 않는다.
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const cafeCatalog = validateCatalog({
  kioskType: "cafe",
  brand: "든든카페",
  emoji: "☕",
  place: "카페",
  unitLabel: "잔",
  serviceTypes: [
    { id: "dinein", label: "매장에서 먹기", emoji: "🍽️" },
    { id: "takeout", label: "포장하기 (가져가기)", emoji: "🥡" },
  ],
  categories: [
    { id: "coffee", label: "커피" },
    { id: "noncoffee", label: "차·음료" },
    { id: "dessert", label: "빵·간식" },
  ],
  optionGroups: [
    {
      id: "temperature",
      label: "온도",
      required: true, // 실제 키오스크처럼 반드시 고르게 한다
      choices: [
        { id: "hot", label: "따뜻하게" },
        { id: "ice", label: "차갑게" },
      ],
    },
    {
      id: "size",
      label: "크기",
      defaultChoiceId: "regular",
      choices: [
        { id: "regular", label: "보통" },
        { id: "large", label: "크게", priceDelta: 500 },
      ],
    },
    {
      id: "syrup",
      label: "시럽",
      defaultChoiceId: "none",
      choices: [
        { id: "none", label: "시럽 없음" },
        { id: "add", label: "시럽 추가", priceDelta: 300 },
      ],
    },
  ],
  products: [
    { id: "americano", name: "아메리카노", emoji: "☕", price: 3000, categoryId: "coffee", optionGroupIds: ["temperature", "size", "syrup"] },
    { id: "latte", name: "카페라테", emoji: "🥛", price: 4000, categoryId: "coffee", optionGroupIds: ["temperature", "size", "syrup"] },
    { id: "yuja", name: "유자차", emoji: "🍋", price: 4500, categoryId: "noncoffee", optionGroupIds: ["temperature", "size"] },
    { id: "icetea", name: "아이스티", emoji: "🧋", price: 3500, categoryId: "noncoffee", optionGroupIds: ["size"] },
    { id: "cookie", name: "쿠키", emoji: "🍪", price: 2500, categoryId: "dessert" },
    { id: "muffin", name: "머핀", emoji: "🧁", price: 3000, categoryId: "dessert" },
  ],
  paymentMethods: [
    { id: "card", label: "카드", emoji: "💳", hint: "넣거나 갖다 대기" },
    { id: "cash", label: "현금", emoji: "💵", hint: "지폐 넣는 곳에 넣기" },
    { id: "mobile", label: "휴대전화 결제", emoji: "📱", hint: "화면에 휴대전화 갖다 대기" },
  ],
});

const raw: unknown[] = [
  // ── 천천히 배우기: 버튼이 반짝이고 음성이 자동 안내 ──
  {
    id: "cafe-learn-americano",
    kioskType: "cafe",
    title: "따뜻한 아메리카노 포장하기",
    mode: "learn",
    missionText: "따뜻한 아메리카노 한 잔을 포장으로 주문하고, 카드로 계산해 보세요.",
    mission: {
      serviceType: "takeout",
      items: [{ productId: "americano", quantity: 1, options: { temperature: "hot" } }],
      paymentMethod: "card",
    },
  },
  {
    id: "cafe-learn-yuja",
    kioskType: "cafe",
    title: "유자차 매장에서 마시기",
    mode: "learn",
    missionText: "따뜻한 유자차 한 잔을 '매장에서 먹기'로 주문해 보세요.",
    mission: {
      serviceType: "dinein",
      items: [{ productId: "yuja", quantity: 1, options: { temperature: "hot" } }],
    },
  },

  // ── 혼자 연습하기: 강조 없이, 필요할 때만 도움말 ──
  {
    id: "cafe-solo-latte",
    kioskType: "cafe",
    title: "카페라테 꼼꼼 주문",
    mode: "solo",
    missionText: "따뜻한 카페라테 한 잔을 포장 주문하세요. 크기는 보통, 시럽은 넣지 말고, 카드로 결제하고 영수증은 받지 마세요.",
    mission: {
      serviceType: "takeout",
      items: [{ productId: "latte", quantity: 1, options: { temperature: "hot", size: "regular", syrup: "none" } }],
      paymentMethod: "card",
      receipt: false,
    },
  },
  {
    id: "cafe-solo-two-ice",
    kioskType: "cafe",
    title: "시원한 커피 두 잔",
    mode: "solo",
    missionText: "차가운 아메리카노 두 잔을 '매장에서 먹기'로 주문하고, 현금으로 계산해 보세요.",
    mission: {
      serviceType: "dinein",
      items: [{ productId: "americano", quantity: 2, options: { temperature: "ice" } }],
      paymentMethod: "cash",
    },
  },
  {
    id: "cafe-solo-fix-cart",
    kioskType: "cafe",
    title: "잘못 담은 메뉴 정리하기",
    mode: "solo",
    missionText: "장바구니에 아이스티가 잘못 담겨 있어요. 삭제하고, 따뜻한 유자차 한 잔을 포장 주문해 보세요.",
    mission: {
      serviceType: "takeout",
      items: [{ productId: "yuja", quantity: 1, options: { temperature: "hot" } }],
    },
    preloadCart: [{ productId: "icetea", quantity: 1, options: { size: "regular" } }],
  },

  // ── 실제처럼 도전: 화면 배치 변형 + 오류 상황 ──
  {
    id: "cafe-challenge-cardfail",
    kioskType: "cafe",
    title: "결제 오류 해결하기",
    mode: "challenge",
    missionText: "차가운 카페라테 한 잔과 쿠키 한 개를 포장 주문하고 카드로 결제하세요. 결제 중 문제가 생기면 직접 해결해 보세요.",
    mission: {
      serviceType: "takeout",
      items: [
        { productId: "latte", quantity: 1, options: { temperature: "ice" } },
        { productId: "cookie", quantity: 1 },
      ],
      paymentMethod: "card",
    },
    events: ["cardFailOnce"],
    layout: "left",
  },
  {
    id: "cafe-challenge-soldout",
    kioskType: "cafe",
    title: "품절 만나도 침착하게",
    mode: "challenge",
    missionText: "따뜻한 아메리카노 한 잔을 '크게'로 매장 주문하고, 영수증을 받아 보세요. 일부 메뉴는 품절일 수 있어요.",
    mission: {
      serviceType: "dinein",
      items: [{ productId: "americano", quantity: 1, options: { temperature: "hot", size: "large" } }],
      receipt: true,
    },
    events: ["soldOutDecoy"],
    layout: "left",
  },

  // ── 자유 연습: 임무 없이 마음껏 ──
  {
    id: "cafe-free",
    kioskType: "cafe",
    title: "자유 연습 — 마음껏 눌러 보세요",
    mode: "free",
  },
];

export const cafeScenarios: Scenario[] = raw.map((r) => validateScenario(r, cafeCatalog));

export function getCafeScenario(id: string): Scenario | undefined {
  return cafeScenarios.find((s) => s.id === id);
}
