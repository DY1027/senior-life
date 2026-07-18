"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommerceProduct, SelectedOptions } from "@/features/shopping/domain/types";
import { calculateUnitPrice, formatWon, validateSelectedOptions } from "@/features/shopping/engine/price-calculator";
import { addProductToCart } from "@/features/shopping/storage/shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import ShoppingCartLink from "@/features/shopping/ui/ShoppingCartLink";
import ActiveCommerceMission from "@/features/shopping/ui/ActiveCommerceMission";

export default function ProductDetail({ product }: { product: CommerceProduct }) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const unitPrice = useMemo(() => calculateUnitPrice(product, selectedOptions), [product, selectedOptions]);
  const optionsValid = validateSelectedOptions(product, selectedOptions);

  return (
    <main data-testid="product-detail" className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/shopping/catalog" className="text-[15px] font-extrabold text-[#246BDF]">← 상품 검색 결과로</Link>
        <ShoppingCartLink />
      </div>
      <div className="mt-5"><PracticeDisclosure /></div>
      <div className="mt-5"><ActiveCommerceMission /></div>
      <section className="mt-6 grid overflow-hidden rounded-[28px] border border-[#DCE6F4] bg-white shadow-[0_14px_40px_rgba(41,69,115,0.09)] md:grid-cols-2">
        <div className="relative min-h-[320px] bg-[#F4F6F8] md:min-h-[560px]">
          <Image src={product.image.src} alt={product.image.alt} fill priority sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="p-5 sm:p-8">
          <span className="inline-flex rounded-full bg-[#E7F0FF] px-3 py-1 text-[13px] font-extrabold text-[#1558C0]">연습용 예시 상품</span>
          <h1 className="mt-4 break-keep text-[30px] font-black leading-tight text-[#25324A] sm:text-[40px]">{product.title}</h1>
          <p className="mt-3 break-keep text-[16px] leading-relaxed text-[#667287]">{product.description}</p>
          <div className="mt-5 rounded-2xl bg-[#F7F9FC] p-4">
            <p className="text-[25px] font-black text-[#D64038]">{formatWon(unitPrice)}</p>
            <p className="mt-1 text-[15px] font-bold text-[#5B6575]">배송비 {formatWon(product.shippingFee)} · 예상 총액 {formatWon(unitPrice * quantity + product.shippingFee)}</p>
          </div>
          {product.optionGroups.map((group) => (
            <fieldset key={group.id} data-testid={`option-group-${group.id}`} className="mt-6">
              <legend className="text-[17px] font-black text-[#25324A]">{group.label} 선택 {group.required && <span className="text-[#D64038]">(필수)</span>}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.values.map((value) => (
                  <button
                    key={value.id}
                    data-testid={`option-value-${group.id}-${value.id}`}
                    type="button"
                    disabled={value.disabled || value.stock <= 0}
                    aria-pressed={selectedOptions[group.id] === value.id}
                    onClick={() => { setSelectedOptions((current) => ({ ...current, [group.id]: value.id })); setAdded(false); }}
                    className="min-h-12 rounded-xl border-2 border-[#CAD7E9] bg-white px-4 text-[16px] font-extrabold text-[#344258] aria-pressed:border-[#246BDF] aria-pressed:bg-[#EDF4FF] aria-pressed:text-[#1558C0] disabled:cursor-not-allowed disabled:bg-[#ECEFF3] disabled:text-[#8A93A1]"
                  >
                    {value.label}{value.disabled || value.stock <= 0 ? " · 품절" : value.priceDelta ? ` · ${value.priceDelta > 0 ? "+" : ""}${formatWon(value.priceDelta)}` : ""}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="mt-6">
            <label htmlFor="commerce-quantity" className="text-[17px] font-black text-[#25324A]">수량</label>
            <div className="mt-3 flex items-center gap-2">
              <button data-testid="quantity-decrease" type="button" aria-label="수량 줄이기" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="h-12 w-12 rounded-xl border border-[#C9D8F1] text-[24px] font-black">−</button>
              <input id="commerce-quantity" data-testid="quantity-input" type="number" min={1} max={9} value={quantity} onChange={(event) => setQuantity(Math.min(9, Math.max(1, Number(event.target.value) || 1)))} className="h-12 w-20 rounded-xl border border-[#C9D8F1] text-center text-[18px] font-black" />
              <button data-testid="quantity-increase" type="button" aria-label="수량 늘리기" onClick={() => setQuantity((current) => Math.min(9, current + 1))} className="h-12 w-12 rounded-xl border border-[#C9D8F1] text-[24px] font-black">＋</button>
            </div>
          </div>
          {!optionsValid && <p className="mt-4 text-[15px] font-bold text-[#A44A2B]">필수 옵션을 모두 선택하면 장바구니에 담을 수 있어요.</p>}
          <button
            data-testid="add-to-cart"
            type="button"
            disabled={!optionsValid}
            onClick={() => { addProductToCart(product, selectedOptions, quantity); setAdded(true); }}
            className="mt-6 min-h-14 w-full rounded-2xl bg-[#246BDF] px-5 text-[18px] font-extrabold text-white disabled:bg-[#AAB5C5]"
          >
            장바구니에 담기
          </button>
          {added && <p role="status" className="mt-3 rounded-xl bg-[#EFF9F3] p-3 text-center text-[15px] font-extrabold text-[#286B4B]">선택한 옵션과 수량을 장바구니에 담았어요.</p>}
        </div>
      </section>
    </main>
  );
}
