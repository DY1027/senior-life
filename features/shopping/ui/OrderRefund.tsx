"use client";

import Link from "next/link";
import { useShoppingOrders } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import RefundSummaryView from "@/features/shopping/ui/RefundSummaryView";

export default function OrderRefund({ orderId }: { orderId: string }) {
  const order = useShoppingOrders().orders.find((candidate) => candidate.id === orderId);
  if (!order) return <main className="mx-auto max-w-[720px] px-4 py-16 text-center"><p className="text-[18px] font-bold">환불 정보를 불러오는 중이에요.</p></main>;
  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/shopping/orders/${orderId}`} className="text-[15px] font-extrabold text-[#246BDF]">← 주문 상세</Link>
      <h1 className="mt-3 text-[34px] font-black text-[#25324A] sm:text-[44px]">환불 확인 연습</h1>
      <div className="mt-5"><PracticeDisclosure /></div>
      {order.refundSummary ? <RefundSummaryView summary={order.refundSummary} /> : <p className="mt-6 rounded-3xl border border-[#DCE6F4] bg-white p-7 text-[17px] font-bold text-[#667287]">아직 계산된 환불 내역이 없습니다.</p>}
    </main>
  );
}
