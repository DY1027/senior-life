import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "그림으로 배우는 생활안전",
  description: "보이스피싱과 디지털 생활 속 주의사항을 그림과 쉬운 설명으로 확인하세요.",
  alternates: { canonical: "/stories" },
};

const stories = [
  {
    img: "/mascot-cheer.webp",
    alt: "앞발을 내밀며 다정하게 알려주는 든든이",
    title: "보이스피싱, 이렇게 막아요",
    desc: "가짜 문자와 전화를 구별하는 세 가지 약속. 딱 2분이면 배워요.",
    href: "/stories/phishing",
    badge: "⭐ 꼭 보세요",
  },
];

export default function StoriesHubPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-14 pt-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
          🛡️ 그림으로 배우는 생활안전
        </span>
        <h1 className="mt-3 text-[clamp(26px,5vw,34px)] font-extrabold leading-snug tracking-[-0.5px] text-[#3B3226]">
          어렵고 위험한 상황을 쉽게 확인해요
        </h1>
        <p className="mt-2 break-keep text-[17px] leading-relaxed text-[#6E5C49]">
          어렵고 위험한 상황을 그림과 쉬운 설명으로 한 장씩 확인해보세요.
          <br />
          천천히 넘기며 읽어 보세요.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-4">
        {stories.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-5 rounded-3xl border-2 border-[#EFDFC0] bg-[#F9F2E0] p-5 no-underline transition-transform active:scale-[0.98]"
          >
            <Image src={s.img} alt={s.alt} width={100} height={122} className="h-auto w-[100px] flex-shrink-0 rounded-2xl" />
            <span className="flex-1">
              <span className="inline-block rounded-full bg-[#E67E3F] px-2.5 py-0.5 text-[12px] font-bold text-white">{s.badge}</span>
              <span className="mt-1.5 block break-keep text-[22px] font-extrabold text-[#3B3226]">{s.title}</span>
              <span className="mt-1 block break-keep text-[15px] leading-relaxed text-[#8A7660]">{s.desc}</span>
              <span className="mt-2 block text-[16px] font-extrabold text-[#C4621A]">읽으러 가기 →</span>
            </span>
          </Link>
        ))}

        <div className="flex items-center gap-5 rounded-3xl border-2 border-dashed border-[#EFDFC0] bg-[#FBF6EA] p-5">
          <Image
            src="/mascot-building.webp"
            alt="안전모를 쓰고 망치질하는 든든이"
            width={100}
            height={105}
            className="h-auto w-[100px] flex-shrink-0 rounded-2xl"
          />
          <span className="flex-1">
            <span className="block text-[19px] font-extrabold text-[#6B6860]">다음 생활안전 콘텐츠를 만들고 있어요</span>
            <span className="mt-1 block break-keep text-[15px] text-[#9B9890]">🔨 키오스크, 무서워하지 않아도 돼요</span>
            <span className="mt-1 block break-keep text-[15px] text-[#9B9890]">🔨 스마트폰 안전하게 쓰는 법</span>
          </span>
        </div>
      </div>
    </div>
  );
}
