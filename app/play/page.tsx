import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { SceneCard } from "@/components/dundun-design/SceneCard";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";

export const metadata: Metadata = {
  title: "놀이터",
  description: "생활기기 연습과 가벼운 놀이를 매일 부담 없이 즐겨보세요.",
  alternates: { canonical: "/play" },
};

const plays = [
  {
    image: "/tiles/tile-brain.webp",
    imageAlt: "같은 그림 카드를 찾아 뒤집는 짝 맞추기 놀이 장면",
    title: "카드 짝 맞추기",
    description: "같은 그림 카드를 찾아 뒤집어요. 난이도를 고를 수 있어요.",
    href: "/brain/matching",
    tag: "놀이",
  },
  {
    image: illustrations.safetyHero,
    imageAlt: "든든이가 시니어 이용자와 스마트폰 안전을 확인하는 그림",
    title: "생활안전 확인하기",
    description: "수상한 문자와 전화는 누르기 전에 한 번 더 확인해요.",
    href: "/stories",
    tag: "안전",
  },
  {
    image: "/tiles/tile-making.webp",
    imageAlt: "가족 사진으로 달력을 만드는 장면",
    title: "사진 달력 만들기",
    description: "가족 사진으로 하나뿐인 달력을 만들어 인쇄할 수 있어요.",
    href: "/making/calendar",
    tag: "만들기",
  },
] as const;

export default function PlayHubPage() {
  return (
    <>
      <Header />
      <main>
        <section className="dd-inner-hero dd-inner-hero-green">
          <div className="dd-shell dd-inner-hero-grid">
            <SectionHeading
              level={1}
              eyebrow="놀이터"
              title={<>하루 5분,<br />가볍게 즐겨요</>}
              description="연습하다 쉬고 싶을 때 부담 없이 즐기는 놀이예요."
            />
            <div className="dd-inner-hero-image">
              <Image
                src={illustrations.playgroundHero}
                alt="든든이와 시니어 이용자들이 카드 놀이, 순서 기억하기, 사진 달력 만들기를 즐기는 그림"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="dd-section" aria-labelledby="play-list-title">
          <div className="dd-shell">
            <SectionHeading
              id="play-list-title"
              eyebrow="오늘의 즐길 거리"
              title="무엇을 해볼까요?"
              description="치료나 훈련이 아닌, 가볍게 웃으며 즐기는 콘텐츠예요."
            />
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
                  actionLabel="시작하기"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
