// 든든ATM — 엔진 v2 카탈로그 + 임무 시나리오 (명세 8.7).
//
// 안전 제한 (명세 그대로, 절대 지킬 것):
// - 실제 은행 로고·실제 카드번호·실제 계좌번호를 쓰지 않는다 (가상 브랜드 "든든은행")
// - 비밀번호는 화면에서 제시한 연습 번호(1 2 3 4)만 쓰게 안내하고, 입력값은 저장·검증하지 않는다
// - 실제 송금 기능 없음 — 송금 임무보다 보이스피싱 예방과 거래 취소를 강조한다 (payNote 상시 경고)
import { validateCatalog, validateScenario } from "@/lib/kiosk-engine/schemas";
import type { Scenario } from "@/lib/kiosk-engine/types";

export const atmCatalog = validateCatalog({
  kioskType: "atm",
  brand: "든든은행 ATM",
  emoji: "🏧",
  place: "은행",
  unitLabel: "건",
  serviceTypes: [], // 주문 방법 단계 없음
  singleChoice: true, // 업무를 고르면 바로 확인 화면으로
  startLabel: "🪪 카드 넣기",
  keypad: {
    title: "비밀번호 4자리를 눌러요",
    guide: "연습 비밀번호는 일, 이, 삼, 사예요. 진짜 비밀번호는 연습 화면에 절대 입력하지 마세요.",
    length: 4,
    mask: true, // 실제 ATM처럼 ●로 가려서 — 비밀번호는 가리고 누르는 습관
  },
  categories: [
    { id: "withdraw", label: "돈 찾기" },
    { id: "etc", label: "다른 업무" },
  ],
  optionGroups: [],
  products: [
    { id: "w3", name: "3만원 찾기", voiceName: "삼만 원 찾기", emoji: "💵", price: 30000, categoryId: "withdraw" },
    { id: "w5", name: "5만원 찾기", voiceName: "오만 원 찾기", emoji: "💵", price: 50000, categoryId: "withdraw" },
    { id: "w10", name: "10만원 찾기", voiceName: "십만 원 찾기", emoji: "💰", price: 100000, categoryId: "withdraw" },
    { id: "balance", name: "잔액 확인", emoji: "🔍", price: 0, categoryId: "etc" },
  ],
  paymentMethods: [
    { id: "confirm", label: "확인하고 진행하기", emoji: "✅", hint: "가상 통장에서 처리돼요 (연습)" },
  ],
  payQuestion: "거래 내용을 확인해 주세요",
  payNote: "⚠️ 잠깐! 모르는 사람이 전화로 시켜서 하는 출금·이체라면 지금 멈추고 112에 전화하세요. 은행·검찰·경찰은 절대 돈을 옮기라고 하지 않아요.",
  receiptQuestion: "명세표를 받으시겠어요?",
  doneNote: "🪪 카드를 잊지 말고 꼭 챙기세요! 기계에서 소리가 나면 카드가 나온 거예요.",
});

const raw: unknown[] = [
  // ── 천천히 배우기 ──
  {
    id: "atm-learn-withdraw",
    kioskType: "atm",
    title: "3만원 찾아보기",
    mode: "learn",
    missionText: "카드를 넣고 연습 비밀번호(1234)를 누른 뒤, 3만원을 찾아 보세요. 명세표는 받지 않아요.",
    mission: {
      items: [{ productId: "w3", quantity: 1 }],
      receipt: false,
    },
  },
  {
    id: "atm-learn-balance",
    kioskType: "atm",
    title: "잔액 확인해 보기",
    mode: "learn",
    missionText: "통장에 돈이 얼마 있는지 확인해 보세요. '다른 업무'에서 잔액 확인을 누르면 돼요.",
    mission: {
      items: [{ productId: "balance", quantity: 1 }],
    },
  },

  // ── 혼자 연습하기 ──
  {
    id: "atm-solo-receipt",
    kioskType: "atm",
    title: "5만원 찾고 명세표 받기",
    mode: "solo",
    missionText: "5만원을 찾고 명세표를 받아 보세요. 명세표는 거래가 잘 됐는지 확인하는 종이예요.",
    mission: {
      items: [{ productId: "w5", quantity: 1 }],
      receipt: true,
    },
  },
  {
    id: "atm-solo-safety",
    kioskType: "atm",
    title: "보이스피싱 점검하며 출금",
    mode: "solo",
    missionText: "10만원을 찾기 전에, 확인 화면의 노란 경고문을 꼭 읽어 보세요. 누가 시켜서 하는 출금이라면 멈추는 게 정답이에요.",
    mission: {
      items: [{ productId: "w10", quantity: 1 }],
      receipt: false,
    },
  },

  // ── 실제처럼 도전 ──
  {
    id: "atm-challenge-cardfail",
    kioskType: "atm",
    title: "카드가 안 읽혀도 침착하게",
    mode: "challenge",
    missionText: "3만원을 찾으세요. 카드가 한 번 안 읽힐 수 있어요 — 방향을 확인하고 다시 시도하면 돼요. 명세표도 받아 보세요.",
    mission: {
      items: [{ productId: "w3", quantity: 1 }],
      receipt: true,
    },
    events: ["cardFailOnce"],
  },

  // ── 자유 연습 ──
  {
    id: "atm-free",
    kioskType: "atm",
    title: "자유 연습 — 마음껏 눌러 보세요",
    mode: "free",
  },
];

export const atmScenarios: Scenario[] = raw.map((r) => validateScenario(r, atmCatalog));

export function getAtmScenario(id: string): Scenario | undefined {
  return atmScenarios.find((s) => s.id === id);
}
