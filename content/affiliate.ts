// 쿠팡 파트너스 상품 링크 모음.
// 링크는 소유자가 파트너스 대시보드에서 생성해 전달한 것만 등록한다.
// 규정: 카드가 노출되는 화면에는 반드시 대가성 문구(AffiliateCard가 자동 표시)가 함께 보여야 한다.
export type AffiliateProduct = {
  id: string;
  label: string;
  desc: string;
  /** 수동 폴백 링크. 없으면 API 실패 시 카드 자체를 숨긴다 */
  href?: string;
  /** Open API 검색 키워드 — 서버에서 공식 사진·가격을 가져올 때 사용 */
  keyword?: string;
  /** 아래 둘은 API 조회 성공 시에만 채워짐 (쿠팡 공식 데이터) */
  image?: string;
  price?: number;
};

export const AFFILIATE: Record<string, AffiliateProduct> = {
  photoPrinter: {
    id: "photo-printer",
    label: "가정용 포토프린터",
    desc: "만든 달력과 가족 사진을 집에서 바로 뽑을 수 있어요",
    href: "https://link.coupang.com/a/fnzNnLtOiy",
    keyword: "가정용 포토프린터",
  },
  safetyGrab: {
    id: "safety-grab",
    label: "욕실 안전손잡이",
    desc: "미끄러운 욕실·화장실에 다는 어르신 안전 손잡이예요",
    keyword: "욕실 안전손잡이 노인",
  },
};

/** API 조회 결과를 카드용 데이터로 합친다 (실패 시 폴백 링크가 있으면 그대로, 없으면 null) */
export function mergeProduct(
  base: AffiliateProduct,
  p: { name: string; price: number; image: string; url: string } | null
): AffiliateProduct | null {
  if (!p) return base.href ? base : null;
  return {
    ...base,
    label: p.name.length > 44 ? p.name.slice(0, 44) + "…" : p.name,
    href: p.url,
    image: p.image || undefined,
    price: p.price || undefined,
  };
}
