import Image from "next/image";
import Link from "next/link";

// 홈에서 만들기 놀이로 들어가는 배너 — 첫 도구(사진 달력)를 직접 가리킨다.
export default function MakingBanner() {
  return (
    <section className="px-5 pb-2 pt-2">
      <Link
        href="/making/calendar"
        className="mx-auto flex max-w-[880px] items-center gap-4 rounded-3xl border-2 border-[#F5D9A8] bg-[#FDF4DF] p-5 no-underline transition-transform active:scale-[0.98]"
      >
        <Image
          src="/tiles/tile-making.webp"
          alt="할머니가 든든이와 함께 색종이로 만들기를 하는 그림"
          width={110}
          height={87}
          className="h-auto w-[110px] flex-shrink-0 rounded-2xl"
        />
        <span className="flex-1">
          <span className="inline-block rounded-full bg-[#E67E3F] px-2.5 py-0.5 text-[12px] font-bold text-white">✂️ 만들기 놀이</span>
          <span className="mt-1 block break-keep text-[20px] font-extrabold leading-snug text-[#3B3226]">
            사진 달력 만들기
          </span>
          <span className="block break-keep text-[15px] text-[#8A7660]">가족 사진으로 세상에 하나뿐인 달력을 만들어요</span>
        </span>
        <span className="text-[18px] font-extrabold text-[#C4621A]" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
