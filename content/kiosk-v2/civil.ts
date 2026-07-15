// 든든민원 — 엔진 v2 카탈로그 + 임무 시나리오.
// 실제 기관 화면을 복제하지 않고 일반적인 무인발급 흐름만 재현한다 (명세 8.3).
// 매장/포장 개념이 없으므로 serviceTypes를 비워 주문 방법 단계를 건너뛴다.
// 실제 주민등록번호는 어디에도 입력하지 않는다 — 표시 여부만 옵션으로 고른다.
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const civilCatalog = validateCatalog({
  kioskType: "civil",
  brand: "든든민원",
  emoji: "🏛️",
  place: "무인민원발급기",
  unitLabel: "통",
  checkoutLabel: "수수료 결제하기",
  serviceTypes: [], // 발급기라 주문 방법 단계 없음
  categories: [
    { id: "resident", label: "주민등록" },
    { id: "family", label: "가족관계" },
  ],
  optionGroups: [
    {
      id: "maskId",
      label: "주민등록번호 표시",
      required: true, // 실제 발급기의 핵심 선택 — 반드시 고르게 한다
      choices: [
        { id: "masked", label: "뒷자리 가리기 (권장)" },
        { id: "full", label: "전체 표시" },
      ],
    },
    {
      id: "history",
      label: "주소 변동 내역",
      defaultChoiceId: "none",
      choices: [
        { id: "none", label: "포함 안 함" },
        { id: "include", label: "포함하기" },
      ],
    },
  ],
  products: [
    { id: "deungbon", name: "주민등록등본", emoji: "📄", price: 200, categoryId: "resident", optionGroupIds: ["maskId", "history"] },
    { id: "chobon", name: "주민등록초본", emoji: "📃", price: 200, categoryId: "resident", optionGroupIds: ["maskId", "history"] },
    { id: "family-cert", name: "가족관계증명서", emoji: "👨‍👩‍👧", price: 500, categoryId: "family", optionGroupIds: ["maskId"] },
  ],
  paymentMethods: [
    { id: "cash", label: "현금 (동전·지폐)", emoji: "💵", hint: "수수료 넣는 곳에 넣기" },
    { id: "card", label: "카드", emoji: "💳", hint: "넣거나 갖다 대기" },
  ],
});

const raw: unknown[] = [
  // ── 천천히 배우기 ──
  {
    id: "civil-learn-deungbon",
    kioskType: "civil",
    title: "주민등록등본 한 통 발급하기",
    mode: "learn",
    missionText: "주민등록등본 한 통을 발급해 보세요. 주민등록번호는 뒷자리를 가리고, 수수료는 현금으로 내요.",
    mission: {
      items: [{ productId: "deungbon", quantity: 1, options: { maskId: "masked" } }],
      paymentMethod: "cash",
    },
  },
  {
    id: "civil-learn-family",
    kioskType: "civil",
    title: "가족관계증명서 발급하기",
    mode: "learn",
    missionText: "가족관계증명서 한 통을 발급해 보세요. 주민등록번호는 뒷자리를 가려요.",
    mission: {
      items: [{ productId: "family-cert", quantity: 1, options: { maskId: "masked" } }],
    },
  },

  // ── 혼자 연습하기 ──
  {
    id: "civil-solo-chobon",
    kioskType: "civil",
    title: "초본 두 통, 조건 맞춰 발급",
    mode: "solo",
    missionText: "주민등록초본 두 통을 발급하세요. 주소 변동 내역을 포함하고, 뒷자리는 가리고, 카드로 계산해요.",
    mission: {
      items: [{ productId: "chobon", quantity: 2, options: { maskId: "masked", history: "include" } }],
      paymentMethod: "card",
    },
  },
  {
    id: "civil-solo-fix-cart",
    kioskType: "civil",
    title: "잘못 고른 서류 바꾸기",
    mode: "solo",
    missionText: "가족관계증명서가 잘못 담겨 있어요. 삭제하고, 주민등록등본 한 통(뒷자리 가림)을 발급해 보세요.",
    mission: {
      items: [{ productId: "deungbon", quantity: 1, options: { maskId: "masked" } }],
    },
    preloadCart: [{ productId: "family-cert", quantity: 1, options: { maskId: "masked" } }],
  },

  // ── 실제처럼 도전 ──
  {
    id: "civil-challenge-cardfail",
    kioskType: "civil",
    title: "발급 중 결제 오류 해결",
    mode: "challenge",
    missionText: "주민등록등본 세 통(뒷자리 가림)을 카드로 발급하세요. 결제 중 문제가 생기면 해결하고, 영수증을 받아 보세요.",
    mission: {
      items: [{ productId: "deungbon", quantity: 3, options: { maskId: "masked" } }],
      paymentMethod: "card",
      receipt: true,
    },
    events: ["cardFailOnce"],
    layout: "left",
  },

  // ── 자유 연습 ──
  {
    id: "civil-free",
    kioskType: "civil",
    title: "자유 연습 — 마음껏 눌러 보세요",
    mode: "free",
  },
];

export const civilScenarios: Scenario[] = raw.map((r) => validateScenario(r, civilCatalog));

export function getCivilScenario(id: string): Scenario | undefined {
  return civilScenarios.find((s) => s.id === id);
}
