import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMMERCE_PRODUCTS } from "@/features/shopping/data/products";
import { formatWon } from "@/features/shopping/engine/price-calculator";
import ShoppingSearchPanel from "@/features/shopping/ui/ShoppingSearchPanel";
import ActiveCommerceMission from "@/features/shopping/ui/ActiveCommerceMission";

export const metadata: Metadata = { title: "필요한 물건 찾아보기", robots: { index: false, follow: false } };

const CATEGORIES = [
  { label: "휴대폰", query: "휴대폰 충전" },
  { label: "집안 안전", query: "집안 안전" },
  { label: "여행", query: "여행 준비" },
  { label: "계절용품", query: "장마철" },
  { label: "생활편의", query: "생활편의" },
] as const;

export default function ShoppingCatalogPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-12">
        <div>
          <div>
            <Link href="/shopping" className="text-[15px] font-extrabold text-[#246BDF]">← 쇼핑 연습관 선택으로</Link>
            <span className="mt-5 block text-[14px] font-extrabold text-[#246BDF]">필요한 물건 찾아보기</span>
            <h1 className="mt-2 text-[34px] font-black leading-tight text-[#25324A] sm:text-[46px]">생활상품을 검색해보세요</h1>
            <p className="mt-3 max-w-[680px] break-keep text-[17px] leading-relaxed text-[#667287]">상품 이름을 몰라도 “장마철”이나 “욕실이 미끄러울 때”처럼 필요한 상황으로 찾을 수 있어요.</p>
          </div>
        </div>

        <nav aria-label="생활상품 카테고리" className="my-7 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => <Link key={category.label} href={`/shopping/search?q=${encodeURIComponent(category.query)}`} className="inline-flex min-h-11 flex-none items-center rounded-full border border-[#C9D8F1] bg-white px-4 text-[15px] font-extrabold text-[#1558C0] no-underline">{category.label}</Link>)}
        </nav>

        <div className="mb-5"><ActiveCommerceMission /></div>
        <ShoppingSearchPanel />

        <section className="mb-8 rounded-3xl border-2 border-[#BFD0E9] bg-[#EDF4FF] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6" aria-labelledby="comparison-practice-title">
          <div>
            <span className="text-[13px] font-extrabold text-[#246BDF]">비슷한 상품이 헷갈린다면</span>
            <h2 id="comparison-practice-title" className="mt-2 text-[24px] font-black text-[#25324A]">충전 케이블 3개를 직접 비교해보세요</h2>
            <p className="mt-2 break-keep text-[15px] font-bold leading-relaxed text-[#5B6575]">단자·길이·묶음 수량·배송비 포함 총비용을 하나씩 대조하고, 잘못 고른 이유도 확인할 수 있어요.</p>
          </div>
          <Link data-testid="start-comparison-mission" href="/shopping/missions/compare-usb-c-cables" className="mt-5 inline-flex min-h-12 flex-none items-center justify-center rounded-xl bg-[#246BDF] px-5 text-[16px] font-extrabold text-white no-underline sm:mt-0">상품 비교 연습</Link>
        </section>

        <section aria-labelledby="catalog-preview-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><span className="text-[14px] font-extrabold text-[#246BDF]">생활상품 둘러보기</span><h2 id="catalog-preview-title" className="mt-2 text-[28px] font-black text-[#25324A] sm:text-[36px]">구입 전 확인할 점이 있는 상품</h2></div>
            <span className="text-[14px] font-bold text-[#667287]">연습용 예시 {COMMERCE_PRODUCTS.length}개</span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {COMMERCE_PRODUCTS.map((product) => (
              <Link key={product.id} data-testid={`catalog-product-${product.id}`} href={`/shopping/products/${product.id}`} className="grid grid-cols-[108px_1fr] gap-4 rounded-3xl border border-[#DCE6F4] bg-white p-4 text-inherit no-underline shadow-[0_10px_28px_rgba(41,69,115,0.07)] sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F4F6F8]"><Image src={product.image.src} alt={product.image.alt} fill sizes="140px" className="object-cover" /></div>
                <div className="min-w-0 py-1">
                  <span className="rounded-full bg-[#E7F0FF] px-2.5 py-1 text-[12px] font-extrabold text-[#1558C0]">연습용 예시 상품</span>
                  <h3 className="mt-3 break-keep text-[19px] font-black leading-snug text-[#25324A]">{product.title}</h3>
                  <p className="mt-2 text-[19px] font-black text-[#D64038]">{formatWon(product.basePrice)}</p>
                  <p className="mt-1 text-[14px] font-bold text-[#667287]">배송비 {formatWon(product.shippingFee)}</p>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#667287]">확인: {product.learningPoints[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
