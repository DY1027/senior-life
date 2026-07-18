"use client";

import Image from "next/image";
import Link from "next/link";
import { formatWon } from "@/features/shopping/engine/price-calculator";
import { getAvailableOrderActions, ORDER_STATE_LABELS } from "@/features/shopping/engine/order-state-machine";
import { useShoppingOrders } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import RefundSummaryView from "@/features/shopping/ui/RefundSummaryView";

const ACTION_CLASS = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-center text-[16px] font-extrabold no-underline";

export default function OrderDetail({ orderId }: { orderId: string }) {
  const order = useShoppingOrders().orders.find((candidate) => candidate.id === orderId);
  if (!order) return <main className="mx-auto max-w-[820px] px-4 py-16 text-center"><p className="text-[18px] font-bold text-[#667287]">가상 주문을 불러오는 중이에요.</p></main>;
  const actions = getAvailableOrderActions(order.state);

  return (
    <main data-testid="order-detail" className="mx-auto w-full max-w-[820px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/shopping/orders" className="text-[15px] font-extrabold text-[#246BDF]">← 가상 주문내역</Link>
      <div className="mt-4"><PracticeDisclosure /></div>
      <section className="mt-5 rounded-3xl border border-[#DCE6F4] bg-white p-5 shadow-[0_12px_32px_rgba(41,69,115,0.07)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-[14px] font-extrabold text-[#246BDF]">가상 주문번호</span>
            <h1 className="mt-1 break-all text-[25px] font-black text-[#25324A] sm:text-[34px]">{order.orderNumber}</h1>
          </div>
          <strong className="rounded-full bg-[#EEF4FF] px-4 py-2 text-[17px] text-[#1558C0]">{ORDER_STATE_LABELS[order.state]}</strong>
        </div>
        <div className="mt-6 grid gap-4 border-y border-[#E1E8F2] py-5">
          {order.lines.map((line) => (
            <div key={line.id} className="flex items-center gap-4">
              <Image src={line.image.src} alt={line.image.alt} width={88} height={88} className="h-[88px] w-[88px] rounded-2xl border border-[#E1E8F2] object-cover" />
              <div className="min-w-0">
                <h2 className="text-[18px] font-black text-[#25324A]">{line.title}</h2>
                <p className="mt-1 text-[15px] font-bold text-[#667287]">{line.optionLabels.join(" · ") || "기본 옵션"} · {line.quantity}개</p>
              </div>
            </div>
          ))}
        </div>
        <dl className="mt-5 grid gap-3 text-[16px] font-bold text-[#4D596A]">
          <div className="flex justify-between gap-4"><dt>주문일</dt><dd>{new Date(order.createdAt).toLocaleDateString("ko-KR")}</dd></div>
          <div className="flex justify-between gap-4"><dt>가상 결제수단</dt><dd className="text-right">{order.paymentMethodLabel}</dd></div>
          <div className="flex justify-between gap-4 text-[20px] font-black"><dt>배송비 포함 총액</dt><dd className="text-[#D64038]">{formatWon(order.paymentSummary.paymentTotal)}</dd></div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {actions.includes("tracking") && <Link data-testid="order-tracking" href={`/shopping/orders/${order.id}/tracking`} className={`${ACTION_CLASS} bg-[#246BDF] text-white`}>배송조회</Link>}
          {actions.includes("cancel") && <Link data-testid="order-cancel-start" href={`/shopping/orders/${order.id}/cancel`} className={`${ACTION_CLASS} bg-[#D64038] text-white`}>주문 취소 연습</Link>}
          {actions.includes("return") && <Link data-testid="order-return-start" href={`/shopping/orders/${order.id}/return`} className={`${ACTION_CLASS} bg-[#246BDF] text-white`}>반품 연습</Link>}
          {actions.includes("exchange") && <Link data-testid="order-exchange-start" href={`/shopping/orders/${order.id}/exchange`} className={`${ACTION_CLASS} border border-[#9BB9E8] bg-white text-[#1558C0]`}>교환 연습</Link>}
          {actions.includes("refund") && <Link href={`/shopping/orders/${order.id}/refund`} className={`${ACTION_CLASS} border border-[#BFDCCB] bg-white text-[#238354]`}>환불 내역 보기</Link>}
        </div>
      </section>
      {order.refundSummary && <RefundSummaryView summary={order.refundSummary} />}
      <section className="mt-6 rounded-3xl border border-[#DCE6F4] bg-white p-5">
        <h2 className="text-[21px] font-black text-[#25324A]">상태 이력</h2>
        <ol className="mt-4 grid gap-3">
          {order.history.filter((entry) => entry.state !== order.state).map((entry, index) => <li key={`${entry.state}-${entry.occurredAt}-${index}`} className="flex justify-between gap-4 text-[15px] font-bold text-[#5B6575]"><span>{entry.label}</span><time>{new Date(entry.occurredAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</time></li>)}
          {order.history.every((entry) => entry.state === order.state) && <li className="text-[15px] font-bold text-[#667287]">이전 상태가 없습니다.</li>}
        </ol>
      </section>
    </main>
  );
}
