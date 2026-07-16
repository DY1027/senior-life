"use client";
// 임무 선택 목록 — 모드별로 묶고, 이 기기에서 완료한 임무에 ✅ 도장을 붙인다.
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { getKioskConfig } from "@/lib/kiosk-config";
import type { PracticeMode, Scenario } from "@/lib/kiosk-engine/types";

const MODES: { mode: PracticeMode; label: string; emoji: string; desc: string }[] = [
  { mode: "learn", label: "천천히 배우기", emoji: "🐢", desc: "눌러야 할 버튼이 반짝이고, 음성이 한 단계씩 알려드려요." },
  { mode: "solo", label: "혼자 연습하기", emoji: "💪", desc: "안내 없이 스스로! 막히면 도움말 버튼을 누르면 돼요." },
  { mode: "challenge", label: "실제처럼 도전", emoji: "🔥", desc: "" },
  { mode: "free", label: "자유 연습", emoji: "🎈", desc: "임무 없이 모든 메뉴를 마음껏 눌러 보세요." },
];

export default function MissionList({ kioskType, scenarios }: { kioskType: string; scenarios: Scenario[] }) {
  const progress = useProgress();
  const done = new Set(progress?.scenarios ?? []);
  const config = getKioskConfig(kioskType);

  return (
    <div className="flex flex-col gap-7">
      {MODES.map(({ mode, label, emoji, desc }) => {
        const items = scenarios.filter((s) => s.mode === mode);
        const modeDescription = mode === "challenge" ? config.challengeDescription : desc;
        if (items.length === 0) return null;
        return (
          <section key={mode}>
            <h2 className="ml-1 text-[20px] font-extrabold text-[#3B3226]">
              {emoji} {label}
            </h2>
            <p className="mb-2.5 ml-1 break-keep text-[14px] leading-relaxed text-[#8A7660]">{modeDescription}</p>
            <div className="flex flex-col gap-2.5">
              {items.map((s) => (
                <Link
                  key={s.id}
                  href={`/kiosk/${kioskType}/${s.id}`}
                  className="block rounded-2xl border-2 border-[#EFDFC0] bg-white px-4 py-4 no-underline transition-transform active:scale-[0.98]"
                >
                  {/* 오른쪽 고정 문구 없이 세로로 — 좁은 화면·글자 확대에서도 안 꺾인다 */}
                  <span className="block break-keep text-[18px] font-extrabold leading-snug text-[#3B3226]">
                    {s.title}
                    {done.has(s.id) && <span className="ml-2 rounded-full bg-[#EFF5E9] px-2 py-0.5 text-[12px] font-bold text-[#4F7245]">✅ 완료</span>}
                  </span>
                  {s.missionText && (
                    <span className="mt-0.5 block break-keep text-[14px] leading-relaxed text-[#8A7660]">{s.missionText}</span>
                  )}
                  <span className="mt-1.5 block text-[15px] font-extrabold text-[#C4621A]">시작하기 →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
