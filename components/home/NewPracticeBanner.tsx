import Link from "next/link";
import { getPractice, NEW_PRACTICE_ID, UPCOMING_PRACTICE } from "@/lib/practices";

// 새로 생긴 연습 알림 + 다음 연습 예고 — 재방문할 이유를 홈에서 만든다.
// 예고는 한 번에 하나만 (준비 중이 많으면 미완성처럼 보인다).
export default function NewPracticeBanner() {
  const fresh = getPractice(NEW_PRACTICE_ID);
  if (!fresh) return null;

  return (
    <section className="px-5 py-4">
      <Link
        href={fresh.href}
        className="mx-auto flex max-w-[880px] items-center gap-4 rounded-3xl border-2 border-[#BBD9F5] bg-[#EAF3FC] p-5 no-underline transition-transform active:scale-[0.98]"
      >
        <span className="flex h-[64px] w-[64px] flex-shrink-0 items-center justify-center rounded-2xl bg-white text-[34px]" aria-hidden="true">
          {fresh.emoji}
        </span>
        <span className="flex-1">
          <span className="inline-block rounded-full bg-[#1B6FC8] px-2.5 py-0.5 text-[12px] font-bold text-white">✨ 새로운 연습이 열렸어요</span>
          <span className="mt-1 block break-keep text-[20px] font-extrabold leading-snug text-[#0C447C]">
            {fresh.title} 연습을 눌러 보세요
          </span>
          <span className="block break-keep text-[14px] text-[#4A6E96]">
            다음 연습은 {UPCOMING_PRACTICE.title}입니다.
          </span>
        </span>
        <span className="text-[18px] font-extrabold text-[#1B6FC8]" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
