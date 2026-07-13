import Image from "next/image";
import Link from "next/link";

// 홈에서 그림책으로 들어가는 배너 — 첫 이야기(보이스피싱)를 직접 가리킨다.
export default function StoryBanner() {
  return (
    <section className="px-5 pb-2">
      <Link
        href="/stories/phishing"
        className="mx-auto flex max-w-[880px] items-center gap-4 rounded-3xl border-2 border-[#DCE8CE] bg-[#F4F8EE] p-5 no-underline transition-transform active:scale-[0.98]"
      >
        <Image
          src="/mascot-cheer.webp"
          alt="앞발을 내밀며 다정하게 알려주는 든든이"
          width={84}
          height={102}
          className="h-auto w-[84px] flex-shrink-0 rounded-2xl"
        />
        <span className="flex-1">
          <span className="inline-block rounded-full bg-[#E67E3F] px-2.5 py-0.5 text-[12px] font-bold text-white">📖 든든이 그림책</span>
          <span className="mt-1 block break-keep text-[20px] font-extrabold leading-snug text-[#3B3226]">
            보이스피싱, 이렇게 막아요
          </span>
          <span className="block break-keep text-[15px] text-[#6E7D5E]">가짜 문자 구별법, 그림책으로 2분이면 배워요</span>
        </span>
        <span className="text-[18px] font-extrabold text-[#C4621A]" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
