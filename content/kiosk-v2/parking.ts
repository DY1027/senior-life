// 든든주차 — 엔진 v2 카탈로그 + 임무 시나리오.
// 주차 정산기 흐름: 차 번호 입력(키패드) → 내 차 확인 → 요금·할인 선택 → 결제.
// 요금은 하나만 고르는 구조(singleChoice)라 장바구니 없이 바로 결제로 넘어간다.
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const parkingCatalog = validateCatalog({
  kioskType: "parking",
  brand: "든든주차",
  emoji: "🅿️",
  place: "주차장",
  unitLabel: "건",
  serviceTypes: [], // 주문 방법 단계 없음
  singleChoice: true,
  keypad: {
    title: "차 번호 뒤 4자리를 눌러요",
    guide: "실제 기계처럼 숫자판으로 차 번호 뒤 네 자리를 눌러 주세요. 연습이니 아무 숫자나 괜찮아요.",
    length: 4,
  },
  carSelect: {
    title: "내 차가 맞는지 확인해요",
    guide: "사진과 들어온 시간을 보고 내 차를 골라 주세요. 연습이니 아무 차나 괜찮아요.",
    cars: [
      { id: "white", label: "흰색 승용차", sublabel: "오후 2시 10분에 들어옴", emoji: "🚗" },
      { id: "gray", label: "회색 승용차", sublabel: "오후 1시 40분에 들어옴", emoji: "🚙" },
    ],
  },
  categories: [{ id: "fee", label: "요금" }],
  optionGroups: [],
  products: [
    { id: "fee-normal", name: "할인 없이 정산 (1시간 30분)", voiceName: "할인 없이 정산하기", emoji: "🧾", price: 3000, categoryId: "fee" },
    { id: "fee-discount", name: "매장 할인 적용 (1시간 무료)", voiceName: "매장 할인 적용하기", emoji: "🎟️", price: 2000, categoryId: "fee" },
  ],
  paymentMethods: [
    { id: "card", label: "카드", emoji: "💳", hint: "넣거나 갖다 대기" },
    { id: "cash", label: "현금 (지폐)", voiceLabel: "현금", emoji: "💵", hint: "지폐 넣는 곳에 넣기" },
  ],
});

const raw: unknown[] = [
  // ── 천천히 배우기 ──
  {
    id: "parking-learn-card",
    kioskType: "parking",
    title: "주차요금 카드로 정산하기",
    mode: "learn",
    missionText: "차 번호를 입력하고 내 차를 찾아서, 주차요금 3,000원을 카드로 정산해 보세요.",
    mission: {
      items: [{ productId: "fee-normal", quantity: 1 }],
      paymentMethod: "card",
    },
  },
  {
    id: "parking-learn-cash",
    kioskType: "parking",
    title: "현금으로 정산하기",
    mode: "learn",
    missionText: "주차요금을 할인 없이 현금으로 정산해 보세요.",
    mission: {
      items: [{ productId: "fee-normal", quantity: 1 }],
      paymentMethod: "cash",
    },
  },

  // ── 혼자 연습하기 ──
  {
    id: "parking-solo-discount",
    kioskType: "parking",
    title: "매장 할인 챙겨서 정산",
    mode: "solo",
    missionText: "매장 할인을 적용해 2,000원만 카드로 내고, 영수증을 받아 보세요.",
    mission: {
      items: [{ productId: "fee-discount", quantity: 1 }],
      paymentMethod: "card",
      receipt: true,
    },
  },

  // ── 실제처럼 도전 ──
  {
    id: "parking-challenge-cardfail",
    kioskType: "parking",
    title: "결제 오류 만나도 침착하게",
    mode: "challenge",
    missionText: "매장 할인을 적용해 카드로 정산하세요. 카드가 한 번 안 읽힐 수 있어요 — 직접 해결해 보세요.",
    mission: {
      items: [{ productId: "fee-discount", quantity: 1 }],
      paymentMethod: "card",
    },
    events: ["cardFailOnce"],
  },

  // ── 자유 연습 ──
  {
    id: "parking-free",
    kioskType: "parking",
    title: "자유 연습 — 마음껏 눌러 보세요",
    mode: "free",
  },
];

export const parkingScenarios: Scenario[] = raw.map((r) => validateScenario(r, parkingCatalog));

export function getParkingScenario(id: string): Scenario | undefined {
  return parkingScenarios.find((s) => s.id === id);
}
