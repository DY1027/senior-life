import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "만들기 놀이 — 사진 달력 만들기",
  description:
    "손주·가족 사진으로 세상에 하나뿐인 달력을 만들어 보세요. 인쇄해서 벽에 붙이거나 휴대폰에 저장할 수 있어요. 회원가입 없이 무료입니다.",
  alternates: { canonical: "/making" },
};

export default function MakingHubPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-14 pt-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
          ✂️ 만들기 놀이
        </span>
        <h1 className="mt-3 text-[clamp(26px,5vw,34px)] font-extrabold leading-snug tracking-[-0.5px] text-[#3B3226]">
          오늘은 무엇을 만들어 볼까요?
        </h1>
        <p className="mt-2 text-[17px] leading-relaxed text-[#6E5C49]">
          내 사진, 내 글씨로 만드는 <strong>세상에 하나뿐인 작품</strong>이에요.
          <br />
          만든 것은 인쇄하거나 휴대폰에 저장할 수 있어요.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-4">
        <Link
          href="/making/calendar"
          className="flex items-center gap-5 rounded-3xl border-2 border-[#EFDFC0] bg-[#F9F2E0] p-5 no-underline transition-transform active:scale-[0.98]"
        >
          <span className="flex h-[96px] w-[96px] flex-shrink-0 items-center justify-center rounded-2xl bg-white text-[52px]" aria-hidden="true">
            📅
          </span>
          <span className="flex-1">
            <span className="block break-keep text-[22px] font-extrabold text-[#3B3226]">사진 달력 만들기</span>
            <span className="mt-1 block break-keep text-[15px] leading-relaxed text-[#8A7660]">
              가족 사진으로 이번 달 달력을 만들어요. 인쇄하면 벽걸이 달력이 돼요.
            </span>
            <span className="mt-2 block text-[16px] font-extrabold text-[#C4621A]">만들러 가기 →</span>
          </span>
        </Link>

        {/* 준비 중 */}
        <div className="flex items-center gap-5 rounded-3xl border-2 border-dashed border-[#EFDFC0] bg-[#FBF6EA] p-5">
          <Image
            src="/mascot-building.webp"
            alt="안전모를 쓰고 망치질하는 든든이"
            width={110}
            height={116}
            className="h-auto w-[110px] flex-shrink-0 rounded-2xl"
          />
          <span className="flex-1">
            <span className="block text-[19px] font-extrabold text-[#6B6860]">다음 만들기를 준비하고 있어요</span>
            <span className="mt-1 block break-keep text-[15px] text-[#9B9890]">🔨 부채 꾸미기 (인쇄해서 만들기)</span>
            <span className="mt-1 block break-keep text-[15px] text-[#9B9890]">🔨 생신 축하 카드 만들기</span>
          </span>
        </div>
      </div>

      <p className="mt-7 break-keep text-center text-[14px] leading-relaxed text-[#8A7660]">
        올린 사진은 서버에 저장되지 않고, 내 휴대폰(브라우저) 안에서만 사용돼요.
      </p>
    </div>
  );
}
