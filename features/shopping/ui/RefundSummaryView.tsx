import type { RefundSummary } from "@/features/shopping/domain/types";
import { formatWon } from "@/features/shopping/engine/price-calculator";

export default function RefundSummaryView({ summary }: { summary: RefundSummary }) {
  return (
    <section data-testid="refund-summary" className="mt-6 rounded-3xl border border-[#BFDCCB] bg-[#EFF9F3] p-5">
      <h2 className="text-[22px] font-black text-[#25324A]">환불 예정 내역</h2>
      <dl className="mt-4 grid gap-3 text-[16px] font-bold text-[#4D596A]">
        <div className="flex justify-between gap-4"><dt>원 결제금액</dt><dd>{formatWon(summary.originalPayment)}</dd></div>
        <div className="flex justify-between gap-4"><dt>상품 환불액</dt><dd>{formatWon(summary.merchandiseRefund)}</dd></div>
        <div className="flex justify-between gap-4"><dt>원 배송비 환불</dt><dd>{formatWon(summary.shippingRefund)}</dd></div>
        <div className="flex justify-between gap-4"><dt>반품 배송비 차감</dt><dd>{summary.returnShippingFee > 0 ? `-${formatWon(summary.returnShippingFee)}` : formatWon(0)}</dd></div>
        <div className="flex justify-between gap-4 border-t border-[#BFDCCB] pt-3 text-[20px] font-black text-[#25324A]"><dt>최종 환불 예정금액</dt><dd className="text-[#238354]">{formatWon(summary.refundTotal)}</dd></div>
      </dl>
      <p className="mt-4 text-[14px] font-bold leading-relaxed text-[#4D685A]">{summary.methodLabel}로 환불되는 가상 연습입니다. 실제 금융 처리는 일어나지 않습니다.</p>
    </section>
  );
}
