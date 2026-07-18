"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReturnReason } from "@/features/shopping/domain/types";
import { calculateCancellationRefund, calculateReturnRefund, transitionOrder } from "@/features/shopping/engine/order-state-machine";
import { updatePracticeOrder } from "@/features/shopping/storage/shopping-storage";
import { useShoppingOrders } from "@/features/shopping/storage/use-shopping-storage";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";

type ActionKind = "cancel" | "return" | "exchange";

const COPY: Record<ActionKind, { title: string; label: string; button: string }> = {
  cancel: { title: "주문 취소 연습", label: "취소 사유", button: "취소 신청 완료" },
  return: { title: "반품 신청 연습", label: "반품 사유", button: "반품 신청 완료" },
  exchange: { title: "교환 신청 연습", label: "교환 옵션", button: "교환 신청 완료" },
};

export default function OrderActionForm({ orderId, kind }: { orderId: string; kind: ActionKind }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const order = useShoppingOrders().orders.find((candidate) => candidate.id === orderId);
  const copy = COPY[kind];

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value) {
      setError(`${copy.label}를 선택해 주세요.`);
      return;
    }
    try {
      const updated = updatePracticeOrder(orderId, (current) => {
        const requestedAt = new Date().toISOString();
        if (kind === "cancel") {
          return {
            ...transitionOrder(current, "CANCELLED", requestedAt),
            afterSalesRequest: { kind, reason: value, requestedAt },
            refundSummary: calculateCancellationRefund(current),
          };
        }
        if (kind === "return") {
          return {
            ...transitionOrder(current, "RETURN_REQUESTED", requestedAt),
            afterSalesRequest: { kind, reason: value, requestedAt },
            refundSummary: calculateReturnRefund(current, value as ReturnReason),
          };
        }
        return {
          ...transitionOrder(current, "EXCHANGE_REQUESTED", requestedAt),
          afterSalesRequest: { kind, exchangeOption: value, requestedAt },
        };
      });
      if (!updated) throw new Error("주문을 찾지 못했습니다.");
      router.push(`/shopping/orders/${orderId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "신청을 처리하지 못했습니다.");
    }
  }

  if (!order) return <main className="mx-auto max-w-[720px] px-4 py-16 text-center"><p className="text-[18px] font-bold">가상 주문을 불러오는 중이에요.</p></main>;

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/shopping/orders/${orderId}`} className="text-[15px] font-extrabold text-[#246BDF]">← 주문 상세</Link>
      <h1 className="mt-3 text-[34px] font-black text-[#25324A] sm:text-[44px]">{copy.title}</h1>
      <div className="mt-5"><PracticeDisclosure /></div>
      <form onSubmit={submit} className="mt-6 rounded-3xl border border-[#DCE6F4] bg-white p-5 sm:p-7">
        <label htmlFor="action-value" className="block text-[18px] font-black text-[#25324A]">{copy.label}</label>
        <select id="action-value" value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} className="mt-3 min-h-12 w-full rounded-xl border-2 border-[#B8C8DE] bg-white px-4 text-[17px] font-bold text-[#25324A]">
          <option value="">선택해 주세요</option>
          {kind === "cancel" && <><option value="changed-mind">단순 변심</option><option value="wrong-option">옵션을 잘못 선택함</option><option value="duplicate">중복 주문</option></>}
          {kind === "return" && <><option value="changed-mind">단순 변심</option><option value="damaged">상품 파손</option><option value="wrong-item">다른 상품 배송</option><option value="option-mismatch">옵션 불일치</option></>}
          {kind === "exchange" && <><option value="black-2m">검정색 · 2m (재고 있음)</option><option value="black-3m" disabled>검정색 · 3m (품절)</option></>}
        </select>
        {kind === "return" && <p className="mt-4 rounded-2xl bg-[#FFF8E8] p-4 text-[15px] font-bold leading-relaxed text-[#705115]">일반 연습 규칙: 단순 변심은 반품 배송비 6,000원을 차감하고, 파손·오배송은 판매자 부담으로 0원입니다.</p>}
        {kind === "exchange" && <p className="mt-4 rounded-2xl bg-[#FFF8E8] p-4 text-[15px] font-bold leading-relaxed text-[#705115]">품절 옵션은 선택할 수 없습니다. 선택 가능한 재고가 있는 옵션으로 연습합니다.</p>}
        {error && <p role="alert" className="mt-4 rounded-xl bg-[#FFF0EF] p-3 font-bold text-[#B72D27]">{error}</p>}
        <button type="submit" className="mt-6 min-h-12 w-full rounded-xl bg-[#246BDF] px-5 text-[17px] font-extrabold text-white">{copy.button}</button>
      </form>
    </main>
  );
}
