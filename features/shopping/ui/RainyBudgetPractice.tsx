"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COMMERCE_PRODUCTS } from "@/features/shopping/data/products";
import { calculateCheckoutSummary, formatWon } from "@/features/shopping/engine/price-calculator";
import { addProductToCart, setActiveBudget } from "@/features/shopping/storage/shopping-storage";
import { useShoppingCart } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import ShoppingCartLink from "@/features/shopping/ui/ShoppingCartLink";
import ActiveCommerceMission from "@/features/shopping/ui/ActiveCommerceMission";

const RAINY_IDS = ["umbrella", "dehumidifier-pack", "anti-slip-tape", "waterproof-shoe-covers"];

export default function RainyBudgetPractice() {
  const products = useMemo(() => COMMERCE_PRODUCTS.filter((product) => RAINY_IDS.includes(product.id)), []);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const cart = useShoppingCart();
  const summary = calculateCheckoutSummary(cart.lines);

  useEffect(() => setActiveBudget(30000), []);

  const selected = products.find((product) => product.id === selectedId);
  return (
    <main className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4"><Link href="/shopping" className="text-[15px] font-extrabold text-[#246BDF]">← 쇼핑 연습관</Link><ShoppingCartLink /></div>
      <span className="mt-6 inline-flex rounded-full bg-[#F2EDFF] px-3 py-1 text-[14px] font-extrabold text-[#6843BD]">예산 장보기</span>
      <h1 className="mt-3 text-[34px] font-black leading-tight text-[#25324A] sm:text-[44px]">3만 원으로 장마철 준비하기</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-[#667287]">우산·제습용품·미끄럼방지용품을 담고 배송비까지 합친 금액을 확인하세요.</p>
      <div className="mt-5"><PracticeDisclosure /></div>
      <div className="mt-5"><ActiveCommerceMission /></div>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="장마철 연습 상품">
        {products.map((product) => (
          <button key={product.id} data-testid={`product-card-${product.id}`} type="button" aria-pressed={selectedId === product.id} onClick={() => { setSelectedId(product.id); setMessage(""); }} className="rounded-3xl border-2 border-[#DCE6F4] bg-white p-4 text-left shadow-[0_8px_24px_rgba(41,69,115,0.06)] aria-pressed:border-[#6843BD] aria-pressed:bg-[#FAF8FF]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F4F6F8]"><Image src={product.image.src} alt={product.image.alt} fill sizes="(max-width: 639px) 100vw, 33vw" className="object-cover" /></div>
            <h2 className="mt-4 break-keep text-[19px] font-black text-[#25324A]">{product.title}</h2>
            <p className="mt-2 text-[18px] font-black text-[#D64038]">{formatWon(product.basePrice)}</p>
            <p className="mt-1 text-[14px] font-bold text-[#667287]">배송비 {formatWon(product.shippingFee)}</p>
          </button>
        ))}
      </section>
      <section className="mt-5 rounded-3xl border border-[#DCE6F4] bg-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><span className="text-[14px] font-bold text-[#667287]">선택한 상품</span><strong className="mt-1 block text-[21px] text-[#25324A]">{selected?.title}</strong></div>
          <button data-testid="add-to-cart" type="button" disabled={!selected} onClick={() => { if (selected) { addProductToCart(selected, {}, 1); setMessage(`${selected.title}을 장바구니에 담았어요.`); } }} className="min-h-14 rounded-2xl bg-[#246BDF] px-6 text-[18px] font-extrabold text-white">장바구니에 담기</button>
        </div>
        {message && <p role="status" className="mt-4 rounded-xl bg-[#EFF9F3] p-3 text-[15px] font-extrabold text-[#286B4B]">{message}</p>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E8F2] pt-5"><span className="font-bold text-[#5B6575]">현재 배송비 포함 합계</span><strong className="text-[24px] text-[#D64038]">{formatWon(summary.paymentTotal)}</strong></div>
      </section>
    </main>
  );
}
