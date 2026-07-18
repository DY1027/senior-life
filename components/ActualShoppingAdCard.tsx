"use client";

import { track } from "@/lib/track";

export type ActualShoppingAdCardProps = {
  imagePath?: string;
  title: string;
  description: string;
  affiliateUrl?: string;
  buttonLabel?: string;
};

export default function ActualShoppingAdCard({
  imagePath,
  title,
  description,
  affiliateUrl,
  buttonLabel = "쿠팡에서 실제 상품 보기 ↗",
}: ActualShoppingAdCardProps) {
  if (!affiliateUrl?.trim()) return null;

  return (
    <section
      data-testid="actual-shopping-ad"
      aria-labelledby="actual-shopping-ad-title"
      className="mt-14 border-t-2 border-[#D8C8AD] pt-10 text-left"
    >
      <div className="rounded-3xl border-2 border-[#D6A65C] bg-[#FFF7E8] p-5 sm:p-7">
        <h2 id="actual-shopping-ad-title" className="break-keep text-[23px] font-black leading-snug text-[#5B3514] sm:text-[27px]">
          광고 · 여기부터는 실제 쇼핑입니다
        </h2>
        <p className="mt-4 break-keep text-[18px] font-extrabold leading-relaxed text-[#4C3A28]">
          아래 상품은 키오스크 연습과 관계없는 쿠팡의 실제 판매 상품입니다.
        </p>
        <p className="mt-2 break-keep text-[17px] font-bold leading-relaxed text-[#6B4E32]">
          쿠팡으로 이동한 뒤 상품을 주문하면 실제 결제와 배송이 이루어집니다.
        </p>

        <div className="mt-6 rounded-2xl border border-[#E7C995] bg-white p-4 sm:p-5">
          {imagePath && (
            /* eslint-disable-next-line @next/next/no-img-element -- 관리자 설정의 로컬 또는 쿠팡 공식 광고 이미지 */
            <img
              src={imagePath}
              alt={`${title} 광고 이미지`}
              width={240}
              height={180}
              loading="lazy"
              className="mx-auto mb-4 h-auto max-h-[180px] w-full max-w-[240px] rounded-xl object-contain"
            />
          )}
          <h3 className="break-keep text-[20px] font-black leading-snug text-[#2F2A24]">{title}</h3>
          <p className="mt-2 break-keep text-[16px] font-semibold leading-relaxed text-[#625A50]">{description}</p>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() => track("affiliate_click", { product: title, placement: "completion_actual_shopping" })}
            className="mt-5 flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-[#C94B32] px-5 text-center text-[18px] font-extrabold text-white no-underline"
          >
            {buttonLabel}
          </a>
          <p className="mt-4 break-keep text-[14px] font-semibold leading-relaxed text-[#675B4D] sm:text-[15px]">
            이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
