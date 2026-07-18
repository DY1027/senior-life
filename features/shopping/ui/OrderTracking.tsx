"use client";

import Link from "next/link";
import { nextDeliveryState, ORDER_STATE_LABELS, transitionOrder } from "@/features/shopping/engine/order-state-machine";
import { updatePracticeOrder } from "@/features/shopping/storage/shopping-storage";
import { useShoppingOrders } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";

export default function OrderTracking({ orderId }: { orderId: string }) {
  const order = useShoppingOrders().orders.find((candidate) => candidate.id === orderId);
  if (!order) return <main className="mx-auto max-w-[760px] px-4 py-16 text-center"><p className="text-[18px] font-bold">배송 정보를 불러오는 중이에요.</p></main>;
  const nextState = nextDeliveryState(order.state);
  const currentOrderId = order.id;

  function advance() {
    if (!nextState) return;
    updatePracticeOrder(currentOrderId, (current) => transitionOrder(current, nextState));
  }

  return (
    <main data-testid="tracking-page" className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/shopping/orders/${order.id}`} className="text-[15px] font-extrabold text-[#246BDF]">← 주문 상세</Link>
      <h1 className="mt-3 text-[34px] font-black text-[#25324A] sm:text-[44px]">배송조회 연습</h1>
      <div className="mt-5"><PracticeDisclosure /></div>
      <section className="mt-6 rounded-3xl border border-[#DCE6F4] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><span className="text-[14px] font-extrabold text-[#667287]">든든택배 · 송장번호 1234-****-5678</span><h2 className="mt-1 text-[25px] font-black text-[#1558C0]">{ORDER_STATE_LABELS[order.state]}</h2></div>
          <span className="rounded-full bg-[#EEF4FF] px-4 py-2 text-[15px] font-extrabold text-[#1558C0]">도착 예정 7월 19일</span>
        </div>
        <ol className="mt-7 grid gap-4 border-l-4 border-[#D8E5F8] pl-5">
          {order.history.filter((entry) => entry.state !== order.state && ["PREPARING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(entry.state)).map((entry, index, entries) => (
            <li key={`${entry.state}-${entry.occurredAt}`} className={index === entries.length - 1 ? "rounded-2xl bg-[#EEF4FF] p-4" : "px-4 py-2"}>
              <strong className="block text-[18px] font-black text-[#25324A]">{entry.label}</strong>
              <time className="mt-1 block text-[14px] font-bold text-[#667287]">{new Date(entry.occurredAt).toLocaleString("ko-KR")}</time>
            </li>
          ))}
        </ol>
        {nextState && <button type="button" onClick={advance} data-testid="tracking-advance" className="mt-7 min-h-12 w-full rounded-xl bg-[#246BDF] px-5 text-[17px] font-extrabold text-white">다음 상태로 진행: {ORDER_STATE_LABELS[nextState]}</button>}
        {!nextState && <p className="mt-7 rounded-2xl bg-[#EFF9F3] p-4 text-[16px] font-extrabold text-[#286B4B]">현재 배송 단계의 연습 기록을 모두 확인했습니다.</p>}
      </section>
    </main>
  );
}
