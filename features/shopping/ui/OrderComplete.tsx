"use client";

import Link from "next/link";
import { formatWon } from "@/features/shopping/engine/price-calculator";
import { useShoppingOrders } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";

export default function OrderComplete({ orderId }: { orderId: string }) {
  const order = useShoppingOrders().orders.find((candidate) => candidate.id === orderId);
  if (!order) return <main className="mx-auto max-w-[760px] px-4 py-16 text-center"><p className="text-[18px] font-bold text-[#667287]">가상 주문 기록을 불러오는 중이에요.</p></main>;

  return (
    <main data-testid="order-complete" className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <span className="inline-grid h-20 w-20 place-items-center rounded-full bg-[#E4F6EB] text-[42px] text-[#238354]">✓</span>
        <h1 className="mt-5 text-[34px] font-black leading-tight text-[#25324A] sm:text-[46px]">연습 주문이 완료됐어요!</h1>
        <p className="mt-3 text-[17px] text-[#667287]">실제 주문·결제·배송은 전혀 일어나지 않았습니다.</p>
      </div>
      <div className="mt-6"><PracticeDisclosure /></div>
      <section className="mt-6 rounded-3xl border border-[#DCE6F4] bg-white p-6 shadow-[0_12px_32px_rgba(41,69,115,0.07)]">
        <span className="text-[14px] font-extrabold text-[#246BDF]">가상 주문번호</span>
        <strong data-testid="order-number" className="mt-2 block break-all text-[24px] font-black text-[#25324A]">{order.orderNumber}</strong>
        <div className="mt-5 border-t border-[#E1E8F2] pt-5">
          {order.lines.map((line) => <p key={line.id} className="text-[16px] font-bold text-[#4D596A]">{line.title} · {line.quantity}개</p>)}
          <p className="mt-4 flex justify-between text-[20px] font-black"><span>배송비 포함 총액</span><span className="text-[#D64038]">{formatWon(order.paymentSummary.paymentTotal)}</span></p>
        </div>
      </section>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shopping/orders" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#246BDF] px-5 font-extrabold text-white no-underline">주문내역 보기</Link>
        <Link href="/shopping" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#C9D8F1] bg-white px-5 font-extrabold text-[#1558C0] no-underline">다른 연습하기</Link>
      </div>
    </main>
  );
}
