"use client";
// 주간 놀이터 — 매주 다른 연습 3가지에 도전한다 (명세 9.4).
// 선정은 주 번호로 결정적(서버·클라이언트 동일), 완료 판정은 이 기기 기록으로만.
import Link from "next/link";
import { weeklyChallenge } from "@/lib/practices";
import { useProgress, completedThisWeek } from "@/lib/progress";

export default function WeeklyChallenge() {
  const progress = useProgress();
  const picks = weeklyChallenge();
  const doneCount = progress ? picks.filter((p) => completedThisWeek(progress, p.id)).length : 0;
  const allDone = doneCount === picks.length;

  return (
    <section className="px-5 py-4">
      <div className="mx-auto max-w-[880px] rounded-3xl border-2 border-[#DCE8CE] bg-[#F4F8EE] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-block rounded-full bg-[#4F7245] px-3 py-1 text-[13px] font-bold text-white">
            🗓️ 이번 주 도전
          </span>
          <span className="text-[14px] font-extrabold text-[#4F7245]">
            {allDone ? "🎉 주간 도장 획득!" : `${doneCount} / ${picks.length} 완료`}
          </span>
        </div>
        <p className="mt-3 break-keep text-[clamp(17px,2.8vw,20px)] font-extrabold leading-snug text-[#3B3226]">
          {allDone
            ? "이번 주 도전을 모두 해내셨어요. 정말 대단해요!"
            : "이번 주에는 아래 세 가지 연습에 도전해 보세요."}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {picks.map((p) => {
            const done = progress ? completedThisWeek(progress, p.id) : false;
            return (
              <Link
                key={p.id}
                href={p.href}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 no-underline transition-transform active:scale-[0.97] ${done ? "border-[#CFE3C0] bg-white" : "border-[#DCE8CE] bg-white"}`}
              >
                <span className="text-[26px]" aria-hidden="true">{p.emoji}</span>
                <span className="flex-1">
                  <span className="block break-keep text-[16px] font-extrabold leading-tight text-[#3B3226]">{p.title}</span>
                  <span className={`block text-[13px] font-bold ${done ? "text-[#4F7245]" : "text-[#C4621A]"}`}>
                    {done ? "✅ 이번 주 완료" : "도전하기 →"}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-[#8A9B7C]">
          세 가지를 모두 끝내면 주간 도장(🗓️)을 받아요. 도전 목록은 매주 월요일에 바뀝니다.
        </p>
      </div>
    </section>
  );
}
