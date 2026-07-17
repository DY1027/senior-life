import type { Metadata } from "next";
import Image from "next/image";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { SceneCard } from "@/components/dundun-design/SceneCard";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";

export const metadata: Metadata = {
  title: "그림으로 배우는 생활안전",
  description: "보이스피싱과 디지털 생활 속 주의사항을 그림과 쉬운 설명으로 확인하세요.",
  alternates: { canonical: "/stories" },
};

export default function StoriesHubPage() {
  return (
    <>
      <section className="dd-inner-hero dd-inner-hero-blue">
        <div className="dd-shell dd-inner-hero-grid">
          <SectionHeading
            level={1}
            eyebrow="생활안전"
            title={<>누르기 전에<br />한 번 더 확인해요</>}
            description="걱정을 키우기보다, 차분하게 확인하는 방법을 그림으로 익혀요."
          />
          <div className="dd-inner-hero-image">
            <Image
              src={illustrations.safetyHero}
              alt="든든이가 안전 확인 안내판을 들고 시니어 이용자와 스마트폰 문자를 살펴보는 그림"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 58vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="dd-section" aria-labelledby="safety-list-title">
        <div className="dd-shell">
          <SectionHeading
            id="safety-list-title"
            eyebrow="2분 생활안전"
            title="그림을 넘기며 확인해요"
            description="중요한 약속만 짧고 쉽게 정리했습니다."
          />
          <div className="mt-8 grid max-w-[760px] gap-5 md:grid-cols-2">
            <SceneCard
              href="/stories/phishing"
              image="/story-sms.webp"
              imageAlt="수상한 문자 메시지를 확인하는 생활안전 그림"
              tag="꼭 확인해요"
              title="보이스피싱, 이렇게 막아요"
              description="가짜 문자와 전화를 구별하는 세 가지 약속을 확인해요."
              actionLabel="읽으러 가기"
            />
            <div className="dd-coming-soon mt-0">
              <span className="dd-card-tag">다음 이야기</span>
              <strong>스마트폰 안전하게 쓰는 법</strong>
              <p>든든이와 함께 다음 생활안전 이야기를 만들고 있어요.</p>
              <em>준비 중</em>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
