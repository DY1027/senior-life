"use client";

import Link from "next/link";
import { setActiveMission } from "@/features/shopping/storage/shopping-storage";
import { getCommerceMissionPracticeHref } from "@/features/shopping/engine/commerce-mission-evaluator";

export default function CommerceMissionStartLink({ missionSlug, className }: { missionSlug: string; className?: string }) {
  return (
    <Link href={getCommerceMissionPracticeHref(missionSlug)} className={className} onClick={() => setActiveMission(missionSlug)}>
      연습 시작하기
    </Link>
  );
}
