// 키오스크 엔진 v2 — 공통 타입.
//
// 설계 원칙 (기술 명세서 2장):
// - 키오스크별 개별 개발 금지: 「공통 엔진 + 카탈로그(화면 구성) + 임무 시나리오」로 분리
// - "step 1→2→3" 슬라이드가 아니라 상태 중심(phase + 장바구니 + 결제 상태)으로 관리
// - 새 키오스크 추가 = 카탈로그·시나리오 데이터 추가 (엔진 수정 없음)
//
// 상태 머신은 외부 라이브러리(XState) 대신 타입이 완전한 리듀서로 구현한다.
// 상태·이벤트·전환이 machine.ts 한 곳에 명시적으로 모여 있어 예측 가능성은 같고,
// 시니어 대상 사이트라 번들 크기를 아끼는 쪽을 택했다. 필요해지면 같은 타입으로
// XState v5에 옮길 수 있도록 이벤트를 유니언으로 유지한다.

// ── 카탈로그 (키오스크별 화면 구성) ─────────────────────────────

export type OptionChoice = {
  id: string;
  label: string; // "따뜻하게"
  priceDelta?: number; // 크게 +500원 등
};

export type OptionGroup = {
  id: string; // "temperature"
  label: string; // "온도"
  choices: OptionChoice[];
  /** 지정하면 상품을 담기 전 반드시 골라야 한다 */
  required?: boolean;
  defaultChoiceId?: string;
};

export type Product = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  categoryId: string;
  /** 이 상품이 쓰는 옵션 그룹 id 목록 (순서대로 묻는다) */
  optionGroupIds?: string[];
};

export type Catalog = {
  kioskType: string; // "cafe"
  brand: string; // "든든카페" (가상 브랜드만 사용)
  emoji: string;
  place: string; // "카페" — 안내 문장용
  serviceTypes: { id: string; label: string; emoji: string }[]; // 매장/포장
  categories: { id: string; label: string }[];
  products: Product[];
  optionGroups: OptionGroup[];
  paymentMethods: { id: string; label: string; emoji: string; hint?: string }[];
  /** 수량 단위 (잔/개/통) */
  unitLabel: string;
};

// ── 임무 시나리오 ───────────────────────────────────────────────

export type MissionItem = {
  productId: string;
  quantity: number;
  /** optionGroupId → choiceId. 지정한 옵션만 판정한다 */
  options?: Record<string, string>;
};

export type MissionSpec = {
  /** 지정하면 매장/포장 선택을 판정 */
  serviceType?: string;
  items: MissionItem[];
  /** 지정하면 결제 수단을 판정 */
  paymentMethod?: string;
  /** 지정하면 영수증 선택을 판정 */
  receipt?: boolean;
};

/** 실제 기기에서 생길 수 있는 상황 (ErrorEngine이 주입) */
export type RandomEvent =
  | "cardFailOnce" // 첫 결제 시 카드 인식 실패 → 다시 시도
  | "soldOutDecoy"; // 임무와 무관한 상품 1개 품절 (품절 표시를 경험)

export type PracticeMode = "learn" | "solo" | "challenge" | "free";

export type Scenario = {
  id: string;
  kioskType: string;
  title: string; // "따뜻한 카페라테 포장하기"
  mode: PracticeMode;
  /** 화면에 보여줄 임무 문장. free 모드에서는 생략 */
  missionText?: string;
  /** free 모드에서는 생략 — 판정 없이 자유 이용 */
  mission?: MissionSpec;
  /** 시작 시 장바구니에 미리 담겨 있는 "잘못 담은" 항목 — 삭제 연습용 */
  preloadCart?: MissionItem[];
  events?: RandomEvent[];
  /** 화면 배치 변형 — 버튼 위치를 외우지 않고 찾는 연습 (기본 top) */
  layout?: "top" | "left";
};

// ── 장바구니·머신 상태 ─────────────────────────────────────────

export type CartItem = {
  uid: number; // 같은 상품을 옵션 달리 여러 번 담을 수 있어 별도 키
  productId: string;
  quantity: number;
  options: Record<string, string>;
};

export type Phase =
  | "intro" // 시작 안내 (임무 확인)
  | "service" // 매장/포장
  | "menu" // 메뉴 탐색 (카테고리 + 상품)
  | "options" // 상품 옵션·수량 선택
  | "cart" // 장바구니 확인·수정
  | "payMethod" // 결제 수단
  | "processing" // 결제 처리 중 (지연 연출)
  | "payError" // 카드 인식 실패 등 → 재시도
  | "receipt" // 영수증 선택
  | "done"; // 완료

export type MachineState = {
  phase: Phase;
  serviceType: string | null;
  activeCategoryId: string;
  /** options 단계에서 편집 중인 상품 */
  editing: { productId: string; options: Record<string, string>; quantity: number } | null;
  cart: CartItem[];
  soldOutIds: string[];
  payMethod: string | null;
  payAttempts: number;
  receiptChoice: boolean | null;
  /** 결과 화면 과정 피드백용 — 사용자가 해낸 일들 */
  achievements: string[];
  /** 도움말 사용 횟수 (기록용) */
  hintsUsed: number;
  nextUid: number;
};

export type MachineEvent =
  | { type: "START" }
  | { type: "SELECT_SERVICE"; serviceType: string }
  | { type: "SELECT_CATEGORY"; categoryId: string }
  | { type: "OPEN_PRODUCT"; productId: string }
  | { type: "SET_OPTION"; groupId: string; choiceId: string }
  | { type: "SET_QTY"; quantity: number }
  | { type: "CONFIRM_ITEM" } // 편집 중 상품을 장바구니에 담기
  | { type: "CANCEL_ITEM" } // 옵션 선택 취소
  | { type: "OPEN_CART" }
  | { type: "REMOVE_ITEM"; uid: number }
  | { type: "CHANGE_ITEM_QTY"; uid: number; quantity: number }
  | { type: "CLOSE_CART" } // 메뉴로 돌아가기
  | { type: "CHECKOUT" } // 장바구니 → 결제 수단
  | { type: "SELECT_PAY"; methodId: string }
  | { type: "PAY_RESULT"; ok: boolean } // PaymentSimulator가 지연 후 발행
  | { type: "RETRY_PAY" }
  | { type: "SELECT_RECEIPT"; want: boolean }
  | { type: "FINISH" }
  | { type: "BACK" }
  | { type: "RESTART" }
  | { type: "USE_HINT" };
