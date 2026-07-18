"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getShoppingMission } from "@/content/shopping";
import { readShoppingProgress, type ShoppingProgress } from "@/lib/shopping/progress";
import { readCart, readCommerceMissionCompletions, SHOPPING_STORAGE_EVENT } from "@/features/shopping/storage/shopping-storage";
import { getCommerceMissionLabel, getCommerceMissionPracticeHref } from "@/features/shopping/engine/commerce-mission-evaluator";
import styles from "./shopping.module.css";

export default function ShoppingHubProgress() {
  const [progress, setProgress] = useState<ShoppingProgress>();
  const [commerceState, setCommerceState] = useState<{ completed: string[]; active?: string }>({ completed: [] });

  useEffect(() => {
    const update = () => {
      setProgress(readShoppingProgress());
      setCommerceState({
        completed: readCommerceMissionCompletions().map((completion) => completion.missionSlug),
        active: readCart().activeMissionSlug,
      });
    };
    update();
    window.addEventListener("dd-shopping-progress", update);
    window.addEventListener(SHOPPING_STORAGE_EVENT, update);
    return () => {
      window.removeEventListener("dd-shopping-progress", update);
      window.removeEventListener(SHOPPING_STORAGE_EVENT, update);
    };
  }, []);

  if (!progress) return <div className={styles.progressPlaceholder} aria-hidden="true" />;

  const completedCount = new Set([...Object.keys(progress.completed), ...commerceState.completed]).size;
  const currentMission = progress.current ? getShoppingMission(progress.current.missionSlug) : undefined;
  const activeCommerceMission = getCommerceMissionLabel(commerceState.active);

  return (
    <aside className={styles.hubProgress} aria-label="내 쇼핑 연습 기록">
      <div>
        <span>이 기기에 저장된 기록</span>
        <strong>{completedCount > 0 ? `${completedCount}개 미션 완료` : "아직 완료한 미션이 없어요"}</strong>
        <p>가입하지 않아도 이 브라우저에만 안전하게 저장됩니다.</p>
      </div>
      {activeCommerceMission ? (
        <Link href={getCommerceMissionPracticeHref(commerceState.active)}>
          {activeCommerceMission} 계속하기
        </Link>
      ) : currentMission && (
        <Link href={`/shopping/missions/${currentMission.slug}/practice`}>
          {currentMission.shortTitle} {progress.current!.step + 1}단계부터 계속하기
        </Link>
      )}
    </aside>
  );
}
