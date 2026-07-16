export const KIOSK_IDS = ["cafe", "fastfood", "ticket", "parking", "mart", "atm", "civil"] as const;

export type KioskId = (typeof KIOSK_IDS)[number];

export type KioskConfig = {
  id: KioskId;
  name: string;
  shortDescription: string;
  challengeDescription: string;
  safetyMessage: string;
  additionalSafetyMessage?: string;
  accentLabel: string;
  actualActions: string[];
  flowLabels: {
    serviceStep: string;
    reviewStep: string;
    paymentStep: string;
    processingStep: string;
    paymentErrorStep: string;
    reviewTitle: string;
    reviewButton: string;
    summaryTitle: string;
    processingMessage: string;
    transactionLabel: string;
    paymentPrompt: string;
  };
};

export const KIOSK_CONFIGS = {
  cafe: {
    id: "cafe",
    name: "든든카페",
    shortDescription: "카페 음료의 메뉴·온도·수량과 매장·포장을 골라 주문하는 연습이에요.",
    challengeDescription: "화면 배치가 달라지고, 상품 품절이나 결제 오류가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 주문이나 결제는 이루어지지 않아요.",
    accentLabel: "카페 주문 연습",
    actualActions: ["주문", "옵션 변경", "결제"],
    flowLabels: {
      serviceStep: "주문 방법",
      reviewStep: "주문 확인",
      paymentStep: "결제 방법",
      processingStep: "결제 중",
      paymentErrorStep: "결제 확인",
      reviewTitle: "주문 내역을 확인해요",
      reviewButton: "주문 확인",
      summaryTitle: "주문 내역",
      processingMessage: "결제 정보를 확인하고 있어요",
      transactionLabel: "결제",
      paymentPrompt: "결제 방법을 골라 보세요.",
    },
  },
  fastfood: {
    id: "fastfood",
    name: "든든버거",
    shortDescription: "햄버거 단품과 세트, 사이드와 음료 변경을 연습해요.",
    challengeDescription: "메뉴 구성이 달라지고, 상품 품절이나 쿠폰·결제 오류가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 주문이나 결제는 이루어지지 않아요.",
    accentLabel: "햄버거 주문 연습",
    actualActions: ["주문", "세트 변경", "결제"],
    flowLabels: {
      serviceStep: "주문 방법",
      reviewStep: "주문 확인",
      paymentStep: "결제 방법",
      processingStep: "결제 중",
      paymentErrorStep: "결제 확인",
      reviewTitle: "주문 내역을 확인해요",
      reviewButton: "주문 확인",
      summaryTitle: "주문 내역",
      processingMessage: "결제 정보를 확인하고 있어요",
      transactionLabel: "결제",
      paymentPrompt: "결제 방법을 골라 보세요.",
    },
  },
  ticket: {
    id: "ticket",
    name: "든든기차",
    shortDescription: "행선지·시간·좌석을 고르고 기차표를 예매하는 연습이에요.",
    challengeDescription: "원하는 시간이 매진되거나 좌석 선택과 결제 과정에서 문제가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 예매나 결제는 이루어지지 않아요.",
    accentLabel: "기차표 예매 연습",
    actualActions: ["행선지 선택", "좌석 선택", "예매"],
    flowLabels: {
      serviceStep: "예매 방법",
      reviewStep: "예매 확인",
      paymentStep: "결제 방법",
      processingStep: "결제 중",
      paymentErrorStep: "결제 확인",
      reviewTitle: "예매 내역을 확인해요",
      reviewButton: "예매 확인",
      summaryTitle: "예매 내역",
      processingMessage: "결제 정보를 확인하고 있어요",
      transactionLabel: "결제",
      paymentPrompt: "결제 방법을 골라 보세요.",
    },
  },
  parking: {
    id: "parking",
    name: "든든주차",
    shortDescription: "차량을 찾고 할인 여부를 확인해 주차요금을 정산하는 연습이에요.",
    challengeDescription: "차량 검색 실패나 할인 적용, 카드 결제 오류가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 차량 조회나 주차요금 결제는 이루어지지 않아요.",
    accentLabel: "주차 정산 연습",
    actualActions: ["차량 검색", "할인 적용", "정산"],
    flowLabels: {
      serviceStep: "차량 검색",
      reviewStep: "정산 확인",
      paymentStep: "결제 방법",
      processingStep: "결제 중",
      paymentErrorStep: "카드 확인",
      reviewTitle: "정산 내역을 확인해요",
      reviewButton: "정산 확인",
      summaryTitle: "정산 내역",
      processingMessage: "결제 정보를 확인하고 있어요",
      transactionLabel: "결제",
      paymentPrompt: "결제 방법을 골라 보세요.",
    },
  },
  mart: {
    id: "mart",
    name: "든든마트",
    shortDescription: "상품을 스캔하고 수량과 봉투를 확인해 계산하는 연습이에요.",
    challengeDescription: "바코드 인식, 상품 수량, 무게 확인이나 결제 오류가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 상품 구매나 결제는 이루어지지 않아요.",
    accentLabel: "마트 셀프계산 연습",
    actualActions: ["상품 스캔", "수량 확인", "결제"],
    flowLabels: {
      serviceStep: "적립 선택",
      reviewStep: "상품 확인",
      paymentStep: "결제 방법",
      processingStep: "결제 중",
      paymentErrorStep: "결제 확인",
      reviewTitle: "계산할 상품을 확인해요",
      reviewButton: "상품 확인",
      summaryTitle: "계산 내역",
      processingMessage: "결제 정보를 확인하고 있어요",
      transactionLabel: "결제",
      paymentPrompt: "결제 방법을 골라 보세요.",
    },
  },
  atm: {
    id: "atm",
    name: "든든은행",
    shortDescription: "연습 비밀번호로 출금·잔액 확인과 카드 회수를 연습해요.",
    challengeDescription: "카드 인식, 비밀번호 입력이나 거래 과정에서 오류가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 출금·입금·이체는 이루어지지 않아요.",
    additionalSafetyMessage: "실제 카드번호, 계좌번호 또는 비밀번호를 입력하지 마세요. 화면에 안내된 연습용 정보만 사용하세요.",
    accentLabel: "은행 ATM 연습",
    actualActions: ["연습 비밀번호 입력", "출금", "잔액 확인"],
    flowLabels: {
      serviceStep: "업무 선택",
      reviewStep: "거래 확인",
      paymentStep: "거래 확인",
      processingStep: "거래 중",
      paymentErrorStep: "카드 확인",
      reviewTitle: "거래 내용을 확인해요",
      reviewButton: "거래 확인",
      summaryTitle: "거래 내역",
      processingMessage: "거래 정보를 확인하고 있어요",
      transactionLabel: "거래",
      paymentPrompt: "화면의 거래 내용을 확인해 보세요.",
    },
  },
  civil: {
    id: "civil",
    name: "든든민원",
    shortDescription: "발급 서류와 표시 항목, 부수를 골라 발급 절차를 연습해요.",
    challengeDescription: "본인 확인, 항목 선택, 출력이나 결제 과정에서 오류가 생길 수 있어요.",
    safetyMessage: "이 화면은 연습용입니다. 실제 서류 발급이나 개인정보 입력은 이루어지지 않아요.",
    additionalSafetyMessage: "실제 주민등록번호나 개인 식별정보를 입력하지 마세요. 모든 입력값은 연습용입니다.",
    accentLabel: "서류 발급 연습",
    actualActions: ["서류 선택", "표시 항목 선택", "발급"],
    flowLabels: {
      serviceStep: "발급 준비",
      reviewStep: "발급 확인",
      paymentStep: "수수료 결제",
      processingStep: "발급 처리 중",
      paymentErrorStep: "결제 확인",
      reviewTitle: "발급 항목을 확인해요",
      reviewButton: "발급 항목 확인",
      summaryTitle: "발급 내역",
      processingMessage: "발급 정보를 확인하고 있어요",
      transactionLabel: "수수료 결제",
      paymentPrompt: "수수료 결제 방법을 골라 보세요.",
    },
  },
} satisfies Record<KioskId, KioskConfig>;

export function getKioskConfig(id: string): KioskConfig {
  const config = KIOSK_CONFIGS[id as KioskId];
  if (!config) {
    throw new Error(`[kiosk-config] '${id}' 키오스크 설정이 없습니다.`);
  }
  return config;
}
