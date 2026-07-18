"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import type { ShoppingMission } from "@/lib/shopping/schemas";
import { SHOPPING_PROGRESS_KEY, type ShoppingProgress } from "@/lib/shopping/progress";
import { CheckIcon } from "./ShoppingIcons";
import styles from "./shopping.module.css";

export default function ShoppingResult({ mission }: { mission: ShoppingMission }) {
  const rawProgress = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("dd-shopping-progress", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("dd-shopping-progress", onStoreChange);
      };
    },
    () => localStorage.getItem(SHOPPING_PROGRESS_KEY) ?? "",
    () => "",
  );
  const result = useMemo(() => {
    try {
      const saved = (JSON.parse(rawProgress || "null") as ShoppingProgress | null)?.lastResult;
      return saved?.missionSlug === mission.slug ? saved : undefined;
    } catch {
      return undefined;
    }
  }, [mission.slug, rawProgress]);

  return (
    <main className={styles.resultPage}>
      <section className={styles.resultHero}>
        <div className={styles.resultMark}><CheckIcon /></div>
        <span>미션 완료</span>
        <h1>{mission.shortTitle} 연습을 마쳤어요!</h1>
        <p>실제 주문이나 결제는 전혀 일어나지 않았습니다.</p>
        {result && <strong className={styles.resultScore}>확인 점수 {result.score}점</strong>}
        {result && mission.mode === "guided" && (
          <div className={styles.savedResult}>
            <span>배송비 포함 연습 총액 <strong>{result.totalPrice.toLocaleString("ko-KR")}원</strong></span>
            <span><CheckIcon /> 완료 기록이 이 기기에 저장됐어요</span>
          </div>
        )}
      </section>

      <section className={styles.learningCard} aria-labelledby="shopping-learning-title">
        <h2 id="shopping-learning-title">오늘 기억할 세 가지</h2>
        <ul>
          {mission.learningPoints.map((point) => <li key={point}><CheckIcon />{point}</li>)}
        </ul>
      </section>

      <section className={styles.afterPractice}>
        <span className={styles.adBoundary}>연습 종료 후 선택 영역</span>
        <h2>실제로 필요할 때만 살펴보세요</h2>
        <p>아래 버튼부터는 실제 판매 상품 안내로 이어질 수 있어요. 연습 점수와는 관계없으며 구매하지 않아도 됩니다.</p>
        <Link className={styles.collectionButton} href={`/shopping/products/${mission.collectionSlug}`}>조건에 맞는 제품 고르는 법 보기</Link>
      </section>

      <div className={styles.resultActions}>
        <Link href={`/shopping/missions/${mission.slug}/practice`}>다시 연습하기</Link>
        <Link href="/shopping">다른 미션 고르기</Link>
      </div>
    </main>
  );
}
