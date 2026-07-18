"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateCheckoutSummary, formatWon } from "@/features/shopping/engine/price-calculator";
import { createPracticeOrder, saveShoppingProgress } from "@/features/shopping/storage/shopping-storage";
import { useShoppingCart } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import ActiveCommerceMission from "@/features/shopping/ui/ActiveCommerceMission";
import { evaluateCommerceMission } from "@/features/shopping/engine/commerce-mission-evaluator";

export default function Checkout() {
  const router = useRouter();
  const cart = useShoppingCart();
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const summary = calculateCheckoutSummary(cart.lines);
  const missionFeedback = evaluateCommerceMission(cart);
  const missionValid = missionFeedback?.complete ?? true;

  useEffect(() => saveShoppingProgress("checkout"), []);

  if (cart.lines.length === 0) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-4 py-12 text-center">
        <h1 className="text-[32px] font-black text-[#25324A]">주문할 연습 상품이 없어요</h1>
        <Link href="/shopping" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#246BDF] px-5 font-extrabold text-white no-underline">쇼핑 연습관으로</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[820px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/shopping/cart" className="text-[15px] font-extrabold text-[#246BDF]">← 장바구니 수정하기</Link>
      <h1 className="mt-3 text-[34px] font-black text-[#25324A] sm:text-[44px]">주문 전 확인</h1>
      <div className="mt-5"><PracticeDisclosure /></div>
      <div className="mt-5"><ActiveCommerceMission showFeedback /></div>

      <section data-testid="checkout-address" className="mt-6 rounded-3xl border border-[#DCE6F4] bg-white p-5 sm:p-6">
        <span className="text-[14px] font-extrabold text-[#246BDF]">가상 배송지</span>
        <h2 className="mt-2 text-[22px] font-black text-[#25324A]">김든든</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-[#5B6575]">서울시 든든구 연습로 12<br />010-0000-0000</p>
        <p className="mt-3 rounded-xl bg-[#F7F9FC] p-3 text-[14px] font-bold text-[#667287]">실제 주소나 전화번호를 입력하지 않는 연습 정보입니다.</p>
      </section>

      <section data-testid="checkout-payment-method" className="mt-4 rounded-3xl border border-[#DCE6F4] bg-white p-5 sm:p-6">
        <span className="text-[14px] font-extrabold text-[#246BDF]">가상 결제수단</span>
        <h2 className="mt-2 text-[22px] font-black text-[#25324A]">연습카드 **** 1234</h2>
        <p className="mt-2 text-[15px] font-bold text-[#667287]">실제 카드번호나 비밀번호는 입력하지 않습니다.</p>
      </section>

      <section className="mt-4 rounded-3xl border border-[#DCE6F4] bg-white p-5 sm:p-6">
        <h2 className="text-[22px] font-black text-[#25324A]">최종 금액</h2>
        <dl className="mt-4 grid gap-3 text-[16px]">
          <div className="flex justify-between"><dt>상품 금액</dt><dd className="font-black">{formatWon(summary.merchandiseTotal)}</dd></div>
          <div className="flex justify-between"><dt>배송비</dt><dd className="font-black">{formatWon(summary.shippingTotal)}</dd></div>
          <div className="flex justify-between border-t-2 border-[#DCE6F4] pt-4 text-[20px]"><dt className="font-black">결제 예정 금액</dt><dd className="font-black text-[#D64038]">{formatWon(summary.paymentTotal)}</dd></div>
        </dl>
      </section>

      <label className="mt-5 flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border-2 border-[#BFD0E9] bg-white p-4 text-[16px] font-extrabold leading-relaxed text-[#344258]">
        <input data-testid="checkout-final-confirm" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-6 w-6 shrink-0" />
        실제 결제가 아니며 상품·수량·배송비 포함 총액을 모두 확인했습니다.
      </label>
      <button
        data-testid="mock-payment-submit"
        type="button"
        disabled={!confirmed || processing || !missionValid}
        onClick={() => {
          setProcessing(true);
          const order = createPracticeOrder(cart.lines);
          router.push(`/shopping/order-complete/${order.id}`);
        }}
        className="mt-5 min-h-14 w-full rounded-2xl bg-[#246BDF] px-5 text-[18px] font-extrabold text-white disabled:bg-[#AAB5C5]"
      >
        {processing ? "가상 주문을 만드는 중…" : "모의 결제하고 주문 완료"}
      </button>
    </main>
  );
}
