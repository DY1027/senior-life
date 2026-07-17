// 생활기기 연습 목록 — 홈·연습 허브·내 기록·오늘의 연습이 모두 이 데이터를 쓴다.
// 새 연습을 추가하면 여기에 등록해야 도장판·이어하기에 함께 잡힌다.
import { getKioskConfig, type KioskId } from "@/lib/kiosk-config";

export type Practice = {
  id: KioskId; // Catalog.kioskType과 동일해야 기록이 연결된다
  worldName: string; // 디지털 생활 연습마을 안에서 사용하는 장소 이름
  title: string; // 목록에 크게 보이는 이름
  short: string; // 짧은 이름 (도장·이어하기 문구용)
  desc: string;
  href: string;
  category: "먹고 마시기" | "이동하기" | "장보고 이용하기" | "공공생활";
  img?: string; // 일러스트가 없으면 emoji 박스로 대신 그린다
  emoji: string;
};

function practiceCopy(id: KioskId) {
  const config = getKioskConfig(id);
  return {
    worldName: config.name,
    title: config.accentLabel.replace(/ 연습$/, ""),
    short: config.accentLabel.replace(/ 연습$/, ""),
    desc: config.shortDescription,
  };
}

export const PRACTICES: Practice[] = [
  {
    id: "cafe",
    ...practiceCopy("cafe"),
    href: "/kiosk/cafe",
    category: "먹고 마시기",
    img: "/images/dundun/kiosk-cafe.webp",
    emoji: "☕",
  },
  {
    id: "fastfood",
    ...practiceCopy("fastfood"),
    href: "/kiosk/fastfood",
    category: "먹고 마시기",
    img: "/tiles/kiosk-fastfood.webp",
    emoji: "🍔",
  },
  {
    id: "ticket",
    ...practiceCopy("ticket"),
    href: "/kiosk/ticket",
    category: "이동하기",
    img: "/images/dundun/kiosk-ticket.webp",
    emoji: "🚄",
  },
  {
    id: "parking",
    ...practiceCopy("parking"),
    href: "/kiosk/parking",
    category: "이동하기",
    img: "/images/dundun/kiosk-parking.webp",
    emoji: "🅿️",
  },
  {
    id: "mart",
    ...practiceCopy("mart"),
    href: "/kiosk/mart",
    category: "장보고 이용하기",
    img: "/images/dundun/kiosk-mart.webp",
    emoji: "🛒",
  },
  {
    id: "atm",
    ...practiceCopy("atm"),
    href: "/kiosk/atm",
    category: "공공생활",
    img: "/images/dundun/kiosk-atm.webp",
    emoji: "🏧",
  },
  {
    id: "civil",
    ...practiceCopy("civil"),
    href: "/kiosk/civil",
    category: "공공생활",
    img: "/tiles/kiosk-civil.webp",
    emoji: "🏛️",
  },
];

// 다음에 열릴 연습 예고 — 미완성처럼 보이지 않게 한 번에 하나만 보여준다.
export const UPCOMING_PRACTICE = {
  title: "푸드코트 주문",
  category: "먹고 마시기" as const,
  emoji: "🍽️",
};

// 최근에 새로 열린 연습 (홈의 "새로 생긴 연습" 알림에 쓴다)
export const NEW_PRACTICE_ID = "atm";

export function getPractice(id: string): Practice | undefined {
  return PRACTICES.find((p) => p.id === id);
}

/** 이번 주(월요일 시작) 번호 — 주간 도전 선정용 */
export function weekNumber(date = new Date()): number {
  const day = (date.getDay() + 6) % 7; // 월=0
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  return Math.floor(monday.getTime() / (7 * 86400000));
}

/** 이번 주 도전 — 매주 다른 연습 3가지 (서버·클라이언트 동일하게 결정적) */
export function weeklyChallenge(date = new Date()): Practice[] {
  const w = weekNumber(date);
  const n = PRACTICES.length;
  // 간격 2씩 벌려 뽑으면 n이 홀수일 때 항상 서로 다른 3개가 나온다
  return [w % n, (w + 2) % n, (w + 4) % n].map((i) => PRACTICES[i]);
}
