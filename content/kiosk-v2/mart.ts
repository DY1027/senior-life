// 든든마트 셀프계산대 — 엔진 v2 카탈로그 + 임무 시나리오 (명세 8.6).
// 상품을 누르는 것이 '스캔'이다: 같은 상품을 또 누르면 수량이 합쳐지고(중복 스캔),
// scanFailOnce 이벤트로 바코드 인식 실패 → 재스캔을 연습한다.
// 회원 적립은 serviceTypes로 물어 '건너뛰기'를 연습한다 — 전화번호는 입력하지 않는다.
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const martCatalog = validateCatalog({
  kioskType: "mart",
  brand: "든든마트",
  emoji: "🛒",
  place: "마트",
  unitLabel: "개",
  serviceQuestion: "회원 적립 하시겠어요?",
  serviceTypes: [
    { id: "skip", label: "적립 안 함 (건너뛰기)", voiceLabel: "적립 안 함", emoji: "➡️" },
    { id: "point", label: "포인트 적립하기", emoji: "📱" },
  ],
  categories: [
    { id: "basket", label: "바구니 속 상품" },
    { id: "extra", label: "봉투·기타", voiceLabel: "봉투와 기타" },
  ],
  optionGroups: [],
  products: [
    { id: "milk", name: "우유 1L", voiceName: "우유 일 리터", emoji: "🥛", price: 2500, categoryId: "basket" },
    { id: "ramen", name: "라면 묶음", emoji: "🍜", price: 3500, categoryId: "basket" },
    { id: "apple", name: "사과 한 봉지", emoji: "🍎", price: 5500, categoryId: "basket" },
    { id: "snack", name: "과자", emoji: "🍪", price: 1500, categoryId: "basket" },
    { id: "tofu", name: "두부", emoji: "🧊", price: 1800, categoryId: "basket" },
    { id: "bag", name: "장바구니 봉투", emoji: "🛍️", price: 100, categoryId: "extra" },
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
    id: "mart-learn-two-items",
    kioskType: "mart",
    title: "우유와 과자 계산하기",
    mode: "learn",
    missionText: "회원 적립은 건너뛰고, 우유 하나와 과자 하나를 스캔해서 카드로 계산해 보세요.",
    mission: {
      serviceType: "skip",
      items: [
        { productId: "milk", quantity: 1 },
        { productId: "snack", quantity: 1 },
      ],
      paymentMethod: "card",
    },
  },
  {
    id: "mart-learn-bag",
    kioskType: "mart",
    title: "봉투도 함께 계산하기",
    mode: "learn",
    missionText: "사과 한 봉지를 스캔하고, 봉투 한 장도 함께 담아 현금으로 계산해 보세요. 적립은 건너뛰어요.",
    mission: {
      serviceType: "skip",
      items: [
        { productId: "apple", quantity: 1 },
        { productId: "bag", quantity: 1 },
      ],
      paymentMethod: "cash",
    },
  },

  // ── 혼자 연습하기 ──
  {
    id: "mart-solo-double-scan",
    kioskType: "mart",
    title: "같은 상품 두 개 스캔하기",
    mode: "solo",
    missionText: "라면 묶음 두 개를 스캔해 보세요. 같은 상품을 두 번 누르면 수량이 늘어나요. 적립은 건너뛰고 카드로 계산해요.",
    mission: {
      serviceType: "skip",
      items: [{ productId: "ramen", quantity: 2 }],
      paymentMethod: "card",
    },
  },
  {
    id: "mart-solo-fix-cart",
    kioskType: "mart",
    title: "잘못 스캔한 상품 빼기",
    mode: "solo",
    missionText: "과자가 실수로 두 번 스캔돼 있어요. 주문 확인에서 과자를 삭제하고, 우유 하나와 두부 하나만 계산해 보세요.",
    mission: {
      serviceType: "skip",
      items: [
        { productId: "milk", quantity: 1 },
        { productId: "tofu", quantity: 1 },
      ],
    },
    preloadCart: [{ productId: "snack", quantity: 2 }],
  },

  // ── 실제처럼 도전 ──
  {
    id: "mart-challenge-scanfail",
    kioskType: "mart",
    title: "바코드가 안 읽혀도 침착하게",
    mode: "challenge",
    missionText: "우유 하나와 라면 묶음 하나를 스캔해 카드로 계산하고 영수증을 받으세요. 바코드가 한 번 안 읽힐 수 있어요 — 같은 상품을 다시 스캔하면 돼요.",
    mission: {
      serviceType: "skip",
      items: [
        { productId: "milk", quantity: 1 },
        { productId: "ramen", quantity: 1 },
      ],
      paymentMethod: "card",
      receipt: true,
    },
    events: ["scanFailOnce"],
    layout: "left",
  },
  {
    id: "mart-challenge-cardfail",
    kioskType: "mart",
    title: "계산대 결제 오류 해결",
    mode: "challenge",
    missionText: "사과 한 봉지와 봉투 한 장을 담아 카드로 계산하세요. 결제 중 문제가 생기면 직접 해결해 보세요.",
    mission: {
      serviceType: "skip",
      items: [
        { productId: "apple", quantity: 1 },
        { productId: "bag", quantity: 1 },
      ],
      paymentMethod: "card",
    },
    events: ["cardFailOnce"],
    layout: "left",
  },

  {
    id: "mart-challenge-timeout",
    kioskType: "mart",
    title: "천천히 골라도 괜찮아요",
    mode: "challenge",
    missionText: "우유 하나와 두부 하나를 스캔해 카드로 계산하세요. 중간에 '아직 계신가요?' 안내가 나와도 당황하지 말고 이어가면 돼요.",
    mission: {
      serviceType: "skip",
      items: [
        { productId: "milk", quantity: 1 },
        { productId: "tofu", quantity: 1 },
      ],
      paymentMethod: "card",
    },
    events: ["timeoutOnce"],
  },

  // ── 자유 연습 ──
  {
    id: "mart-free",
    kioskType: "mart",
    title: "자유 연습 — 마음껏 스캔해 보세요",
    mode: "free",
  },
];

export const martScenarios: Scenario[] = raw.map((r) => validateScenario(r, martCatalog));

export function getMartScenario(id: string): Scenario | undefined {
  return martScenarios.find((s) => s.id === id);
}
