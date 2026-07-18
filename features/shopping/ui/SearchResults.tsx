import Image from "next/image";
import Link from "next/link";
import type { CommerceProduct } from "@/features/shopping/domain/types";
import { formatWon } from "@/features/shopping/engine/price-calculator";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import ShoppingCartLink from "@/features/shopping/ui/ShoppingCartLink";

export default function SearchResults({ query, products }: { query: string; products: CommerceProduct[] }) {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/shopping" className="text-[15px] font-extrabold text-[#246BDF]">← 쇼핑 연습관</Link>
          <h1 className="mt-3 text-[30px] font-black text-[#25324A] sm:text-[42px]">“{query}” 검색 결과</h1>
        </div>
        <ShoppingCartLink />
      </div>
      <div className="mt-5"><PracticeDisclosure /></div>
      {products.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[#D9E4F5] bg-white p-8 text-center">
          <h2 className="text-[24px] font-black text-[#25324A]">찾은 연습 상품이 없어요</h2>
          <p className="mt-3 text-[16px] text-[#667287]">“C타입 충전 케이블”처럼 다시 검색해 보세요.</p>
        </section>
      ) : (
        <section className="mt-8 grid gap-5 sm:grid-cols-2" aria-label="검색된 연습 상품">
          {products.map((product) => (
            <Link key={product.id} data-testid={`product-card-${product.id}`} href={`/shopping/products/${product.id}`} className="grid grid-cols-[112px_1fr] gap-4 rounded-3xl border border-[#DCE6F4] bg-white p-4 text-inherit no-underline shadow-[0_10px_28px_rgba(41,69,115,0.07)] sm:grid-cols-[150px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F4F6F8]">
                <Image src={product.image.src} alt={product.image.alt} fill sizes="150px" className="object-cover" />
              </div>
              <div className="min-w-0 py-1">
                <span className="rounded-full bg-[#E7F0FF] px-2.5 py-1 text-[12px] font-extrabold text-[#1558C0]">연습용 예시 상품</span>
                <h2 className="mt-3 break-keep text-[20px] font-black leading-snug text-[#25324A]">{product.title}</h2>
                <p className="mt-2 text-[19px] font-black text-[#D64038]">{formatWon(product.basePrice)}</p>
                <p className="mt-1 text-[14px] font-bold text-[#667287]">배송비 {formatWon(product.shippingFee)}</p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
