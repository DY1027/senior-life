"use client";
import Image from "next/image";
import Link from "next/link";
import { PRACTICES } from "@/lib/practices";
import { useProgress } from "@/lib/progress";

// 홈의 생활기기 연습 목록 — 완료한 연습에는 도장(✅)이 붙는다.
// 기록은 이 브라우저에만 저장된다 (수화 전에는 도장 없이 그려진다).
export default function PracticeGrid() {
  const progress = useProgress();

  return (
    <section className="px-5 py-8">
      <div className="mx-auto max-w-[880px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#3B3226]">
          실제 생활기기 연습
        </h2>
        <p className="mt-2 text-center text-[16px] leading-relaxed text-[#8A7660]">
          눌러보고, 실수하고, 다시 해보세요. 전부 <strong>연습용 화면</strong>이에요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PRACTICES.map((p) => {
            const doneCount = progress?.counts[p.id] ?? 0;
            return (
              <Link
                key={p.id}
                href={p.href}
                className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#F1E3C8] bg-[#F9F2E0] no-underline transition-transform active:scale-[0.97]"
              >
                {doneCount > 0 && (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-[#4F7245] px-2.5 py-1 text-[12px] font-extrabold text-white">
                    ✅ 도장 {Math.min(doneCount, 99)}
                  </span>
                )}
                {p.img ? (
                  <Image src={p.img} alt="" width={560} height={443} className="h-auto w-full" />
                ) : (
                  <span className="flex aspect-[560/443] w-full items-center justify-center bg-[#EAF1F8] text-[64px]" aria-hidden="true">
                    {p.emoji}
                  </span>
                )}
                <span className="px-3 pb-4 pt-1 text-center">
                  <span className="block break-keep text-[18px] font-extrabold text-[#3B3226]">{p.title}</span>
                  <span className="mt-0.5 block text-[14px] font-bold text-[#C4621A]">연습하기 →</span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-center">
          <Link href="/kiosk" className="text-[16px] font-bold text-[#C4621A] no-underline">
            연습 전체 보기 →
          </Link>
        </p>
      </div>
    </section>
  );
}
