"use client";
import Link from "next/link";
import { getPractice } from "@/lib/practices";
import {
  useProgress,
  totalCompletions,
  completedKinds,
  weeklyCount,
  stamps,
} from "@/lib/progress";

// 지난번 이어하기 — 로그인 없이 브라우저 저장 기록으로 만든다.
// 기록이 없으면(첫 방문) 아무것도 그리지 않는다.
export default function ContinueCard() {
  const progress = useProgress();

  if (!progress || !progress.lastId) return null;
  const last = getPractice(progress.lastId);
  if (!last) return null;

  const earnedStamps = stamps(progress).filter((s) => s.earned).length;
  const facts = [
    { label: "이번 주 연습", value: `${weeklyCount(progress)}회` },
    { label: "완료한 연습", value: `${completedKinds(progress)}개` },
    { label: "받은 도장", value: `${earnedStamps}개` },
    { label: "전체 연습", value: `${totalCompletions(progress)}회` },
  ];

  return (
    <section className="px-5 py-4">
      <div className="mx-auto max-w-[880px] rounded-3xl border-2 border-[#EFDFC0] bg-white p-6 sm:p-7">
        <span className="inline-block rounded-full bg-[#FDDFC0] px-3 py-1 text-[13px] font-bold text-[#C4621A]">
          🔖 지난번 이어하기
        </span>
        <p className="mt-3 break-keep text-[clamp(18px,3vw,22px)] font-extrabold leading-snug text-[#3B3226]">
          지난번에는 <span className="text-[#C4621A]">{last.short}</span>을(를) 연습하셨어요. 이어서 해볼까요?
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {facts.map((f) => (
            <span key={f.label} className="rounded-xl bg-[#F9F2E0] px-3 py-2.5 text-center">
              <span className="block text-[13px] font-bold text-[#8A7660]">{f.label}</span>
              <span className="block text-[18px] font-extrabold text-[#3B3226]">{f.value}</span>
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={last.href}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E67E3F] px-7 text-[17px] font-extrabold text-white no-underline transition-transform active:scale-[0.97]"
          >
            이어서 연습하기 →
          </Link>
          <Link
            href="/records"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-[#EFDFC0] bg-white px-7 text-[16px] font-bold text-[#6E5C49] no-underline"
          >
            내 기록 보기
          </Link>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-[#9B9890]">
          연습 기록은 지금 쓰고 계신 이 기기 브라우저에만 저장돼요. 서버로 보내지 않아요.
        </p>
      </div>
    </section>
  );
}
