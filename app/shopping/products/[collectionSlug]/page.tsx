import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffiliateCard from "@/components/AffiliateCard";
import { CheckIcon } from "@/components/shopping/ShoppingIcons";
import { SHOPPING_COLLECTIONS, type ShoppingCollectionSlug } from "@/content/shopping";
import { mergeProduct, type AffiliateProduct } from "@/content/affiliate";
import { searchProduct } from "@/lib/coupang";

export const revalidate = 3600;
type Props = { params: Promise<{ collectionSlug: string }> };

export function generateStaticParams() {
  return Object.keys(SHOPPING_COLLECTIONS).map((collectionSlug) => ({ collectionSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionSlug } = await params;
  const collection = SHOPPING_COLLECTIONS[collectionSlug as ShoppingCollectionSlug];
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/shopping/products/${collection.slug}` },
  };
}

export default async function ShoppingProductCollectionPage({ params }: Props) {
  const { collectionSlug } = await params;
  const collection = SHOPPING_COLLECTIONS[collectionSlug as ShoppingCollectionSlug];
  if (!collection) notFound();

  const products = await Promise.all(collection.items.map(async (item) => {
    const liveProduct = await searchProduct(item.keyword);
    const base: AffiliateProduct = {
      id: `shopping-${collection.slug}-${item.id}`,
      label: item.label,
      desc: `${item.tip} 필요할 때만 판매 페이지를 확인하세요.`,
      keyword: item.keyword,
    };
    return { item, affiliate: mergeProduct(base, liveProduct) };
  }));
  const hasAffiliate = products.some(({ affiliate }) => affiliate !== null);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[15px] font-bold text-[#6B7280]" aria-label="현재 위치">
          <Link href="/shopping" className="text-[#246BDF]">쇼핑 연습관</Link><span>›</span><span>제품 고르는 법</span>
        </nav>

        <section className="rounded-[28px] bg-[#F2F7FF] p-6 sm:p-9">
          <span className="inline-flex rounded-full bg-[#DDE9FF] px-3 py-1 text-[14px] font-extrabold text-[#1558C0]">연습을 마친 뒤 보는 선택 안내</span>
          <h1 className="mt-4 break-keep text-[30px] font-black leading-tight text-[#25324A] sm:text-[42px]">{collection.title}</h1>
          <p className="mt-4 break-keep text-[17px] leading-relaxed text-[#5B6575]">{collection.description}</p>
          <p className="mt-4 rounded-2xl bg-white p-4 text-[15px] font-bold leading-relaxed text-[#596273]">구매를 권하는 진단이 아닙니다. 집에 있는 물건을 먼저 확인하고 필요한 항목만 비교하세요.</p>
        </section>

        <section className="mt-10" aria-labelledby="shopping-criteria-title">
          <h2 id="shopping-criteria-title" className="text-[26px] font-black text-[#25324A]">항목별로 이렇게 확인해요</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {products.map(({ item, affiliate }, index) => (
              <article key={item.id} className="rounded-[24px] border border-[#E1E8F4] bg-white p-5 shadow-[0_10px_28px_rgba(41,69,115,0.07)]">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E7F0FF] text-[18px] font-black text-[#1558C0]">{index + 1}</span>
                <h3 className="mt-4 text-[21px] font-black text-[#25324A]">{item.label}</h3>
                <p className="mt-2 break-keep text-[16px] leading-relaxed text-[#5B6575]">{item.tip}</p>
                <ul className="mt-4 space-y-2 text-[15px] font-bold text-[#4D596A]">
                  <li className="flex gap-2"><CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#2D8A5B]" />집에 같은 용도의 물건이 있는지 확인</li>
                  <li className="flex gap-2"><CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#2D8A5B]" />크기·수량·배송비를 주문 전에 확인</li>
                </ul>
                {affiliate && <AffiliateCard product={affiliate} heading={`${item.label}이 실제로 필요하다면`} />}
              </article>
            ))}
          </div>
          {!hasAffiliate && (
            <div className="mt-6 rounded-2xl border border-[#E7DFC9] bg-[#FFF9EC] p-5 text-center text-[16px] font-bold leading-relaxed text-[#675A46]">
              현재 공식 제휴 상품 연결을 준비하고 있어요. 위 선택 기준만 먼저 활용해 주세요.
            </div>
          )}
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/shopping" className="inline-flex min-h-12 items-center rounded-xl border border-[#C9D8F1] bg-white px-5 text-[16px] font-extrabold text-[#1558C0]">다른 미션 보기</Link>
          <Link href="/shopping/missions/first-usb-c-cable/practice" className="inline-flex min-h-12 items-center rounded-xl bg-[#246BDF] px-5 text-[16px] font-extrabold text-white">쇼핑 다시 연습하기</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
