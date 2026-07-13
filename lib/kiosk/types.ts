// 키오스크 연습 시나리오 스키마.
// 화면을 하드코딩하지 않고 이 데이터 구조로 카페·병원·약국·패스트푸드·민원발급기까지
// 확장한다. content/kiosk/*.json 파일이 이 형태를 따른다.

export interface KioskOption {
  id: string;
  label: string; // 버튼에 크게 보이는 글자 (예: "매장에서 먹기")
  sublabel?: string; // 작은 부가 설명 (예: "4,500원")
  emoji?: string; // 버튼 위 큰 아이콘
  // 이 선택이 마지막 주문 요약에 어떻게 남을지
  summaryKey?: string; // 예: "주문 방식"
  summaryValue?: string; // 예: "매장에서 먹기"
  // 합계 금액 계산용(선택). price=단품 가격, qty=수량 배수.
  price?: number; // 예: 4500 (메뉴 선택 시)
  qty?: number; // 예: 2 (수량 선택 시)
}

export interface KioskStep {
  id: string;
  title: string; // 화면 상단 큰 질문 (예: "어디에서 드시겠어요?")
  guide?: string; // 보조 설명 (짧게)
  voice: string; // 음성으로 읽어 줄 안내 문장
  layout?: "list" | "grid"; // 버튼 배치 (기본 list)
  note?: string; // 화면 하단 작은 안내 (예: 결제 단계의 "실제 결제는 안 돼요")
  options: KioskOption[];
}

export interface KioskScenario {
  id: string; // "cafe"
  title: string; // "카페 키오스크 연습"
  place: string; // "카페"
  brand: string; // 화면 상단 가상 브랜드 이름 (예: "든든카페")
  emoji: string; // "☕"
  intro: string; // 시작 화면 안내
  successTitle: string; // 완료 화면 제목 (칭찬)
  steps: KioskStep[];
  // ── 시나리오별 문구·동작 커스터마이즈 (생략 시 카페 기준 기본값) ──
  finishLabel?: string; // 마지막 단계 버튼 글자 (기본 "결제하기". 병원 "접수하기", 민원 "발급하기")
  unitLabel?: string; // 수량 단위 (기본 "잔". 패스트푸드 "개", 민원 "통")
  cartEmptyText?: string; // 금액 선택 전 하단 안내 (기본 "메뉴를 고르면 금액이 나와요")
  showTicket?: boolean; // 완료 화면 대기 번호표 표시 (기본 true. 민원발급기는 false)
  ticketNote?: string; // 번호표 아래 설명 (기본은 카페 음료 수령 안내)
  receiptTitle?: string; // 완료 화면 내역 제목 (기본 "영수증". 병원 "접수증", 민원 "발급 내역")
  receiptNote?: string; // 내역 설명 박스 문구 (기본은 카페 영수증 안내)
}
