import type { ActualShoppingAdCardProps } from "@/components/ActualShoppingAdCard";
import type { KioskId } from "@/lib/kiosk-config";
import { searchProduct } from "@/lib/coupang";

const KIOSK_AD_KEYS: Record<KioskId, string[]> = {
  cafe: ["cafe-tumbler", "cafe-cup-lid"],
  fastfood: ["fastfood-wipes", "fastfood-shopping-bag"],
  ticket: ["ticket-neck-pillow", "ticket-power-bank"],
  parking: ["parking-phone-holder", "parking-emergency-hammer"],
  mart: ["mart-shopping-cart", "mart-cooler-bag"],
  atm: ["atm-rfid-wallet", "atm-card-holder"],
  civil: ["civil-document-file", "civil-document-pouch"],
};

const SHOPPING_AD_KEYS: Record<string, string[]> = {
  "first-usb-c-cable": ["shopping-usbc-cable", "shopping-usbc-charger"],
  "rainy-budget-30000": ["shopping-umbrella", "shopping-dehumidifier"],
  "compare-usb-c-cables": ["shopping-usbc-cable", "shopping-cable-set"],
  "find-order-mistake": ["shopping-usbc-cable", "shopping-usbc-charger"],
};

const COMPLETION_AD_KEYWORDS: Record<string, string> = {
  "cafe-tumbler": "손잡이 보온 텀블러",
  "cafe-cup-lid": "실리콘 컵뚜껑",
  "fastfood-wipes": "휴대용 물티슈 캡형",
  "fastfood-shopping-bag": "접이식 장바구니",
  "ticket-neck-pillow": "여행용 목베개",
  "ticket-power-bank": "휴대용 보조배터리",
  "parking-phone-holder": "차량용 휴대폰 거치대",
  "parking-emergency-hammer": "자동차 비상용 망치",
  "mart-shopping-cart": "접이식 장바구니 카트",
  "mart-cooler-bag": "보냉 장바구니",
  "atm-rfid-wallet": "RFID 차단 카드지갑",
  "atm-card-holder": "목걸이형 카드지갑",
  "civil-document-file": "서류 보관 파일",
  "civil-document-pouch": "지퍼 서류 파우치",
  "shopping-usbc-cable": "C타입 충전 케이블 2m",
  "shopping-usbc-charger": "20W C타입 충전기",
  "shopping-umbrella": "접이식 자동 우산",
  "shopping-dehumidifier": "옷장용 제습제",
  "shopping-cable-set": "C타입 충전기 케이블 세트",
};

function pickAdKey(key: string, adKeys: string[]): string {
  const score = [...key].reduce((total, character) => total + character.charCodeAt(0), 0);
  return adKeys[score % adKeys.length];
}

export async function getCompletionAdByKey(adKey: string): Promise<ActualShoppingAdCardProps | null> {
  const keyword = COMPLETION_AD_KEYWORDS[adKey];
  if (!keyword) return null;
  const product = await searchProduct(keyword);
  if (product) {
    return {
      imagePath: product.image || undefined,
      title: product.name,
      description: "상품의 가격·구성·배송비는 쿠팡 판매 페이지에서 다시 확인하세요.",
      affiliateUrl: product.url,
      buttonLabel: "쿠팡에서 실제 상품 보기 ↗",
    };
  }

  return null;
}

export function getKioskCompletionAdKey(kioskId: KioskId, scenarioId: string) {
  return pickAdKey(scenarioId, KIOSK_AD_KEYS[kioskId]);
}

export function getShoppingCompletionAdKey(missionSlug: string) {
  const adKeys = SHOPPING_AD_KEYS[missionSlug] ?? ["civil-document-pouch"];
  return pickAdKey(missionSlug, adKeys);
}
