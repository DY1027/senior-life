import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { SceneCard } from "@/components/dundun-design/SceneCard";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";
import { PRACTICES, UPCOMING_PRACTICE } from "@/lib/practices";

export const metadata: Metadata = {
  title: "키오스크 연습",
  description: "카페, 햄버거, 기차표, 주차 정산, 마트 셀프계산대, ATM과 무인민원발급기를 실제처럼 연습하세요.",
  alternates: { canonical: "/kiosk" },
};

export default function KioskHubPage() {
  return (
    <>
      <Header />
      <main>
        <section className="dd-inner-hero">
          <div className="dd-shell dd-inner-hero-grid">
            <SectionHeading
              level={1}
              eyebrow="연습마을"
              title={<>무엇을<br />연습해 볼까요?</>}
              description={<>눌러보고, 실수하고, 다시 해보세요.<br />실제 결제나 접수는 되지 않아요.</>}
            />
            <div className="dd-inner-hero-image">
              <Image
                src={illustrations.practiceVillage}
                alt="든든이가 일곱 가지 디지털 생활기기 연습 장소를 소개하는 마을 지도"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="dd-section" aria-labelledby="kiosk-list-title">
          <div className="dd-shell">
            <SectionHeading
              id="kiosk-list-title"
              eyebrow="생활기기 7종"
              title="연습할 장소를 골라보세요"
              description="처음이라면 카페 주문부터 천천히 시작해도 좋아요."
            />
            <div className="dd-practice-grid">
              {PRACTICES.map((practice) => (
                <SceneCard
                  key={practice.id}
                  href={practice.href}
                  image={practice.img ?? "/mascot.webp"}
                  imageAlt={`${practice.worldName}에서 ${practice.title}을 연습하는 장면`}
                  tag={practice.category}
                  title={practice.worldName}
                  subtitle={practice.title}
                  description={practice.desc}
                  actionLabel="연습 시작"
                />
              ))}
            </div>

            <div className="dd-coming-soon">
              <span className="dd-card-tag">다음 연습</span>
              <strong>{UPCOMING_PRACTICE.title}</strong>
              <p>새로운 생활기기 연습을 준비하고 있어요.</p>
              <em>준비 중</em>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
