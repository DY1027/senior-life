// 생활기기 연습 목록 — 홈·연습 허브·내 기록·오늘의 연습이 모두 이 데이터를 쓴다.
// 새 연습을 추가하면 여기에 등록해야 도장판·이어하기에 함께 잡힌다.

export type Practice = {
  id: string; // KioskScenario.id 와 동일해야 기록이 연결된다
  title: string; // 목록에 크게 보이는 이름
  short: string; // 짧은 이름 (도장·이어하기 문구용)
  desc: string;
  href: string;
  category: "먹고 마시기" | "이동하기" | "장보고 이용하기" | "공공생활";
  img?: string; // 일러스트가 없으면 emoji 박스로 대신 그린다
  emoji: string;
};

export const PRACTICES: Practice[] = [
  {
    id: "cafe",
    title: "카페 주문",
    short: "카페 주문",
    desc: "임무를 고르고 3가지 모드로 연습 — 메뉴 삭제·카드 오류까지",
    href: "/kiosk/cafe",
    category: "먹고 마시기",
    img: "/tiles/kiosk-cafe.webp",
    emoji: "☕",
  },
  {
    id: "fastfood",
    title: "햄버거 주문",
    short: "햄버거 주문",
    desc: "세트 음료·사이드 바꾸기, 주문 정리, 결제 오류까지",
    href: "/kiosk/fastfood",
    category: "먹고 마시기",
    img: "/tiles/kiosk-fastfood.webp",
    emoji: "🍔",
  },
  {
    id: "ticket",
    title: "기차표 예매",
    short: "기차표 예매",
    desc: "행선지·시간·좌석 고르기, 매진 대처, 결제까지",
    href: "/kiosk/ticket",
    category: "이동하기",
    emoji: "🚄",
  },
  {
    id: "parking",
    title: "주차요금 정산",
    short: "주차요금 정산",
    desc: "숫자판으로 차 번호 입력, 할인 적용, 결제 오류까지",
    href: "/kiosk/parking",
    category: "이동하기",
    emoji: "🅿️",
  },
  {
    id: "mart",
    title: "마트 셀프계산",
    short: "마트 셀프계산",
    desc: "상품 스캔, 봉투·적립 선택, 바코드 오류 대처까지",
    href: "/kiosk/mart",
    category: "장보고 이용하기",
    emoji: "🛒",
  },
  {
    id: "civil",
    title: "서류 발급",
    short: "서류 발급",
    desc: "등본·초본·가족관계증명서, 표시 옵션과 수수료까지",
    href: "/kiosk/civil",
    category: "공공생활",
    img: "/tiles/kiosk-civil.webp",
    emoji: "🏛️",
  },
];

// 다음에 열릴 연습 예고 — 미완성처럼 보이지 않게 한 번에 하나만 보여준다.
export const UPCOMING_PRACTICE = {
  title: "은행 ATM",
  category: "공공생활" as const,
  emoji: "🏧",
};

// 최근에 새로 열린 연습 (홈의 "새로 생긴 연습" 알림에 쓴다)
export const NEW_PRACTICE_ID = "ticket";

export function getPractice(id: string): Practice | undefined {
  return PRACTICES.find((p) => p.id === id);
}

// 오늘의 임무 — 방문할 때마다(하루 단위) 다른 목표를 제시한다.
export type DailyMission = {
  practiceId: string;
  text: string; // "오늘은 ~ 해보세요" 문장
};

export const MISSIONS: DailyMission[] = [
  { practiceId: "cafe", text: "카페에서 따뜻한 아메리카노 두 잔을 포장 주문해보세요." },
  { practiceId: "fastfood", text: "햄버거 세트를 고르고, 음료를 사이다로 바꿔보세요." },
  { practiceId: "parking", text: "주차요금을 확인하고 카드로 결제해보세요." },
  { practiceId: "civil", text: "주민등록등본 한 통을 발급해보세요." },
  { practiceId: "cafe", text: "시원한 음료 한 잔을 매장에서 먹기로 주문해보세요." },
  { practiceId: "parking", text: "할인 도장을 적용해서 주차요금을 정산해보세요." },
  { practiceId: "civil", text: "가족관계증명서 한 통을 발급해보세요." },
  { practiceId: "fastfood", text: "햄버거 단품 말고 세트 메뉴로 주문을 끝내보세요." },
  { practiceId: "mart", text: "마트에서 우유와 과자를 스캔하고 적립은 건너뛰어 보세요." },
  { practiceId: "mart", text: "같은 상품을 두 번 스캔해서 수량을 늘려 보세요." },
  { practiceId: "ticket", text: "대전 가는 기차표를 창가 자리로 한 장 예매해 보세요." },
  { practiceId: "ticket", text: "원하는 시간이 매진일 때 다른 시간 표를 예매해 보세요." },
];

/** 날짜 기준으로 오늘의 임무를 고른다 (하루에 하나, 매일 바뀜). */
export function todayMission(date = new Date()): DailyMission {
  const dayNumber = Math.floor(date.getTime() / 86400000);
  return MISSIONS[dayNumber % MISSIONS.length];
}
