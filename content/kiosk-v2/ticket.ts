// 든든기차 표 예매 — 엔진 v2 카탈로그 + 임무 시나리오 (명세 8.5).
// 기차·고속버스 예매의 공통 흐름을 재구성한다 (실제 예매·결제 없음, 실명 입력 없음).
// 엔진 기능 조합만으로 구성: 편도/왕복=serviceTypes, 행선지=카테고리, 열차 시간=상품,
// 좌석 등급·위치=옵션, 매수=수량, 인기 시간 매진=soldOutAlternative + 대체 시간 either-of.
// 연습 단순화를 위해 출발지는 서울로 고정한다.
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const ticketCatalog = validateCatalog({
  kioskType: "ticket",
  brand: "든든기차",
  emoji: "🚄",
  place: "기차역",
  unitLabel: "장",
  serviceQuestion: "어떻게 다녀오시나요?",
  serviceTypes: [
    { id: "oneway", label: "편도 (가는 표만)", emoji: "➡️" },
    { id: "round", label: "왕복 (가고 오는 표)", emoji: "🔁" },
  ],
  checkoutLabel: "결제하기",
  categories: [
    { id: "daejeon", label: "대전행" },
    { id: "busan", label: "부산행" },
  ],
  optionGroups: [
    {
      id: "trainClass",
      label: "좌석 등급",
      defaultChoiceId: "normal",
      choices: [
        { id: "normal", label: "일반실" },
        { id: "first", label: "우등실", priceDelta: 4000 },
      ],
    },
    {
      id: "seatPos",
      label: "좌석 위치",
      required: true, // 실제 예매의 핵심 선택 — 반드시 고르게 한다
      choices: [
        { id: "window", label: "창가 자리" },
        { id: "aisle", label: "복도 자리" },
      ],
    },
  ],
  products: [
    { id: "d9", name: "서울 → 대전 · 오전 9시", emoji: "🚄", price: 10000, categoryId: "daejeon", optionGroupIds: ["trainClass", "seatPos"] },
    { id: "d10", name: "서울 → 대전 · 오전 10시", emoji: "🚄", price: 10000, categoryId: "daejeon", optionGroupIds: ["trainClass", "seatPos"] },
    { id: "d14", name: "서울 → 대전 · 오후 2시", emoji: "🚆", price: 10000, categoryId: "daejeon", optionGroupIds: ["trainClass", "seatPos"] },
    { id: "b10", name: "서울 → 부산 · 오전 10시", emoji: "🚄", price: 28000, categoryId: "busan", optionGroupIds: ["trainClass", "seatPos"] },
    { id: "b14", name: "서울 → 부산 · 오후 2시", emoji: "🚆", price: 28000, categoryId: "busan", optionGroupIds: ["trainClass", "seatPos"] },
  ],
  paymentMethods: [
    { id: "card", label: "카드", emoji: "💳", hint: "넣거나 갖다 대기" },
    { id: "mobile", label: "휴대전화 결제", emoji: "📱", hint: "화면에 휴대전화 갖다 대기" },
  ],
});

const raw: unknown[] = [
  // ── 천천히 배우기 ──
  {
    id: "ticket-learn-daejeon",
    kioskType: "ticket",
    title: "대전 가는 표 한 장 사기",
    mode: "learn",
    missionText: "대전행 오전 10시 기차표를 편도로 한 장 사 보세요. 좌석은 창가로, 카드로 계산해요.",
    mission: {
      serviceType: "oneway",
      items: [{ productId: "d10", quantity: 1, options: { seatPos: "window" } }],
      paymentMethod: "card",
    },
  },
  {
    id: "ticket-learn-two",
    kioskType: "ticket",
    title: "부부 나들이 표 두 장",
    mode: "learn",
    missionText: "부산행 오후 2시 기차표를 두 장 사 보세요. 편도, 복도 자리로 골라요.",
    mission: {
      serviceType: "oneway",
      items: [{ productId: "b14", quantity: 2, options: { seatPos: "aisle" } }],
    },
  },

  // ── 혼자 연습하기 ──
  {
    id: "ticket-solo-first-class",
    kioskType: "ticket",
    title: "우등실로 편하게 가기",
    mode: "solo",
    missionText: "부산행 오전 10시 표를 우등실 창가 자리로 한 장 예매하고, 카드로 계산해 보세요. 왕복으로요.",
    mission: {
      serviceType: "round",
      items: [{ productId: "b10", quantity: 1, options: { trainClass: "first", seatPos: "window" } }],
      paymentMethod: "card",
    },
  },
  {
    id: "ticket-solo-fix-cart",
    kioskType: "ticket",
    title: "잘못 고른 표 바꾸기",
    mode: "solo",
    missionText: "부산행 표가 잘못 담겨 있어요. 삭제하고, 대전행 오후 2시 창가 자리 한 장으로 다시 예매해 보세요.",
    mission: {
      serviceType: "oneway",
      items: [{ productId: "d14", quantity: 1, options: { seatPos: "window" } }],
    },
    preloadCart: [{ productId: "b14", quantity: 1, options: { trainClass: "normal", seatPos: "window" } }],
  },

  // ── 실제처럼 도전 ──
  {
    id: "ticket-challenge-soldout",
    kioskType: "ticket",
    title: "원하는 시간이 매진이어도",
    mode: "challenge",
    missionText: "대전행 오전 9시가 매진이면 오전 10시나 오후 2시 표를 일반실 복도 자리로 예매하고 영수증을 받으세요.",
    mission: {
      serviceType: "oneway",
      items: [{ productId: "d9", alternativeProductIds: ["d10", "d14"], quantity: 1, options: { trainClass: "normal", seatPos: "aisle" } }],
      receipt: true,
    },
    events: ["soldOutAlternative"],
    layout: "left",
  },
  {
    id: "ticket-challenge-cardfail",
    kioskType: "ticket",
    title: "결제 오류 넘기고 예매 완료",
    mode: "challenge",
    missionText: "대전행 오전 9시 표 두 장을 창가 자리로 예매하고 카드로 계산하세요. 결제 중 문제가 생기면 직접 해결해 보세요.",
    mission: {
      serviceType: "oneway",
      items: [{ productId: "d9", quantity: 2, options: { seatPos: "window" } }],
      paymentMethod: "card",
    },
    events: ["cardFailOnce"],
    layout: "left",
  },

  // ── 자유 연습 ──
  {
    id: "ticket-free",
    kioskType: "ticket",
    title: "자유 연습 — 마음껏 눌러 보세요",
    mode: "free",
  },
];

export const ticketScenarios: Scenario[] = raw.map((r) => validateScenario(r, ticketCatalog));

export function getTicketScenario(id: string): Scenario | undefined {
  return ticketScenarios.find((s) => s.id === id);
}
