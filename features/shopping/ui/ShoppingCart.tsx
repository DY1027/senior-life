"use client";

import Image from "next/image";
import Link from "next/link";
import { calculateCheckoutSummary, formatWon } from "@/features/shopping/engine/price-calculator";
import { removeCartLine, updateCartLineQuantity } from "@/features/shopping/storage/shopping-storage";
import { useShoppingCart } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import ActiveCommerceMission from "@/features/shopping/ui/ActiveCommerceMission";
import { evaluateCommerceMission, getCommerceMissionPracticeHref } from "@/features/shopping/engine/commerce-mission-evaluator";

export default function ShoppingCart() {
  const cart = useShoppingCart();
  const summary = calculateCheckoutSummary(cart.lines);
  const remaining = cart.activeBudget === undefined ? undefined : cart.activeBudget - summary.paymentTotal;
  const missionFeedback = evaluateCommerceMission(cart);
  const canCheckout = cart.lines.length > 0 && (remaining === undefined || remaining >= 0) && (missionFeedback?.complete ?? true);

  return (
    <main className="mx-auto w-full max-w-[920px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href={getCommerceMissionPracticeHref(cart.activeMissionSlug)} className="text-[15px] font-extrabold text-[#246BDF]">← 상품 다시 고르기</Link>
      <h1 className="mt-3 text-[34px] font-black text-[#25324A] sm:text-[44px]">연습 장바구니</h1>
      <div className="mt-5"><PracticeDisclosure /></div>
      <div className="mt-5"><ActiveCommerceMission showFeedback /></div>

      {cart.lines.length === 0 ? (
        <section className="mt-7 rounded-3xl border border-[#D9E4F5] bg-white p-8 text-center">
          <h2 className="text-[24px] font-black text-[#25324A]">장바구니가 비어 있어요</h2>
          <Link href="/shopping" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#246BDF] px-5 font-extrabold text-white no-underline">상품 검색하기</Link>
        </section>
      ) : (
        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_330px]">
          <section className="grid gap-4" aria-label="장바구니 상품">
            {cart.lines.map((line) => (
              <article key={line.id} data-testid={`cart-line-${line.id}`} className="rounded-3xl border border-[#DCE6F4] bg-white p-4 shadow-[0_8px_24px_rgba(41,69,115,0.06)]">
                <div className="grid grid-cols-[92px_1fr] gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F4F6F8]"><Image src={line.image.src} alt={line.image.alt} fill sizes="92px" className="object-cover" /></div>
                  <div className="min-w-0">
                    <span className="text-[12px] font-extrabold text-[#246BDF]">연습용 예시 상품</span>
                    <h2 className="mt-1 break-keep text-[19px] font-black leading-snug text-[#25324A]">{line.title}</h2>
                    {line.optionLabels.map((label) => <p key={label} className="mt-1 text-[14px] font-bold text-[#5B6575]">{label}</p>)}
                    <p className="mt-2 text-[18px] font-black text-[#D64038]">{formatWon(line.unitPrice)}</p>
                    <Link data-testid={`cart-line-edit-${line.id}`} href={`/shopping/products/${line.productId}`} className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-[#C9D8F1] px-4 text-[14px] font-extrabold text-[#1558C0]">옵션 다시 선택</Link>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4EAF2] pt-4">
                  <label className="flex items-center gap-2 text-[15px] font-bold text-[#4D596A]">
                    수량
                    <input aria-label={`${line.title} 수량`} type="number" min={1} max={9} value={line.quantity} onChange={(event) => updateCartLineQuantity(line.id, Number(event.target.value) || 1)} className="h-11 w-20 rounded-xl border border-[#C9D8F1] text-center font-black" />
                  </label>
                  <button data-testid={`cart-line-remove-${line.id}`} type="button" onClick={() => removeCartLine(line.id)} className="min-h-11 rounded-xl border border-[#E2B9B5] bg-white px-4 font-extrabold text-[#B53E36]">상품 제거</button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-3xl border border-[#DCE6F4] bg-white p-5 shadow-[0_10px_28px_rgba(41,69,115,0.07)]">
            <h2 className="text-[23px] font-black text-[#25324A]">금액 확인</h2>
            <dl className="mt-5 grid gap-3 text-[16px]">
              <div className="flex justify-between gap-3"><dt>상품 금액</dt><dd data-testid="cart-merchandise-total" className="font-black">{formatWon(summary.merchandiseTotal)}</dd></div>
              <div className="flex justify-between gap-3"><dt>배송비</dt><dd data-testid="cart-shipping-total" className="font-black">{formatWon(summary.shippingTotal)}</dd></div>
              <div className="flex justify-between gap-3"><dt>할인</dt><dd data-testid="cart-discount-total" className="font-black">-{formatWon(summary.discountTotal)}</dd></div>
              <div className="mt-2 flex justify-between gap-3 border-t-2 border-[#DCE6F4] pt-4 text-[19px]"><dt className="font-black">결제 예정 금액</dt><dd data-testid="cart-payment-total" className="font-black text-[#D64038]">{formatWon(summary.paymentTotal)}</dd></div>
            </dl>
            {remaining !== undefined && (
              <div className={`mt-5 rounded-2xl p-4 ${remaining < 0 ? "bg-[#FFF0EE] text-[#A7352E]" : "bg-[#EFF9F3] text-[#286B4B]"}`}>
                <span className="text-[14px] font-bold">3만 원 예산에서 남은 금액</span>
                <strong data-testid="budget-remaining" className="mt-1 block text-[24px]">{formatWon(remaining)}</strong>
                {remaining < 0 && <p className="mt-2 text-[14px] font-bold">예산을 넘었어요. 상품을 하나 제거하면 다시 확인할 수 있어요.</p>}
              </div>
            )}
            {canCheckout ? (
              <Link data-testid="checkout-start" href="/shopping/checkout" className="mt-5 flex min-h-14 items-center justify-center rounded-2xl bg-[#246BDF] px-5 text-[18px] font-extrabold text-white no-underline">주문 연습하기</Link>
            ) : (
              <button data-testid="checkout-start" type="button" disabled className="mt-5 min-h-14 w-full rounded-2xl bg-[#AAB5C5] px-5 text-[18px] font-extrabold text-white">주문 연습하기</button>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
