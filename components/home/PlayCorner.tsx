import Image from "next/image";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { SceneCard } from "@/components/dundun-design/SceneCard";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";

const plays = [
  {
    image: "/tiles/tile-brain.webp",
    imageAlt: "같은 그림 카드를 찾는 짝 맞추기 놀이 장면",
    tag: "놀이",
    title: "카드 짝 맞추기",
    description: "같은 그림 카드를 찾아 뒤집어요.",
    href: "/brain/matching",
  },
  {
    image: "/mascot-cheer.webp",
    imageAlt: "든든이가 생활안전 확인 방법을 알려주는 그림",
    tag: "안전",
    title: "생활안전 확인하기",
    description: "수상한 문자와 전화를 누르기 전에 확인해요.",
    href: "/stories",
  },
  {
    image: "/tiles/tile-making.webp",
    imageAlt: "사진을 골라 달력을 만드는 장면",
    tag: "만들기",
    title: "사진 달력 만들기",
    description: "가족 사진으로 하나뿐인 달력을 만들어요.",
    href: "/making/calendar",
  },
] as const;

export default function PlayCorner() {
  return (
    <section className="dd-section" aria-labelledby="playground-title">
      <div className="dd-shell">
        <div className="dd-play-hero">
          <div className="dd-play-hero-image">
            <Image
              src={illustrations.playgroundHero}
              alt="든든이와 시니어 이용자들이 카드 놀이, 순서 기억하기, 사진 달력 만들기를 즐기는 그림"
              fill
              sizes="(max-width: 767px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="dd-play-hero-copy">
            <SectionHeading
              id="playground-title"
              eyebrow="놀이터"
              title={<>하루 5분,<br />가볍게 즐겨요</>}
              description="연습 사이에 쉬어가며 부담 없이 즐기는 놀이예요."
            />
            <PrimaryAction href="/play">놀이터 전체 보기</PrimaryAction>
          </div>
        </div>

        <div className="dd-feature-grid">
          {plays.map((play) => (
            <SceneCard
              key={play.href}
              href={play.href}
              image={play.image}
              imageAlt={play.imageAlt}
              tag={play.tag}
              title={play.title}
              description={play.description}
              actionLabel="둘러보기"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
