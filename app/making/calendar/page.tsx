import type { Metadata } from "next";
import CalendarMaker from "@/components/making/CalendarMaker";
import { searchProduct } from "@/lib/coupang";
import { AFFILIATE, type AffiliateProduct } from "@/content/affiliate";

export const metadata: Metadata = {
  title: "사진 달력 만들기 — 세상에 하나뿐인 우리 가족 달력",
  description:
    "손주·가족 사진을 골라 몇 번만 누르면 인쇄용 달력이 완성됩니다. 사진은 서버에 저장되지 않아요. 어르신을 위한 무료 만들기 놀이입니다.",
  alternates: { canonical: "/making/calendar" },
};

// 상품 정보(사진·가격)는 1시간마다 서버에서 갱신 — 방문자 트래픽은 API 호출로 이어지지 않는다
export const revalidate = 3600;

export default async function CalendarMakerPage() {
  // 쿠팡 공식 데이터 조회. 실패(키 없음·네트워크 등) 시 null → 수동 링크 텍스트 카드로 폴백
  let printerProduct: AffiliateProduct | null = null;
  const base = AFFILIATE.photoPrinter;
  if (base.keyword) {
    const p = await searchProduct(base.keyword);
    if (p) {
      printerProduct = {
        ...base,
        label: p.name.length > 44 ? p.name.slice(0, 44) + "…" : p.name,
        href: p.url,
        image: p.image || undefined,
        price: p.price || undefined,
      };
    }
  }
  return <CalendarMaker printerProduct={printerProduct} />;
}
