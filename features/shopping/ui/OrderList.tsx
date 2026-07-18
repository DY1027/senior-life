"use client";

import Link from "next/link";
import { formatWon } from "@/features/shopping/engine/price-calculator";
import { useShoppingOrders } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";

export default function OrderList() {
  const orders = useShoppingOrders().orders;
  return (
    <main data-testid="order-list" className="mx-auto w-full max-w-[860px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/shopping" className="text-[15px] font-extrabold text-[#246BDF]">← 쇼핑 연습관</Link>
      <h1 className="mt-3 text-[34px] font-black text-[#25324A] sm:text-[44px]">가상 주문내역</h1>
      <div className="mt-5"><PracticeDisclosure /></div>
      <div className="mt-6 grid gap-4">
        {orders.length === 0 ? <p className="rounded-3xl border border-[#DCE6F4] bg-white p-8 text-center text-[17px] font-bold text-[#667287]">아직 완료한 가상 주문이 없어요.</p> : orders.map((order) => (
          <article key={order.id} data-testid={`order-card-${order.id}`} className="rounded-3xl border border-[#DCE6F4] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><span className="text-[13px] font-extrabold text-[#246BDF]">결제완료 · 연습 주문</span><h2 className="mt-1 text-[20px] font-black text-[#25324A]">{order.orderNumber}</h2></div>
              <strong className="text-[20px] text-[#D64038]">{formatWon(order.paymentSummary.paymentTotal)}</strong>
            </div>
            <p className="mt-4 text-[16px] font-bold text-[#5B6575]">{order.lines.map((line) => `${line.title} ${line.quantity}개`).join(", ")}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
