import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingHubProgress from "@/components/shopping/ShoppingHubProgress";
import { CartIcon, CheckIcon, CompareIcon, SearchIcon } from "@/components/shopping/ShoppingIcons";
import { SHOPPING_MISSIONS } from "@/content/shopping";
import styles from "@/components/shopping/shopping.module.css";

export const metadata: Metadata = {
  title: "쇼핑 연습관",
  description: "실제 결제 없이 상품 검색, 비교, 옵션 선택, 예산 맞추기와 주문 실수 찾기를 연습하세요.",
  alternates: { canonical: "/shopping" },
};

const modeIcons = { guided: SearchIcon, budget: CartIcon, compare: CompareIcon, mistake: CheckIcon };

export default function ShoppingHubPage() {
  return (
    <>
      <Header />
      <main className={styles.shoppingHub}>
        <section className={styles.hubHero}>
          <div className={styles.hubHeroCopy}>
            <span>시니어든든 쇼핑 연습관</span>
            <h1>사기 전에,<br />마음껏 연습해 보세요</h1>
            <p>검색부터 주문 내용 확인까지 실제 결제 없이 천천히 눌러볼 수 있어요.</p>
            <div className={styles.heroTrust}><CheckIcon /> 무료 · 회원가입 없음 · 실제 결제 없음</div>
            <Link href="/shopping/missions/first-usb-c-cable">처음 쇼핑부터 연습하기</Link>
          </div>
          <div className={styles.hubHeroImage}>
            <Image src="/images/shopping/hero/shopping-practice-hero.jpg" alt="비 오는 날 현관에 우산과 안전용품을 준비한 모습" fill priority sizes="(max-width: 767px) 100vw, 48vw" className="object-cover" />
          </div>
        </section>

        <div className={styles.hubShell}>
          <ShoppingHubProgress />

          <section aria-labelledby="shopping-missions-title">
            <div className={styles.sectionLead}>
              <span>오늘의 연습</span>
              <h2 id="shopping-missions-title">하고 싶은 미션을 골라보세요</h2>
              <p>처음이라면 첫 번째 미션부터 시작하면 쉬워요.</p>
            </div>
            <div className={styles.missionGrid}>
              {SHOPPING_MISSIONS.map((mission) => {
                const Icon = modeIcons[mission.mode];
                return (
                  <article key={mission.slug} className={`${styles.missionCard} ${styles[`accent_${mission.accent}`]}`}>
                    <div className={styles.missionVisual}>
                      <Image src={mission.visual.cardImage.src} alt={mission.visual.cardImage.alt} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-cover" />
                      <span><Icon />{mission.difficulty}</span>
                    </div>
                    <div className={styles.missionCopy}>
                      <span>약 {mission.estimatedMinutes}분</span>
                      <h3>{mission.title}</h3>
                      <p>{mission.summary}</p>
                      <Link href={`/shopping/missions/${mission.slug}`}>미션 알아보기 →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className={styles.safetyStrip} aria-labelledby="shopping-safety-title">
            <div>
              <span>안전한 쇼핑 습관</span>
              <h2 id="shopping-safety-title">주문 뒤에도 이것만 기억해요</h2>
            </div>
            <ul>
              <li><strong>배송</strong><span>문자 링크 대신 공식 앱 주문내역 확인</span></li>
              <li><strong>취소</strong><span>취소 금액과 환불 수단을 끝까지 확인</span></li>
              <li><strong>정기배송</strong><span>한 번 구매인지 매달 구매인지 확인</span></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
