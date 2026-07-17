import Image from "next/image";
import Link from "next/link";

// 오늘의 놀이터 — 연습만 반복하면 학습 사이트처럼 느껴지니 짧은 놀이를 잇는다.
const plays = [
  {
    img: "/tiles/tile-brain.webp",
    alt: "할아버지가 든든이와 함께 퍼즐을 맞추는 그림",
    title: "카드 짝 맞추기",
    desc: "같은 그림 카드를 찾아 뒤집어요",
    href: "/brain/matching",
  },
  {
    img: "/mascot-cheer.webp",
    alt: "앞발을 내밀며 다정하게 알려주는 든든이",
    title: "보이스피싱 문자 구별하기",
    desc: "가짜 문자 구별법을 그림과 쉬운 설명으로 확인해요",
    href: "/stories/phishing",
  },
  {
    img: "/tiles/tile-making.webp",
    alt: "할머니가 든든이와 함께 색종이로 만들기를 하는 그림",
    title: "사진 달력 만들기",
    desc: "가족 사진으로 하나뿐인 달력을 만들어요",
    href: "/making/calendar",
  },
];

export default function PlayCorner() {
  return (
    <section className="px-5 py-8">
      <div className="mx-auto max-w-[880px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#3B3226]">
          오늘의 놀이터
        </h2>
        <p className="mt-2 text-center text-[16px] text-[#8A7660]">하루 5분, 가볍게 즐기는 놀이입니다.</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {plays.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#DCE8CE] bg-[#F4F8EE] no-underline transition-transform active:scale-[0.97]"
            >
              <span className="flex h-[120px] items-center justify-center overflow-hidden">
                <Image src={p.img} alt={p.alt} width={220} height={120} className="h-full w-auto object-contain py-2" />
              </span>
              <span className="px-4 pb-4 pt-1 text-center">
                <span className="block break-keep text-[18px] font-extrabold text-[#3B3226]">{p.title}</span>
                <span className="mt-0.5 block break-keep text-[14px] leading-snug text-[#6E7D5E]">{p.desc}</span>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center">
          <Link href="/play" className="text-[16px] font-bold text-[#C4621A] no-underline">
            놀이터 전체 보기 →
          </Link>
        </p>
      </div>
    </section>
  );
}
