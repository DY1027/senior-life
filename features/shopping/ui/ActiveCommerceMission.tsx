"use client";

import { evaluateCommerceMission } from "@/features/shopping/engine/commerce-mission-evaluator";
import { useShoppingCart } from "@/features/shopping/storage/use-shopping-storage";

export default function ActiveCommerceMission({ showFeedback = false }: { showFeedback?: boolean }) {
  const cart = useShoppingCart();
  const feedback = evaluateCommerceMission(cart);
  if (!feedback) return null;

  return (
    <aside data-testid="active-shopping-mission" className={`rounded-2xl border-2 p-4 ${showFeedback && !feedback.complete ? "border-[#F0B7B1] bg-[#FFF2F0]" : "border-[#BFD0E9] bg-[#EDF4FF]"}`}>
      <span className="text-[13px] font-extrabold text-[#246BDF]">{feedback.title}</span>
      <p className="mt-1 break-keep text-[16px] font-extrabold leading-relaxed text-[#25324A]">{feedback.instruction}</p>
      {showFeedback && feedback.reasons.length > 0 && (
        <div data-testid="mission-feedback" role="alert" className="mt-4 rounded-xl bg-white p-4">
          <strong className="text-[16px] font-black text-[#A7352E]">선택을 다시 확인해 주세요</strong>
          <ul className="mt-2 grid gap-2 pl-5 text-[15px] font-bold leading-relaxed text-[#6F3A34]">
            {feedback.reasons.map((reason) => <li key={reason} className="list-disc">{reason}</li>)}
          </ul>
        </div>
      )}
      {showFeedback && feedback.complete && (
        <p data-testid="mission-ready" role="status" className="mt-3 rounded-xl bg-white p-3 text-[15px] font-extrabold text-[#286B4B]">조건을 모두 맞췄어요. 주문 전 확인으로 이동할 수 있습니다.</p>
      )}
    </aside>
  );
}
