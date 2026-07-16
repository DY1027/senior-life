import Link from "next/link";
import { dailyMissionUrl, todayMission } from "@/lib/daily-missions";

// 오늘의 연습 — 매일 다른 임무 하나를 크게 보여준다.
// 홈이 하루 ISR이라 임무도 하루에 한 번 바뀐다.
export default function TodayMission() {
  const mission = todayMission();
  const missionHref = dailyMissionUrl(mission);

  return (
    <section className="px-5 py-8">
      <div className="mx-auto max-w-[880px] rounded-3xl border-2 border-[#F5D9A8] bg-[#FDF4DF] p-6 text-center sm:p-8">
        <span className="inline-block rounded-full bg-[#E67E3F] px-3 py-1 text-[13px] font-bold text-white">
          📅 오늘의 연습
        </span>
        <p className="mx-auto mt-3 max-w-[560px] break-keep text-[clamp(20px,3.6vw,26px)] font-extrabold leading-snug text-[#3B3226]">
          오늘은 {mission.description}
        </p>
        <p className="mt-2 text-[15px] text-[#8A7660]">
          실수해도 괜찮아요. 실제로 결제되지 않는 연습용 화면이에요.
        </p>
        <Link
          href={missionHref}
          className="mt-5 inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#E67E3F] px-9 text-[18px] font-extrabold text-white no-underline transition-transform active:scale-[0.97]"
        >
          연습 시작하기 →
        </Link>
      </div>
    </section>
  );
}
