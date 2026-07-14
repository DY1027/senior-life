"use client";
import { track } from "@/lib/track";
import type { AffiliateProduct } from "@/content/affiliate";

// 쿠팡 파트너스 상품 카드.
// 규정 준수: "광고" 표시 + 대가성 문구를 카드와 한 화면에 항상 함께 노출한다.
export default function AffiliateCard({ product, heading }: { product: AffiliateProduct; heading?: string }) {
  return (
    <div className="mt-4 text-left">
      {heading && <p className="mb-2 text-center text-[16px] font-bold text-[#6E5C49]">{heading}</p>}
      <p className="mb-2 break-keep text-center text-[12px] leading-relaxed text-[#9B8B76]">
        이 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
      <a
        href={product.href}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => track("affiliate_click", { product: product.id })}
        className="block rounded-2xl border-2 border-[#EFDFC0] bg-white px-5 py-4 no-underline transition-transform active:scale-[0.98]"
      >
        <span className="flex items-center gap-2">
          <span className="flex-shrink-0 rounded-md bg-[#F0E7D2] px-2 py-0.5 text-[11px] font-bold text-[#8A7660]">광고</span>
          <span className="break-keep text-[17px] font-extrabold text-[#3B3226]">{product.label}</span>
        </span>
        <span className="mt-1 block break-keep text-[14px] leading-relaxed text-[#8A7660]">{product.desc}</span>
        <span className="mt-3 flex h-[44px] items-center justify-center rounded-full bg-[#E67E3F] text-[15px] font-bold text-white">
          쿠팡에서 보기 →
        </span>
      </a>
    </div>
  );
}
