import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "두뇌 놀이 — 즐겁게 하는 두뇌 운동",
  description:
    "카드 짝 맞추기 등 어르신을 위한 두뇌 놀이. 시간 제한 없이 큰 글씨·큰 버튼으로 즐겁게 기억력 운동을 해보세요. 회원가입 없이 무료입니다.",
  alternates: { canonical: "/brain" },
};

const games = [
  {
    img: "/tiles/tile-brain.webp",
    alt: "할아버지가 든든이와 함께 퍼즐을 맞추는 그림",
    title: "카드 짝 맞추기",
    desc: "뒤집힌 카드에서 같은 그림 두 장을 찾아요. 기억력 운동에 좋아요.",
    href: "/brain/matching",
    ready: true,
  },
];

const upcoming = ["오늘의 문제 (속담·상식 퀴즈)", "순서 기억하기"];

export default function BrainHubPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-14 pt-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
          🧩 두뇌 놀이
        </span>
        <h1 className="mt-3 text-[clamp(26px,5vw,34px)] font-extrabold leading-snug tracking-[-0.5px] text-[#3B3226]">
          오늘은 어떤 놀이를 해볼까요?
        </h1>
        <p className="mt-2 text-[17px] leading-relaxed text-[#6E5C49]">
          하루 10분, 즐겁게 하는 두뇌 운동이에요.
          <br />
          시간 제한이 없으니 천천히 즐겨 보세요.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-4">
        {games.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="flex items-center gap-5 overflow-hidden rounded-3xl border-2 border-[#EFDFC0] bg-[#F9F2E0] p-5 no-underline transition-transform active:scale-[0.98]"
          >
            <Image src={g.img} alt={g.alt} width={120} height={95} className="h-auto w-[120px] flex-shrink-0 rounded-2xl" />
            <span className="flex-1">
              <span className="block break-keep text-[22px] font-extrabold text-[#3B3226]">{g.title}</span>
              <span className="mt-1 block break-keep text-[15px] leading-relaxed text-[#8A7660]">{g.desc}</span>
              <span className="mt-2 block text-[16px] font-extrabold text-[#C4621A]">놀러가기 →</span>
            </span>
          </Link>
        ))}

        {/* 준비 중 — 든든이가 공사 중 */}
        <div className="flex items-center gap-5 rounded-3xl border-2 border-dashed border-[#EFDFC0] bg-[#FBF6EA] p-5">
          <Image
            src="/mascot-building.webp"
            alt="안전모를 쓰고 망치질하는 든든이"
            width={110}
            height={116}
            className="h-auto w-[110px] flex-shrink-0 rounded-2xl"
          />
          <span className="flex-1">
            <span className="block text-[19px] font-extrabold text-[#6B6860]">다음 놀이를 만들고 있어요</span>
            {upcoming.map((u) => (
              <span key={u} className="mt-1 block break-keep text-[15px] text-[#9B9890]">
                🔨 {u}
              </span>
            ))}
          </span>
        </div>
      </div>

      <p className="mt-7 break-keep text-center text-[14px] leading-relaxed text-[#8A7660]">
        두뇌 놀이는 즐거운 습관을 위한 것으로, 치매 예방·진단 등 의학적 효과를 보장하지 않습니다.
        기억력에 걱정이 있다면 가까운 치매안심센터(1899-9988)와 상의하세요.
      </p>
    </div>
  );
}
