// 쿠팡 파트너스 상품 링크 모음.
// 링크는 소유자가 파트너스 대시보드에서 생성해 전달한 것만 등록한다.
// 규정: 카드가 노출되는 화면에는 반드시 대가성 문구(AffiliateCard가 자동 표시)가 함께 보여야 한다.
export type AffiliateProduct = {
  id: string;
  label: string;
  desc: string;
  href: string;
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
};
