import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckIcon } from "@/components/shopping/ShoppingIcons";
import styles from "@/components/shopping/shopping.module.css";
import { getShoppingMission, SHOPPING_MISSIONS } from "@/content/shopping";
import CommerceMissionStartLink from "@/features/shopping/ui/CommerceMissionStartLink";

type Props = { params: Promise<{ missionSlug: string }> };

export function generateStaticParams() {
  return SHOPPING_MISSIONS.map((mission) => ({ missionSlug: mission.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { missionSlug } = await params;
  const mission = getShoppingMission(missionSlug);
  if (!mission) return {};
  return {
    title: `${mission.title} 연습`,
    description: mission.summary,
    alternates: { canonical: `/shopping/missions/${mission.slug}` },
  };
}

export default async function ShoppingMissionPage({ params }: Props) {
  const { missionSlug } = await params;
  const mission = getShoppingMission(missionSlug);
  if (!mission) notFound();

  return (
    <>
      <Header />
      <main className={styles.missionIntroPage}>
        <nav className={styles.breadcrumb} aria-label="현재 위치"><Link href="/shopping">쇼핑 연습관</Link><span>›</span><span>{mission.shortTitle}</span></nav>
        <section className={styles.missionIntroHero}>
          <div className={styles.introImage}>
            <Image src={mission.visual.heroImage?.src ?? mission.visual.cardImage.src} alt={mission.visual.heroImage?.alt ?? mission.visual.cardImage.alt} fill priority sizes="(max-width: 767px) 100vw, 45vw" className="object-cover" />
            <span>연습용 예시 화면</span>
          </div>
          <div className={styles.introCopy}>
            <span>{mission.difficulty} · 약 {mission.estimatedMinutes}분</span>
            <h1>{mission.title}</h1>
            <p>{mission.summary}</p>
            <div className={styles.noPaymentCallout}><CheckIcon /><div><strong>안심하세요</strong><span>실제 주문, 결제 또는 개인정보 입력은 없습니다.</span></div></div>
            {["first-usb-c-cable", "rainy-budget-30000"].includes(mission.slug)
              ? <CommerceMissionStartLink missionSlug={mission.slug} />
              : <Link href={`/shopping/missions/${mission.slug}/practice`}>연습 시작하기</Link>}
          </div>
        </section>

        <section className={styles.introSteps} aria-labelledby="mission-steps-title">
          <h2 id="mission-steps-title">이렇게 연습해요</h2>
          <ol>{mission.steps.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}</ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
